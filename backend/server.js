import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get("/", (req, res) => {
  res.json({ status: "QuizForge API running!", version: "1.0.0" });
});

app.post("/api/generate-quiz", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });
  if (!process.env.GROQ_API_KEY)
    return res.status(500).json({ error: "GROQ_API_KEY not configured" });

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert quiz generator for students. You MUST respond with ONLY a valid JSON array. No markdown, no code fences, no explanation before or after. Just raw JSON starting with [ and ending with ].`
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 6000,
      temperature: 0.7,
    });

    let raw = completion.choices[0]?.message?.content || "";
    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) {
      return res.status(500).json({ error: "AI did not return valid JSON. Please try again." });
    }
    JSON.parse(match[0]);
    res.json({ result: match[0] });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 QuizForge API running at http://localhost:${PORT}`);
  console.log(`🔑 Groq API Key: ${process.env.GROQ_API_KEY ? "Loaded ✓" : "MISSING ✗"}\n`);
});
