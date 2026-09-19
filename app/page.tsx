"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import {
  generateQuizFromNotes,
  QuizQuestion,
} from "./lib/quizGenerator";
import NotesScreen from "./components/NotesScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import HistoryScreen from "./components/HistoryScreen";

type QuizHistoryItem = {
  id: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
};

export default function Home() {
  const [notes, setNotes] = useState("");

  const [quizStarted, setQuizStarted] = useState(false);

  const [quizQuestions, setQuizQuestions] = useState<
    QuizQuestion[]
  >([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [score, setScore] = useState(0);

  const [quizCompleted, setQuizCompleted] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [fileMessage, setFileMessage] = useState("");
  const [isFileLoading, setIsFileLoading] = useState(false);

const [quizHistory, setQuizHistory] =
  useState<QuizHistoryItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const savedHistory =
        localStorage.getItem("quizHistory");

      if (!savedHistory) {
        return [];
      }

      return JSON.parse(savedHistory);
    } catch (error) {
      console.error(
        "Could not load quiz history:",
        error
      );

      return [];
    }
  });

const [showHistory, setShowHistory] =
  useState(false);


/*
 * =========================
 * SAVE HISTORY TO LOCALSTORAGE
 * =========================
 */

useEffect(() => {
  localStorage.setItem(
    "quizHistory",
    JSON.stringify(quizHistory)
  );
}, [quizHistory]);

  /*
   * =========================
   * FILE UPLOAD
   * =========================
   */
  const handleFileChange = async (
  event: ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }
  setIsFileLoading(true);

  // File size validation: maximum 10 MB
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

 if (file.size > MAX_FILE_SIZE) {
  setSelectedFile(null);

  setFileMessage(
    "File is too large. Please upload a file smaller than 10 MB."
  );

  setIsFileLoading(false);

  return;
}

  const allowedTypes = [
    "text/plain",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

 if (!allowedTypes.includes(file.type)) {
  setSelectedFile(null);

  setFileMessage(
    "Please select a PDF, DOCX, or TXT file."
  );

  setIsFileLoading(false);

  return;
}

  setSelectedFile(file);
  setFileMessage("File selected successfully!");


    /*
     * =========================
     * TXT FILE
     * =========================
     */

    if (file.type === "text/plain") {
      try {
        setFileMessage("Reading TXT file...");

        const text = await file.text();

        setNotes(text);

        setFileMessage(
          "TXT file loaded successfully!"
        );
        setIsFileLoading(false);
      } catch (error) {
        console.error(
          "Error reading TXT file:",
          error
        );

        setFileMessage(
          "Could not read the TXT file."
        );
        setIsFileLoading(false);
      }

      return;
    }

    /*
     * =========================
     * PDF FILE
     * =========================
     */

    if (file.type === "application/pdf") {
      try {
        setFileMessage("Reading PDF file...");

        const pdfjsLib = await import(
          "pdfjs-dist/legacy/build/pdf.mjs"
        );

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const arrayBuffer =
          await file.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({
          data: arrayBuffer,
        }).promise;

        let extractedText = "";

        for (
          let pageNumber = 1;
          pageNumber <= pdf.numPages;
          pageNumber++
        ) {
          const page =
            await pdf.getPage(pageNumber);

          const textContent =
            await page.getTextContent();

          const pageText =
            textContent.items
              .map((item) => {
                if ("str" in item) {
                  return item.str;
                }

                return "";
              })
              .join(" ");

          extractedText +=
            pageText + "\n\n";
        }

        const finalText =
          extractedText.trim();

        if (!finalText) {
          setFileMessage(
            "PDF opened, but no selectable text was found."
          );
          setIsFileLoading(false);

          return;
        }

        setNotes(finalText);

        setFileMessage(
          "PDF text extracted successfully!"
        );
        setIsFileLoading(false);
      } catch (error) {
        console.error(
          "Error reading PDF:",
          error
        );

        setFileMessage(
          "Could not read the PDF file. Please try another PDF."
        );
        setIsFileLoading(false);
      }

      return;
    }

    /*
     * =========================
     * DOCX FILE
     * =========================
     */

    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        setFileMessage("Reading DOCX file...");

        const mammoth =
          await import("mammoth");

        const arrayBuffer =
          await file.arrayBuffer();

        const result =
          await mammoth.extractRawText({
            arrayBuffer,
          });

        const extractedText =
          result.value.trim();

        if (!extractedText) {
          setFileMessage(
            "DOCX opened, but no text was found."
          );
          setIsFileLoading(false);

          return;
        }

        setNotes(extractedText);

        setFileMessage(
          "DOCX text extracted successfully!"
        );
        setIsFileLoading(false);
      } catch (error) {
        console.error(
          "Error reading DOCX:",
          error
        );

        setFileMessage(
          "Could not read the DOCX file. Please try another DOCX file."
        );
        setIsFileLoading(false);
      }

      return;
    }
  };

  /*
   * =========================
   * GENERATE QUIZ
   * =========================
   */

  const handleGenerateQuiz = () => {
    if (!notes.trim()) {
      alert(
        "Please enter notes or upload a file first."
      );
      

      return;
    }
    if (notes.trim().length < 50) {
  alert(
    "Please enter at least 50 characters of notes to generate a good quiz."
  );

  return;
}

    const generatedQuestions =
      generateQuizFromNotes(notes);

  if (generatedQuestions.length === 0) {
  alert(
    "Not enough distinct information to generate a 4-option quiz. Please add more varied facts."
  );

  return;
}

    setQuizQuestions(
      generatedQuestions
    );

    setQuizStarted(true);

    setQuizCompleted(false);

    setCurrentQuestion(0);

    setSelectedAnswer(null);

    setScore(0);
  };

  /*
   * =========================
   * SELECT ANSWER
   * =========================
   */

  const handleAnswerSelect = (
    answer: string
  ) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(answer);

    const question =
      quizQuestions[currentQuestion];

    if (
      answer === question.correctAnswer
    ) {
      setScore(
        (previousScore) =>
          previousScore + 1
      );
    }
  };

  /*
   * =========================
   * NEXT / FINISH QUIZ
   * =========================
   */

