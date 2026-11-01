import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    status: "QuizForge API running!",
    version: "1.0.1",
    model: MODEL
  });
});

app.post("/api/generate-quiz", async (req, res) => {
  const prompt = req.body?.prompt;

  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "A valid prompt is required." });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is missing.");
    return res.status(500).json({
      error: "AI service is not configured. Please contact the administrator."
    });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert quiz generator for students. Respond ONLY with a valid JSON array. Do not include Markdown, code fences, or explanations outside the JSON. Follow the requested question count and types. Ensure the JSON is syntactically valid."
        },
        { role: "user", content: prompt.trim() }
      ],
      max_tokens: 6000,
      temperature: 0.7
    });

    const raw = completion.choices[0]?.message?.content || "";
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const match = cleaned.match(/\[[\s\S]*\]/);

    if (!match) {
      console.error("Groq returned no JSON array:", cleaned);
      return res.status(502).json({
        error: "AI did not return a valid question array. Please try again."
      });
    }

    let questions;
    try {
      questions = JSON.parse(match[0]);
    } catch (parseError) {
      console.error("AI JSON parsing failed:", parseError.message);
      return res.status(502).json({
        error: "AI generated invalid JSON. Please regenerate the quiz."
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(502).json({
        error: "AI returned an empty or invalid quiz."
      });
    }

    console.log(`Successfully generated ${questions.length} questions.`);
    return res.json({ result: JSON.stringify(questions) });
  } catch (err) {
    console.error("Groq API error:", {
      message: err.message,
      status: err.status,
      code: err.code
    });

    if (err.status === 429) {
      return res.status(429).json({
        error: "AI rate limit reached. Please wait and try again."
      });
    }

    if (err.status === 401 || err.status === 403) {
      return res.status(502).json({
        error: "AI authentication failed. Check the Groq API key configuration."
      });
    }

    if (err.status === 404) {
      return res.status(502).json({
        error: "AI model is unavailable. Check the GROQ_MODEL configuration."
      });
    }

    return res.status(500).json({
      error: "Failed to generate quiz. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`QuizForge API running on port ${PORT}`);
  console.log(`Groq model: ${MODEL}`);
  console.log(`Groq API key: ${process.env.GROQ_API_KEY ? "Loaded" : "MISSING"}`);
});
