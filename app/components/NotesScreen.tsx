"use client";

import { ChangeEvent } from "react";
import Image from "next/image";


type NotesScreenProps = {
  notes: string;
  setNotes: (notes: string) => void;

  handleFileChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;

  isFileLoading: boolean;
  selectedFile: File | null;
  fileMessage: string;

  handleGenerateQuiz: () => void;

  setShowHistory: (show: boolean) => void;
};

export default function NotesScreen({
  notes,
  setNotes,
  handleFileChange,
  isFileLoading,
  selectedFile,
  fileMessage,
  handleGenerateQuiz,
  setShowHistory,
}: NotesScreenProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
 <Image
  src="/smart-notes-logo.png"
  alt="Smart Notes logo"
  width={790}
  height={278}
  className="h-auto w-48 object-contain sm:w-64"
/>
</div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(true)}
className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-50 sm:flex-none sm:px-4"            >
              📊 History
            </button>

            <div className="flex-1 rounded-full bg-blue-50 px-3 py-2 text-center text-sm font-medium text-blue-600 sm:flex-none sm:px-4">
              Quiz Generator
            </div>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            AI Powered Learning
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:mt-6 sm:text-5xl">
            Turn your notes into a quiz
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
            Add your study notes and Smart Notes will help you create
            practice questions so you can test your knowledge.
          </p>
        </div>
        <div className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border bg-white p-4 shadow-sm sm:mt-12 sm:p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold">
              Add your notes
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Paste your study material below or upload a file.
            </p>
          </div>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Paste your notes here..."
            className="min-h-64 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-5">
            <label
              htmlFor="notes-file"
className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-blue-400 hover:bg-blue-50 sm:p-6"            >
              <div className="text-3xl">
                📁
              </div>

              <p className="mt-2 font-medium">
                Click to upload notes
              </p>

              <p className="mt-1 text-sm text-slate-500">
                PDF, DOCX, or TXT
              </p>
            </label>

            <input
              id="notes-file"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              disabled={isFileLoading}
              className="hidden"
            />

            {isFileLoading && (
              <div className="mt-4 rounded-xl bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-600">
                  ⏳ Processing file... Please wait.
                </p>
              </div>
            )}

            {selectedFile && (
              <div className="mt-4 rounded-xl bg-green-50 p-4">
                <p className="font-medium text-green-700">
                  📄 {selectedFile.name}
                </p>

                <p className="mt-1 text-sm text-green-600">
                  {fileMessage}
                </p>
              </div>
            )}

            {selectedFile &&
              notes.trim() &&
              !isFileLoading && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    📄 Extracted Text
                  </p>

                  <div className="mt-3 max-h-60 overflow-y-auto rounded-lg bg-white p-4 text-sm leading-6 text-slate-600">
                    {notes}
                  </div>
                </div>
              )}

            {fileMessage && !selectedFile && (
              <div className="mt-4 rounded-xl bg-red-50 p-4">
                <p className="text-sm font-medium text-red-600">
                  {fileMessage}
                </p>
              </div>
            )}
          </div>

          <div className="mt-5">
            <button
              onClick={handleGenerateQuiz}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Generate Quiz
            </button>
          </div>
        </div>

        <div className="mx-auto mt-8 grid w-full max-w-3xl gap-4 sm:mt-12 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-5">
            <div className="text-2xl">
              📝
            </div>

            <h3 className="mt-3 font-semibold">
              Add Notes
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Add your study material easily.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="text-2xl">
              🤖
            </div>

            <h3 className="mt-3 font-semibold">
              AI Quiz
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Generate questions from your notes.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="text-2xl">
              📊
            </div>

            <h3 className="mt-3 font-semibold">
              Track Score
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Test yourself and see your results.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}









