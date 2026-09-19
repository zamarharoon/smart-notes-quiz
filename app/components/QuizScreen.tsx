"use client";

import { QuizQuestion } from "../lib/quizGenerator";

type QuizScreenProps = {
  quizQuestions: QuizQuestion[];
  currentQuestion: number;
  selectedAnswer: string | null;

  handleAnswerSelect: (option: string) => void;
  handleBackToNotes: () => void;
  handleNextQuestion: () => void;
};

export default function QuizScreen({
  quizQuestions,
  currentQuestion,
  selectedAnswer,
  handleAnswerSelect,
  handleBackToNotes,
  handleNextQuestion,
}: QuizScreenProps) {
  const question = quizQuestions[currentQuestion];

  const isCorrect =
    selectedAnswer === question.correctAnswer;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              Smart Notes
            </h1>

            <p className="text-sm text-slate-500">
              Quiz Mode
            </p>
          </div>

          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
            Question {currentQuestion + 1} of{" "}
            {quizQuestions.length}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm text-slate-500">
              <span>Quiz Progress</span>

              <span>
                {currentQuestion + 1}/
                {quizQuestions.length}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${
                    ((currentQuestion + 1) /
                      quizQuestions.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-blue-600">
              Question {currentQuestion + 1}
            </p>

            <h2 className="mt-3 text-2xl font-bold leading-9">
              {question.question}
            </h2>
          </div>

          <div className="mt-8 space-y-3">
            {question.options.map(
              (option, index) => {
                const isSelected =
                  selectedAnswer === option;

                const isCorrectAnswer =
                  option === question.correctAnswer;

                let optionClass =
                  "border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50";

                if (selectedAnswer !== null) {
                  if (isCorrectAnswer) {
                    optionClass =
                      "border-green-500 bg-green-50";
                  } else if (isSelected) {
                    optionClass =
                      "border-red-500 bg-red-50";
                  } else {
                    optionClass =
                      "border-slate-200 bg-slate-50";
                  }
                }

                return (
                  <button
                    key={option}
                    onClick={() =>
                      handleAnswerSelect(option)
                    }
                    disabled={
                      selectedAnswer !== null
                    }
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${optionClass}`}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-semibold">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span className="font-medium">
                      {option}
                    </span>
                  </button>
                );
              }
            )}
          </div>

          {selectedAnswer !== null && (
            <div
              className={`mt-6 rounded-xl p-4 ${
                isCorrect
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <p className="font-semibold">
                {isCorrect
                  ? "Correct! 🎉"
                  : "Incorrect! ❌"}
              </p>

              {!isCorrect && (
                <p className="mt-1 text-sm">
                  The correct answer is{" "}
                  <strong>
                    {question.correctAnswer}
                  </strong>
                  .
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBackToNotes}
              className="rounded-xl border border-slate-200 px-5 py-3 font-medium transition hover:bg-slate-50"
            >
              Back to Notes
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {currentQuestion ===
              quizQuestions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
