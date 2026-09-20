import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smart-notes-quiz.vercel.app"),
  title: "Smart Notes → Quiz",
  description: "Turn your notes into interactive quizzes.",
  keywords: [
    "smart notes",
    "quiz generator",
    "study notes",
    "online quiz",
    "learning tool",
  ],
  authors: [{ name: "Smart Notes" }],
  creator: "Smart Notes",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Smart Notes → Quiz",
    description: "Turn your notes into interactive quizzes.",
    type: "website",
    siteName: "Smart Notes → Quiz",
    images: [
      {
        url: "/smart-notes-logo.png",
        width: 790,
        height: 278,
        alt: "Smart Notes logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Notes → Quiz",
    description: "Turn your notes into interactive quizzes.",
    images: ["/smart-notes-logo.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

