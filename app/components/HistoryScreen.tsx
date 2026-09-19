"use client";

type QuizHistoryItem = {
  id: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
};

type HistoryScreenProps = {
  quizHistory: QuizHistoryItem[];
  handleClearHistory: () => void;
  setShowHistory: (show: boolean) => void;
};

export default function HistoryScreen({
  quizHistory,
  handleClearHistory,
  setShowHistory,
}: HistoryScreenProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              Smart Notes
            </h1>

            <p className="text-sm text-slate-500">
              Quiz History
            </p>
          </div>

          <button
            onClick={() => setShowHistory(false)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
          >
            ← Back
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              📊 Quiz History
            </h2>

            <p className="mt-2 text-slate-500">
              Review your previous quiz results.
            </p>
          </div>

          {quizHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              🗑️ Clear History
            </button>
          )}
        </div>

        {quizHistory.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">
              📚
            </div>

            <h3 className="mt-4 text-xl font-semibold">
              No quiz history yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Complete a quiz and your result will appear here.
            </p>

            <button
              onClick={() => setShowHistory(false)}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Create a Quiz
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {quizHistory.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Quiz Result
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {item.score} / {item.totalQuestions}
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-blue-700">
                      {item.percentage}%
                    </p>

                    <p className="text-xs text-blue-600">
                      Score
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t pt-4">
                  <p className="text-sm text-slate-500">
                    📅 {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
