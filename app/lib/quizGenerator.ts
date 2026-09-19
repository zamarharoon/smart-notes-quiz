export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function createOptions(
  correctAnswer: string,
  alternatives: string[]
): string[] {
  const normalizedCorrectAnswer =
    correctAnswer.trim().toLowerCase();

  const uniqueAlternatives = Array.from(
    new Map(
      alternatives
        .map((item) => item.trim())
        .filter(
          (item) =>
            item.length > 0 &&
            item.toLowerCase() !==
              normalizedCorrectAnswer
        )
        .map((item) => [
          item.toLowerCase(),
          item,
        ])
    ).values()
  );

  /*
   * 11G FIX 2
   *
   * We need exactly 3 different wrong answers
   * for a 4-option quiz.
   */

  if (uniqueAlternatives.length < 3) {
    return [];
  }

  const selectedAlternatives = shuffleArray(
    uniqueAlternatives
  ).slice(0, 3);

  return shuffleArray([
    correctAnswer.trim(),
    ...selectedAlternatives,
  ]);
}

function getBaseVerb(verb: string): string {
  const lowerVerb = verb.toLowerCase();

  const irregularVerbs: Record<string, string> = {
    has: "have",
    does: "do",
  };

  if (irregularVerbs[lowerVerb]) {
    return irregularVerbs[lowerVerb];
  }

  if (lowerVerb.endsWith("ies")) {
    return verb.slice(0, -3) + "y";
  }

  if (
    lowerVerb.endsWith("ches") ||
    lowerVerb.endsWith("shes") ||
    lowerVerb.endsWith("sses") ||
    lowerVerb.endsWith("xes") ||
    lowerVerb.endsWith("zes") ||
    lowerVerb.endsWith("oes")
  ) {
    return verb.slice(0, -2);
  }

  if (
    lowerVerb.endsWith("s") &&
    !lowerVerb.endsWith("ss")
  ) {
    return verb.slice(0, -1);
  }

  return verb;
}

export function generateQuizFromNotes(
  notes: string
): QuizQuestion[] {
  const cleanedNotes = notes
  .replace(/\r\n/g, "\n")
  .replace(/\r/g, "\n")
  .replace(/[ \t]+/g, " ")
  .trim();

  if (!cleanedNotes) {
    return [];
  }

  /*
   * =====================================================
   * SPLIT NOTES INTO SENTENCES
   * =====================================================
   */

const structuredNotes = cleanedNotes
  // Split BEFORE workbook headings
  .replace(
    /\s+(?=(?:What You Will Learn|Rules of Learning|The AI Mindset|Week \d+|Day \d+|Goal:|Ask AI:|Tasks:|Reflection:))/gi,
    "\n"
  )

  // Split AFTER workbook headings
  .replace(
    /(What You Will Learn|Rules of Learning|The AI Mindset)\s+/gi,
    "$1\n"
  );

const sentences = structuredNotes
  .split(/(?<=[.!?])\s+|\n+/)
  .map((sentence) => sentence.trim())
  .filter((sentence) => {
    if (sentence.length < 10) return false;
    if (/^\d+$/.test(sentence)) return false;
    if (/^[•\s\d]+$/.test(sentence)) return false;

    return true;
  });

  /*
   * =====================================================
   * 11E-2 — FILTER WORKBOOK INSTRUCTIONS
   * =====================================================
   *
   * These are instructions/headings, not facts.
   * They should never become quiz questions.
   */

const filteredSentences = sentences.filter((sentence) => {
  const lowerSentence = sentence.toLowerCase().trim();

  // Remove document title
  if (
    lowerSentence.includes("ai software creator workbook") ||
    lowerSentence.includes("learn to make apps with ai")
  ) {
    return false;
  }

  // Remove obvious headings
  if (
    lowerSentence === "what you will learn" ||
    lowerSentence === "rules of learning" ||
    lowerSentence === "the ai mindset"
  ) {
    return false;
  }

  // Remove workbook headings / labels
  if (
    /^(duration:|section \d+|goal:|ask ai:|tasks:|reflection:|day \d+|week \d+|mentor:|date:)/i.test(
      lowerSentence
    )
  ) {
    return false;
  }

  // Remove checklist / emoji instructions
  if (/^[^a-z0-9]*[✅☑️✔️📝✏️🔹•]/i.test(sentence)) {
    return false;
  }

  // Remove direct instructions
  if (
    /^(write|draw|save|make|choose|highlight|check|review|follow|test|fix|add|include|prepare|practice|publish|copy|show|select|circle)\b/i.test(
      lowerSentence
    )
  ) {
    return false;
  }

  // Remove obvious AI prompts / questions
  if (
    /^(how|what|when|where|why|which|who|whose|whom)\b/i.test(
      lowerSentence
    )
  ) {
    return false;
  }

  // Remove bracketed questions / reflections
  if (
    /^\([^)]*\?\s*\)?$/i.test(sentence.trim()) ||
    lowerSentence.includes("?")
  ) {
    return false;
  }

  // Remove workbook guidance
  if (
    lowerSentence.includes("in this workbook") ||
    lowerSentence.includes("your job is") ||
    lowerSentence.includes("the clearer you speak") ||
    lowerSentence.includes("you don’t need coding") ||
    lowerSentence.includes("you don't need coding") ||
    lowerSentence.includes("you just need curiosity")
  ) {
    return false;
  }

  return true;
});


  /*
   * =====================================================
   * FACTS ARRAY
   * =====================================================
   */

  const facts: {
    question: string;
    answer: string;
  }[] = [];

  /*
   * =====================================================
   * FACT EXTRACTION
   * =====================================================
   *
   * IMPORTANT:
   * Use filteredSentences here.
   */

