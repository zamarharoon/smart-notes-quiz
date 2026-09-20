import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Smart Notes → Quiz",
  description: "Privacy Policy for Smart Notes → Quiz.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Privacy Policy
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Last updated: September 20, 2026
        </p>

        <div className="mt-8 space-y-7 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              1. Information You Provide
            </h2>
            <p className="mt-2 leading-7">
              Smart Notes → Quiz allows you to enter study notes or upload
              supported files to generate quizzes. The content you provide is
              used to provide the quiz generation functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              2. Local Quiz History
            </h2>
            <p className="mt-2 leading-7">
              Quiz history is stored in your browser&apos;s local storage.
              This information is kept on your device and can be cleared using
              the Clear History option in the app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              3. Uploaded Files
            </h2>
            <p className="mt-2 leading-7">
              Supported files are processed to extract their text for quiz
              generation. The app does not require you to create an account
              before using the core quiz features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              4. Cookies and Tracking
            </h2>
            <p className="mt-2 leading-7">
              Smart Notes → Quiz does not intentionally use advertising
              cookies or third-party tracking for the core app experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              5. Data Security
            </h2>
            <p className="mt-2 leading-7">
              Reasonable technical measures are used to protect the app and
              its data flows. However, no internet service can guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              6. Changes to This Policy
            </h2>
            <p className="mt-2 leading-7">
              This Privacy Policy may be updated when the app&apos;s features
              or data practices change. The updated version will be published
              on this page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
