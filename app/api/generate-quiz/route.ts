import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { generateQuizFromNotes } from "@/app/lib/quizGenerator";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
});

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
    });
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