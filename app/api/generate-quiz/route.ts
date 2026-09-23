import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import {
  generateQuizFromNotes,
  QuizQuestion,
} from "@/app/lib/quizGenerator";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

type GeminiQuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

function isValidQuizQuestion(
  value: unknown
): value is GeminiQuizQuestion {
  if (!value || typeof value !== "object") {
    return false;
  }

  const question = value as Record<string, unknown>;

  return (
    typeof question.question === "string" &&
    question.question.trim().length > 0 &&
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    question.options.every(
      (option) => typeof option === "string" && option.trim().length > 0
    ) &&
    typeof question.answer === "string" &&
    question.answer.trim().length > 0 &&
    question.options.includes(question.answer)
  );
}

function extractJson(text: string): unknown {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

async function generateQuizWithGemini(
  notes: string
): Promise<QuizQuestion[]> {
  const prompt = `
You are a quiz generator.

Create a multiple-choice quiz from the notes below.

Rules:
- Generate exactly 5 questions.
- Each question must have exactly 4 options.
- Each question must have exactly one correct answer.
- The correct answer must be one of the four options.
- Questions must be based only on the provided notes.
- Do not invent facts that are not supported by the notes.
- Make incorrect options plausible.
- Return ONLY valid JSON.
- Do not use Markdown.
- Do not wrap the JSON in a code block.

Return exactly this JSON structure:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "answer": "Correct option text"
    }
  ]
}

Notes:
${notes}
`;

  const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents: prompt,
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: {
                type: "string",
              },
              options: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              answer: {
                type: "string",
              },
            },
            required: ["question", "options", "answer"],
          },
        },
      },
      required: ["questions"],
    },
  },
});

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  const parsed = extractJson(text);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Gemini returned invalid JSON.");
  }

  const data = parsed as Record<string, unknown>;

  if (!Array.isArray(data.questions)) {
    throw new Error("Gemini response does not contain questions.");
  }

  const questions = data.questions.filter(isValidQuizQuestion);

  if (questions.length < 4) {
    throw new Error("Gemini returned fewer than 4 valid questions.");
  }
  return questions.slice(0, 5).map((item) => ({
  question: item.question,
  options: item.options,
  correctAnswer: item.answer,
}));
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { success } = await ratelimit.limit(`quiz:${ip}`);

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    const notes = body.notes;

    if (!notes || typeof notes !== "string") {
      return NextResponse.json(
        { error: "Notes are required." },
        { status: 400 }
      );
    }

    const trimmedNotes = notes.trim();

    if (trimmedNotes.length === 0) {
      return NextResponse.json(
        { error: "Notes cannot be empty." },
        { status: 400 }
      );
    }

    if (trimmedNotes.length > 20000) {
      return NextResponse.json(
        {
          error:
            "Notes are too long. Maximum 20,000 characters allowed.",
        },
        { status: 400 }
      );
    }

    try {
      const questions = await generateQuizWithGemini(trimmedNotes);


      return NextResponse.json({
        questions,
        source: "gemini",
      });
    } catch (geminiError) {
      console.error(
        "Gemini generation failed. Using local fallback:",
        geminiError
      );

      const questions = generateQuizFromNotes(trimmedNotes);

      if (questions.length < 4) {
        return NextResponse.json(
          {
            error:
              "Not enough distinct information to generate a 4-option quiz. Please provide more detailed notes.",
          },
          { status: 400 }
        );
      }


      return NextResponse.json({
        questions,
        source: "local-fallback",
      });
    }
  } catch (error) {
    console.error("Quiz generation error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate quiz. Please try again.",
      },
      { status: 500 }
    );
  }
}

