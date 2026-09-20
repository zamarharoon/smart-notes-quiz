# Smart Notes → Quiz

A beginner-friendly Next.js web app that turns study notes into interactive quizzes.

## Live Demo

https://smart-notes-quiz.vercel.app/

## GitHub

https://github.com/zamarharoon/smart-notes-quiz

## About

Smart Notes → Quiz allows users to enter study notes or upload a file and generate a multiple-choice quiz from the provided content.

The project was built as a practical full-stack Next.js application with a focus on usability, validation, security, and responsive design.

## Features

* Enter notes manually
* Upload PDF, DOCX, or TXT files
* Maximum file size: 10 MB
* Generate multiple-choice quizzes from notes
* Questions are generated from the user's provided content
* Four answer options per question
* Immediate answer feedback
* Quiz score and result screen
* Try Again functionality
* Quiz History
* Clear History
* Responsive mobile-friendly interface
* Privacy Policy and Terms pages
* Rate limiting for the quiz API

## Tech Stack

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* Next.js App Router
* PDF.js
* Mammoth
* Upstash Redis
* Upstash Ratelimit

## How It Works

1. The user enters study notes or uploads a supported file.
2. The application extracts the text when a file is uploaded.
3. The notes are sent to the `/api/generate-quiz` API route.
4. The server validates the request.
5. Rate limiting is applied to the API request.
6. The local quiz generator creates questions from the supplied notes.
7. The generated quiz is displayed in the browser.
8. The user answers the questions and receives immediate feedback.
9. The final score is displayed and the quiz can be saved in History.

## Current Quiz Generation

The current version uses a **local rule-based quiz generator**.

OpenAI generation is not currently active because API credits are not configured for the project. The application therefore generates quizzes locally from the user's notes without requiring an external AI API call.

## File Upload

Supported file types:

* PDF
* DOCX
* TXT

Maximum upload size:

**10 MB**

## Security

The application includes several security measures:

* Upstash Redis rate limiting
* Maximum of 5 quiz API requests per minute
* Input validation
* Maximum notes length of 20,000 characters
* Environment variables for sensitive configuration
* `.env.local` excluded from Git
* Security headers
* HTTPS deployment through Vercel
* Generic server error responses

## Project Structure

```text
smart-notes-quiz/
├── app/
│   ├── api/
│   │   └── generate-quiz/
│   │       └── route.ts
│   ├── components/
│   │   ├── HistoryScreen.tsx
│   │   ├── NotesScreen.tsx
│   │   ├── QuizScreen.tsx
│   │   └── ResultScreen.tsx
│   ├── lib/
│   │   ├── pdf.ts
│   │   └── quizGenerator.ts
│   ├── privacy/
│   │   └── page.tsx
│   ├── terms/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   ├── favicon.png
│   └── smart-notes-logo.png
├── .env.local
├── next.config.ts
├── package.json
└── README.md
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/zamarharoon/smart-notes-quiz.git
cd smart-notes-quiz
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file and configure the required environment variables.

Then run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts

Run the development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Run the production server:

```bash
npm run start
```

## Testing & Verification

The application has been tested for:

* Manual notes input
* Quiz generation
* PDF upload
* DOCX upload
* TXT upload
* File size validation
* Empty input validation
* Insufficient notes validation
* Quiz answer feedback
* Score calculation
* Quiz History
* Clear History
* API error handling
* API rate limiting
* Mobile responsiveness
* Production deployment

The final production verification was completed on the deployed Vercel application.

## Deployment

The application is deployed using Vercel.

Live application:

https://smart-notes-quiz.vercel.app/

The `/api/generate-quiz` route runs server-side as a Next.js serverless API function.

## Future Improvements

Planned improvements include:

* AI-powered quiz generation when API credits are available
* More advanced question generation
* Additional file formats
* User authentication
* Cloud-based quiz history
* More quiz customization options

## Current Status

**APP COMPLETE ✅**

The application development phase is complete and the project is ready for portfolio presentation.

## License

This project is currently intended as a personal learning and portfolio project.

