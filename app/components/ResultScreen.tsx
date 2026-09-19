"use client";

import { QuizQuestion } from "../lib/quizGenerator";

type ResultScreenProps = {
  score: number;
  quizQuestions: QuizQuestion[];

  handleRestartQuiz: () => void;
  handleBackToNotes: () => void;
};

export default function ResultScreen({
  score,
  quizQuestions,
  handleRestartQuiz,
  handleBackToNotes,
}: ResultScreenProps) {
  const percentage = Math.round(
    (score / quizQuestions.length) * 100
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-6 py-5">
          <h1 className="text-2xl font-bold">
            Smart Notes
          </h1>

          <p className="text-sm text-slate-500">
            Quiz Results
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">
            🎉
          </div>

          <h2 className="mt-5 text-3xl font-bold">
            Quiz Completed!
          </h2>

          <p className="mt-3 text-slate-500">
            Here is your final result.
          </p>

          <div className="mt-10 rounded-2xl bg-blue-50 p-8">
            <p className="text-sm font-medium text-blue-600">
              Your Score
            </p>

            <p className="mt-3 text-5xl font-bold text-blue-700">
              {score} / {quizQuestions.length}
            </p>

            <p className="mt-3 text-lg font-semibold text-slate-700">
              {percentage}%
            </p>
          </div>

          <div className="mt-8">
            {percentage === 100 && (
              <p className="font-semibold text-green-600">
                Perfect score! Excellent work! 🌟
              </p>
            )}

            {percentage >= 60 &&
              percentage < 100 && (
                <p className="font-semibold text-blue-600">
                  Great job! Keep learning! 💪
                </p>
              )}

            {percentage < 60 && (
              <p className="font-semibold text-orange-600">
                Keep practicing. You can do better! 📚
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleRestartQuiz}
              className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>

            <button
              onClick={handleBackToNotes}
              className="flex-1 rounded-xl border border-slate-200 px-5 py-3 font-medium transition hover:bg-slate-50"
            >
              Back to Notes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
