import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Smart Notes → Quiz",
  description: "Terms of Use for Smart Notes → Quiz.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Terms of Use
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Last updated: September 20, 2026
        </p>

        <div className="mt-8 space-y-7 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              1. Using the App
            </h2>
            <p className="mt-2 leading-7">
              Smart Notes → Quiz is provided as a learning and study tool.
              You may use the app to enter notes, upload supported files, and
              generate quizzes for personal educational use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              2. Your Content
            </h2>
            <p className="mt-2 leading-7">
              You are responsible for the notes and files you provide to the
              app. Do not upload content that you do not have permission to use
              or that violates applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              3. Quiz Results
            </h2>
            <p className="mt-2 leading-7">
              Generated quizzes are intended to support learning and
              self-assessment. You should verify important information rather
              than relying on quiz results as a sole source of truth.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              4. Availability
            </h2>
            <p className="mt-2 leading-7">
              The app is provided on an as-available basis. Features may be
              changed, updated, temporarily unavailable, or removed as the
              project develops.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              5. Acceptable Use
            </h2>
            <p className="mt-2 leading-7">
              You agree not to misuse the app, attempt to disrupt its
              operation, bypass reasonable security controls, or use it for
              unlawful purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              6. Changes to These Terms
            </h2>
            <p className="mt-2 leading-7">
              These Terms of Use may be updated when the app or its features
              change. The latest version will be published on this page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