for (const sentence of filteredSentences) {
    /*
     * =====================================================
     * TYPE 3 — NUMBERS / DATES
     * =====================================================
     */

    const dateMatch = sentence.match(
      /^(.+?)\s+(?:was|were)\s+(created|released|developed|founded|invented|introduced|launched|established)\s+(?:in|on)?\s*(\d{4})\.?$/i
    );

    if (dateMatch) {
      const subject = dateMatch[1].trim();
      const action = dateMatch[2].toLowerCase();
      const date = dateMatch[3].trim();

      let question = "";

      if (action === "created") {
        question =
          `When was ${subject} created?`;
      } else if (action === "released") {
        question =
          `When was ${subject} released?`;
      } else if (action === "developed") {
        question =
          `When was ${subject} developed?`;
      } else if (action === "founded") {
        question =
          `When was ${subject} founded?`;
      } else if (action === "invented") {
        question =
          `When was ${subject} invented?`;
      } else if (action === "introduced") {
        question =
          `When was ${subject} introduced?`;
      } else if (action === "launched") {
        question =
          `When was ${subject} launched?`;
      } else if (action === "established") {
        question =
          `When was ${subject} established?`;
      }

      if (
        subject.length >= 2 &&
        date.length === 4 &&
        question
      ) {
        facts.push({
          question,
          answer: date,
        });
      }

      continue;
    }

    /*
     * =====================================================
     * TYPE 4 — NUMBER / POSSESSION FACTS
     * =====================================================
     */

    const possessionMatch = sentence.match(
      /^(.+?)\s+(has|have|contains|contain|includes|include)\s+(.+?)\.?$/i
    );

    if (possessionMatch) {
      const subject =
        possessionMatch[1].trim();

      const verb =
        possessionMatch[2].toLowerCase();

      const object =
        possessionMatch[3]
          .replace(/[.!?]+$/, "")
          .trim();

      if (
        subject.length >= 2 &&
        object.length >= 2
      ) {
        let question = "";

        if (
          verb === "has" ||
          verb === "have"
        ) {
          question =
            `What does ${subject.toLowerCase()} have?`;
        } else {
          question =
            `What does ${subject.toLowerCase()} ${getBaseVerb(verb)}?`;
        }

        facts.push({
          question,
          answer: object,
        });
      }

      continue;
    }

    /*
     * =====================================================
     * TYPE 1 — IS / ARE FACTS
     * =====================================================
     */

    const isMatch = sentence.match(
      /^(.+?)\s+(is|are|was|were)\s+(.+)$/i
    );

    if (isMatch) {
      const subject =
        isMatch[1].trim();

      const answer =
        isMatch[3]
          .replace(/[.!?]+$/, "")
          .trim();

      /*
       * Do not treat normal questions as facts.
       */

      const lowerSentence =
        sentence.toLowerCase().trim();

      const questionStarters = [
        "who ",
        "what ",
        "when ",
        "where ",
        "why ",
        "how ",
        "which ",
        "whose ",
        "whom ",
        "is ",
        "are ",
        "was ",
        "were ",
        "do ",
        "does ",
        "did ",
        "can ",
        "could ",
        "will ",
        "would ",
        "should ",
        "shall ",
        "may ",
        "might ",
        "has ",
        "have ",
        "had ",
      ];

      const isQuestion =
        questionStarters.some(
          (starter) =>
            lowerSentence.startsWith(starter)
        );

const genericSubjects = [
  "this",
  "that",
  "it",
  "there",
  "i",
  "you",
  "we",
  "they",
  "he",
  "she",
];


      const lowerSubject =
        subject.toLowerCase();

      const isGenericSubject =
        genericSubjects.includes(
          lowerSubject
        );

      const instructionStarters = [
        "goal:",
        "ask ai:",
        "tasks:",
        "reflection:",
        "day ",
        "week ",
        "section ",
        "what you will learn",
        "rules of learning",
        "prompting cheat sheet",
        "my project portfolio",
        "certificate of completion",
      ];

      const isInstruction =
        instructionStarters.some(
          (starter) =>
            lowerSentence.startsWith(starter) ||
            lowerSentence.includes(
              ` ${starter}`
            )
        );

      if (
        !isQuestion &&
        !isGenericSubject &&
        !isInstruction &&
        subject.length >= 2 &&
        answer.length >= 2
      ) {
        facts.push({
          question:
            `What is ${subject}?`,
          answer,
        });
      }

      continue;
    }

    /*
     * =====================================================
     * TYPE 2 — ACTION VERB FACTS
     * =====================================================
     */

    const actionVerbs = [
      "processes",
      "process",
      "stores",
      "store",
      "executes",
      "execute",
      "creates",
      "create",
      "accepts",
      "accept",
      "displays",
      "display",
      "produces",
      "produce",
      "runs",
      "run",
      "controls",
      "control",
      "provides",
      "provide",
      "performs",
      "perform",
      "connects",
      "connect",
      "sends",
      "send",
      "receives",
      "receive",
      "absorbs",
      "absorb",
      "takes",
      "take",
      "freezes",
      "freeze",
      "holds",
      "hold",
      "supports",
      "support",
      "changes",
      "change",
      "contains",
      "contain",
      "includes",
      "include",
      "powers",
      "power",
      "handles",
      "handle",
      "manages",
      "manage",
      "shows",
      "show",
      "allows",
      "allow",
      "enables",
      "enable",
      "helps",
      "help",
      "converts",
      "convert",
      "transfers",
      "transfer",
      "communicates",
      "communicate",
      "loads",
      "load",
      "reads",
      "read",
      "calculates",
      "calculate",
      "downloads",
      "download",
      "uploads",
      "upload",
    ];

    let foundVerb = "";
    let subject = "";
    let object = "";

    for (const verb of actionVerbs) {
      const pattern = new RegExp(
        `^(.+?)\\s+${verb}\\s+(.+)$`,
        "i"
      );

      const match =
        sentence.match(pattern);

      if (match) {
        subject =
          match[1].trim();

        object =
          match[2]
            .replace(/[.!?]+$/, "")
            .trim();

        foundVerb = verb;

        break;
      }
    }

    if (
      !foundVerb ||
      subject.length < 2 ||
      object.length < 2
    ) {
      continue;
    }

    const lowerSubject =
      subject.toLowerCase();

    const isPluralSubject =
      lowerSubject === "we" ||
      lowerSubject === "you" ||
      lowerSubject === "they" ||
      lowerSubject.endsWith("s");

    let question = "";

    if (isPluralSubject) {
      question =
        `What do ${lowerSubject} ${getBaseVerb(foundVerb)}?`;
    } else {
      question =
        `What does ${lowerSubject} ${getBaseVerb(foundVerb)}?`;
    }

    facts.push({
      question,
      answer: object,
    });
  }

  /*
   * =====================================================
   * REMOVE DUPLICATES
   * =====================================================
   */

  const uniqueFacts =
    Array.from(
      new Map(
        facts.map((fact) => [
          `${fact.question.toLowerCase()}|${fact.answer.toLowerCase()}`,
          fact,
        ])
      ).values()
    );

  /*
   * =====================================================
   * GENERATE QUIZ
   * =====================================================
   */

  const questions: QuizQuestion[] = [];

  /*
   * =====================================================
   * MINIMUM FACT VALIDATION
   * =====================================================
   *
   * A 4-option MCQ needs:
   * 1 correct answer + 3 wrong answers.
   */

  for (const fact of uniqueFacts) {

    /*
     * Maximum 5 questions.
     */

    if (questions.length >= 5) {
      break;
    }

    /*
     * Find alternative answers.
     */

    const alternatives =
      Array.from(
        new Set(
          uniqueFacts
            .map((item) =>
              item.answer.trim()
            )
            .filter(
              (answer) =>
                answer.toLowerCase() !==
                fact.answer.trim().toLowerCase()
            )
        )
      );

    /*
     * Need at least 3 wrong answers.
     */

    if (alternatives.length < 3) {
      continue;
    }

    const options =
      createOptions(
        fact.answer,
        alternatives
      );

    /*
     * Every question must have
     * exactly 4 options.
     */

    if (options.length !== 4) {
      continue;
    }

    questions.push({
      question: fact.question,
      options,
      correctAnswer: fact.answer,
    });
  }

  return questions;
}