const handleNextQuestion = () => {
  if (selectedAnswer === null) {
    return;
  }




  if (currentQuestion < quizQuestions.length - 1) {
    setCurrentQuestion(
      (previousQuestion) => previousQuestion + 1
    );

    setSelectedAnswer(null);
  } else {
    const finalScore = score;
        

    const finalPercentage = Math.round(
      (finalScore / quizQuestions.length) * 100
    );
    setScore(finalScore);

    const historyItem: QuizHistoryItem = {
      id: Date.now().toString(),
      score: finalScore,
      totalQuestions: quizQuestions.length,
      percentage: finalPercentage,
      date: new Date().toLocaleString(),
    };

    setQuizHistory((previousHistory) => [
      historyItem,
      ...previousHistory,
    ]);

    setQuizCompleted(true);
  }
};

  /*
   * =========================
   * RESTART QUIZ
   * =========================
   */

  const handleRestartQuiz = () => {
    setQuizStarted(true);

    setQuizCompleted(false);

    setCurrentQuestion(0);

    setSelectedAnswer(null);

    setScore(0);
  };

  /*
   * =========================
   * BACK TO NOTES
   * =========================
   */

  const handleBackToNotes = () => {
    setQuizStarted(false);

    setQuizCompleted(false);

    setCurrentQuestion(0);

    setSelectedAnswer(null);

    setScore(0);
  };
  const handleClearHistory = () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete all quiz history?"
  );

  if (!confirmed) {
    return;
  }

  setQuizHistory([]);
  localStorage.removeItem("quizHistory");
};

  /*
   * =========================
   * RESULT SCREEN
   * =========================
   */
if (quizCompleted) {
  return (
    <ResultScreen
      score={score}
      quizQuestions={quizQuestions}
      handleRestartQuiz={handleRestartQuiz}
      handleBackToNotes={handleBackToNotes}
    />
  );
}
  /*
   * =========================
   * QUIZ SCREEN
   * =========================
   */

 if (quizStarted) {
  return (
    <QuizScreen
      quizQuestions={quizQuestions}
      currentQuestion={currentQuestion}
      selectedAnswer={selectedAnswer}
      handleAnswerSelect={handleAnswerSelect}
      handleBackToNotes={handleBackToNotes}
      handleNextQuestion={handleNextQuestion}
    />
  );
}
  /*
 * HISTORY SCREEN
 */
if (showHistory) {
  return (
    <HistoryScreen
      quizHistory={quizHistory}
      handleClearHistory={handleClearHistory}
      setShowHistory={setShowHistory}
    />
  );
}

/*
 * NOTES SCREEN
 */
return (
  <NotesScreen
    notes={notes}
    setNotes={setNotes}
    handleFileChange={handleFileChange}
    isFileLoading={isFileLoading}
    selectedFile={selectedFile}
    fileMessage={fileMessage}
    handleGenerateQuiz={handleGenerateQuiz}
    setShowHistory={setShowHistory}
  />
);
}