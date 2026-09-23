\# Smart Notes → Quiz



An AI-powered full-stack web application that turns your study notes into interactive multiple-choice quizzes using Google Gemini AI.



\## Features



\* Enter notes manually or upload PDF, DOCX, or TXT files

\* Generate AI-powered quizzes using Google Gemini

\* Four-option multiple-choice questions

\* Instant answer feedback

\* Quiz results and score tracking

\* Try Again functionality

\* Quiz history stored in the browser

\* Server-side input validation

\* Server-side Gemini API integration

\* Local fallback quiz generator if AI generation is unavailable

\* Upstash Redis API rate limiting

\* Security headers

\* HTTPS deployment with Vercel

\* Privacy and Terms pages

\* Responsive interface for desktop and mobile devices



\## How It Works



1\. Enter or upload your study notes.

2\. The frontend sends the notes to the Next.js backend API.

3\. The backend validates the request.

4\. The backend sends the notes to Google Gemini AI.

5\. Gemini generates structured quiz questions.

6\. The backend validates the AI response.

7\. The quiz is returned to the frontend.

8\. If AI generation is unavailable, the application can use a local fallback generator.

9\. The user answers the quiz and receives feedback and a final score.

10\. Quiz history is stored locally in the browser.



\## Backend



The application uses a Next.js server-side API route as its backend:



`app/api/generate-quiz/route.ts`



The backend is responsible for:



\* Receiving quiz-generation requests

\* Validating incoming notes

\* Applying API rate limiting

\* Calling Google Gemini AI securely

\* Validating the generated quiz response

\* Handling AI failures with a local fallback

\* Keeping the Gemini API key on the server side



The Gemini API key is stored in environment variables and is never exposed directly to the browser.



\## AI Quiz Generation



The application uses Google Gemini for quiz generation through the Google GenAI SDK.



The current AI model configured for quiz generation is:



`gemini-3.5-flash-lite`



The application also includes a local rule-based fallback generator so that quiz generation can still work when AI generation is unavailable.



\## Security



The application includes several security measures:



\* Server-side Gemini API calls

\* Environment variables for API secrets

\* Upstash Redis rate limiting

\* Request validation

\* Maximum notes length validation

\* File upload size validation

\* Security response headers

\* `.env.local` excluded from Git

\* API key protection



The application currently limits quiz-generation requests to 5 requests per minute per client IP.



\## File Support



Supported upload formats:



\* PDF

\* DOCX

\* TXT



Maximum file size:



10 MB



\## Tech Stack



\### Frontend



\* Next.js

\* React

\* TypeScript

\* Tailwind CSS



\### Backend



\* Next.js App Router API Routes

\* Server-side validation

\* Upstash Redis



\### AI



\* Google Gemini AI

\* Google GenAI SDK



\### File Processing



\* PDF.js

\* Mammoth



\### Deployment



\* Vercel

\* GitHub

\* HTTPS



\## Project Structure



```text

smart-notes-quiz/

├── app/

│   ├── api/

│   │   └── generate-quiz/

│   │       └── route.ts

│   ├── components/

│   │   ├── NotesScreen.tsx

│   │   ├── QuizScreen.tsx

│   │   ├── ResultScreen.tsx

│   │   └── HistoryScreen.tsx

│   ├── lib/

│   │   ├── pdf.ts

│   │   └── quizGenerator.ts

│   ├── layout.tsx

│   ├── page.tsx

│   └── globals.css

├── public/

│   ├── favicon.png

│   └── smart-notes-logo.png

├── next.config.ts

├── package.json

└── README.md

```



\## Getting Started



Clone the repository and install the dependencies:



```bash

git clone https://github.com/zamarharoon/smart-notes-quiz.git

cd smart-notes-quiz

npm install

```



Create a `.env.local` file and add the required environment variables:



```text

GEMINI\_API\_KEY=your\_gemini\_api\_key

UPSTASH\_REDIS\_REST\_URL=your\_upstash\_url

UPSTASH\_REDIS\_REST\_TOKEN=your\_upstash\_token

```



Never commit `.env.local` or API keys to GitHub.



Start the development server:



```bash

npm run dev

```



Then open:



```text

http://localhost:3000

```



\## Testing



The application has been tested for:



\* Manual notes input

\* PDF, DOCX, and TXT uploads

\* File size validation

\* Empty and invalid input validation

\* AI quiz generation

\* Local fallback generation

\* Answer selection

\* Answer feedback

\* Quiz results

\* Try Again functionality

\* Quiz history

\* Rate limiting

\* Security headers

\* Production deployment

\* HTTPS

\* Live Gemini-powered quiz generation



\## Deployment



The application is deployed using Vercel.



Production application:



https://smart-notes-quiz.vercel.app/



Source code:



https://github.com/zamarharoon/smart-notes-quiz



\## Current Status



\*\*APP COMPLETE\*\*



The application is deployed and running with Google Gemini AI-powered quiz generation, server-side API handling, security controls, and a local fallback generator.



\## Future Improvements



Possible future improvements include:



\* User accounts and authentication

\* Server-side database for quiz history

\* AI usage and token tracking

\* Persistent user data

\* More quiz question types

\* Difficulty selection

\* More advanced analytics

\* Improved AI prompt customization

\* Additional file formats



