# 🎙️ Scirian Voice Command System

Scirian Voice Command System is a voice-enabled student productivity and learning platform that allows students to interact with different learning features using natural voice commands.

## 📌 Overview

The system combines browser-based speech recognition, context-aware voice command processing, React application state management, and Google Gemini-powered AI functionality.

Users can use voice commands for navigation, book reading, quizzes, notes, Daily Recall, study planning, analytics, and AI Tutor interaction.

### Example Commands

- "Open my library"
- "Next page"
- "Start a Python quiz"
- "Next question"
- "Show answer"
- "Open my notes"
- "Show my progress"
- "Open AI Tutor"

## ✨ Features

### 🎤 Voice Assistant
- Voice-based application control
- Speech-to-text using Web Speech API
- Context-aware voice command processing
- Voice command history
- Supported command guide

### 🏠 Dashboard
- Student learning overview
- Study tasks
- Books
- Flashcards
- Learning progress
- Voice activity

### 📚 Library
- View learning resources
- Select books
- Open books
- Continue reading

### 📖 Book Reader
Voice commands support:
- Next page
- Previous page
- Explain section
- Summarize page
- Generate quiz

### 🤖 AI Tutor
The AI Tutor uses Google Gemini for AI-powered educational assistance.

Users can:
- Ask learning questions
- Use voice input
- Receive AI-generated explanations
- Listen to responses using speech synthesis

### 🧠 Daily Recall
- Flashcard-based revision
- Show answer
- Next flashcard
- Mark flashcard as mastered
- Track repetitions

### 📅 Study Plan
- Add study tasks
- Edit and delete tasks
- Mark tasks as completed
- Filter tasks
- Set priority
- Set duration and time
- Add tasks using voice commands

### 🧪 Practice Quiz
- Subject-based quizzes
- Configurable question count
- Multiple-choice questions
- Voice-based navigation
- Voice option selection
- Answer explanations

### 📝 Study Notes
- Create notes
- Edit notes
- Delete notes
- Summarize notes
- Generate flashcards

### 📊 Analytics
- Study hours
- Completed tasks
- Quiz activity
- Learning streak
- Books completed
- Learning progress

## 🧠 Context-Aware Voice Commands

The system uses a rule-based intent resolver along with the current application context.

The same command can have different meanings depending on the active screen.

For example:

Reader:
"Next" → Next Page

Quiz:
"Next" → Next Question

Daily Recall:
"Next" → Next Flashcard

The system uses information such as the current view, current book, current page, quiz state, and recall state to determine the appropriate action.

## 🎤 Voice Command Flow

User
↓
Microphone
↓
Web Speech API
↓
Speech Recognition
↓
Speech-to-Text Transcript
↓
Context-Aware Intent Resolver
↓
Intent + Parameters
↓
React Application State
↓
Application Action

## 🤖 AI Architecture

React Frontend
↓
Express Backend
↓
Google Gemini API
↓
AI Response
↓
React Frontend

## 🛠️ Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Motion

### Voice
- Web Speech API
- Speech Recognition API
- Speech Synthesis API

### Backend
- Node.js
- Express.js
- TypeScript

### AI
- Google Gemini API
- @google/genai

### Development Tools
- VS Code
- npm
- Git
- GitHub

## 🔌 Backend API

The backend is implemented using Node.js and Express.js.

It provides functionality for:
- AI Tutor requests
- Voice intent processing
- Content summarization
- Health checking
- Gemini integration

Health check endpoint:

GET /api/health

## 🔐 Environment Variables

The Gemini API key is stored as an environment variable.

Create a `.env` file:

GEMINI_API_KEY=your_gemini_api_key

Do not commit the `.env` file or API key to GitHub.

## 📂 Project Structure

scirian-voice-command-system/
│
├── src/
│   ├── components/
│   ├── services/
│   ├── data/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
│
├── server.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── .gitignore
└── README.md

## ⚙️ Installation

### 1. Clone the repository

git clone https://github.com/AksharaBrungi/scirian-voice-command-system.git

### 2. Navigate to the project

cd scirian-voice-command-system

### 3. Install dependencies

npm install

### 4. Configure environment variables

Create a `.env` file and add:

GEMINI_API_KEY=your_gemini_api_key

### 5. Start the development server

npm run dev

The application will run at:

http://localhost:3000

## 🧪 Development Commands

Start development server:

npm run dev

Create production build:

npm run build

Start production server:

npm start

## 🔐 Security

- API keys are stored using environment variables.
- `.env` is excluded from Git tracking.
- Gemini requests are handled through the backend.
- API keys should not be exposed in frontend code.

## 🚧 Future Improvements

- More flexible natural-language voice commands
- Improved handling of unrecognized commands
- Voice feedback for command execution
- Persistent user authentication
- Database integration
- Personalized learning recommendations
- Improved AI learning workflows
- Better cross-browser voice support

## 👩‍💻 Author

Akshara Brungi

GitHub:
https://github.com/AksharaBrungi
