import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/claims", async (req, res) => {
  const { question, answer } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              'Answer correctly, then break into short factual claims. Return ONLY JSON like: {"answer": "text", "claims": ["c1","c2"]}',
          },
          {
            role: "user",
            content: `Question: ${question}\nUser Guess: ${answer}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content;

    console.log("RAW AI:", text);

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);

      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = null;
        }
      }

      if (!parsed) {
        parsed = {
          answer: text,
          claims: text
            .split("\n")
            .map((c) => c.replace(/^\d+[\).\-\s]*/, "").trim())
            .filter((c) => c.length > 0),
        };
      }
    }

    if (!parsed.claims || !Array.isArray(parsed.claims)) {
      parsed.claims = [parsed.answer || "No claims generated"];
    }

    res.json(parsed);
  } catch (err) {
    console.error("SERVER ERROR:", err.response?.data || err.message);

    res.status(500).json({
      claims: ["OpenRouter API failed"],
    });
  }
});

app.post("/api/evaluate", async (req, res) => {
  const { question, responses } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
  You are a reasoning evaluator.

  Given:
  - a question
  - list of claims
  - user's agree/disagree choices

  Analyze the user's thinking.

  Return ONLY JSON:
  {
    "summary": "overall thinking",
    "mistakes": ["wrong beliefs"],
    "understanding": "what user got right"
  }
              `,
            },
            {
              role: "user",
              content: `
  Question: ${question}

  Responses:
  ${JSON.stringify(responses, null, 2)}
              `,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const text = response.data.choices[0].message.content;

      console.log("EVAL RAW:", text);

      let parsed;

      try {
        parsed = JSON.parse(text);
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        parsed = match ? JSON.parse(match[0]) : null;
      }

      res.json(parsed || {
        summary: "Could not evaluate",
        mistakes: [],
        understanding: ""
      });

    } catch (err) {
      console.error("EVAL ERROR:", err.response?.data || err.message);

      res.status(500).json({
        summary: "Evaluation failed",
        mistakes: [],
        understanding: ""
      });
    }
  });

app.listen(3000, () => console.log("Server running on port 3000"));