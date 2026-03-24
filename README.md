# QuizForge — AI Study Quiz Generator

> Transform your study material into personalised quizzes in seconds using AI.

![QuizForge](https://img.shields.io/badge/QuizForge-AI%20Powered-7c6aff?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react)
![Groq](https://img.shields.io/badge/Groq-LLaMA%203.3-F55036?style=for-the-badge)

---

## What is QuizForge?

QuizForge is a full-stack AI-powered quiz generator built for students. Upload your lecture notes, textbook chapters, or presentation slides — and get a personalised, exam-ready quiz in seconds.

No more manually making flashcards. No more guessing what's important. Just upload and study.

---

## Features

- **4 File Formats** — PDF, PPTX, DOCX, TXT
- **4 Question Types** — MCQ, Short Answer, True/False, Fill in the Blank
- **Mixed Mode** — AI picks the best question type for each concept
- **3 Difficulty Levels** — Easy, Medium, Hard (or Mixed)
- **Up to 30 Questions** per quiz
- **Instant AI Explanations** — every answer has a detailed explanation
- **Score Tracker** — tracks your MCQ and True/False score in real time
- **Progress Bar** — see how far through the quiz you are
- **Export to .txt** — save your quiz for offline revision
- **Premium Dark UI** — built for long study sessions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| AI Model | LLaMA 3.3 70B via Groq API |
| PDF Parsing | PDF.js (CDN) |
| PPTX Parsing | JSZip (CDN) |
| DOCX Parsing | Mammoth.js |
| Deployment | Render (backend) + Netlify (frontend) |

---

## Getting Started

### Prerequisites
- Node.js v18+
- Groq API Key (free at [console.groq.com](https://console.groq.com))

### Local Setup

**1. Clone the repo**
```bash
git clone https://github.com/Ankit-ai-web/QuizForge.git
cd QuizForge
```

**2. Backend**
```bash
cd backend
npm install
```

Create a `.env` file:
```
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

Start the backend:
```bash
npm run dev
```

**3. Frontend**
```bash
cd frontend
npm install
npm install mammoth
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Backend API | Render | https://quizforge-xmpu.onrender.com |
| Frontend | Netlify/Render | Your deployed URL |

### Deploy Backend (Render)
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment Variable: `GROQ_API_KEY`

### Deploy Frontend (Netlify)
- Base Directory: `frontend`
- Build Command: `npm run build`
- Publish Directory: `frontend/dist`

---

## How It Works

```
User uploads file
      ↓
Frontend parses file (PDF.js / JSZip / Mammoth)
      ↓
Text extracted and sent to backend
      ↓
Backend sends prompt to Groq (LLaMA 3.3 70B)
      ↓
AI generates structured JSON quiz
      ↓
Frontend renders interactive quiz
      ↓
User attempts quiz → Score tracked
```

---

## Project Structure

```
QuizForge/
├── backend/
│   ├── server.js        # Express API + Groq integration
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Main React app
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## API Reference

### POST `/api/generate-quiz`

**Request:**
```json
{
  "prompt": "your extracted text + quiz instructions"
}
```

**Response:**
```json
{
  "result": "[{\"id\":1,\"type\":\"mcq\",\"difficulty\":\"Medium\",\"question\":\"...\",\"options\":[...],\"answer\":\"B\",\"explanation\":\"...\"}]"
}
```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repo
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — free to use, modify and distribute.

---

## Author

Built with ❤️ by **Ankit** — [GitHub](https://github.com/Ankit-ai-web)

---

*QuizForge — Because exam prep should be smart, not hard.*
