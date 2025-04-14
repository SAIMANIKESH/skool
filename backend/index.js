const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✨ Base Gemini API URL
const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1";
const GEMINI_API_KEY = process.env.API_KEY;

// 🔥 Default fallback model (update if you want)
const DEFAULT_MODEL = "gemini-1.5-pro-latest";

// Health Check Route
app.get("/", (req, res) => {
  res.send("Running Python Tutor Backend :)");
});

// 🛠️ Fetch available models
app.get("/models", async (req, res) => {
  try {
    const response = await axios.get(
      `${GEMINI_API_BASE_URL}/models?key=${GEMINI_API_KEY}`
    );
    const models = response.data.models || [];
    res.json(models);
  } catch (error) {
    console.error("Error fetching models:", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: error.response?.data?.error?.message || "Failed to fetch models." });
  }
});

// 🚀 Chat Route using selected model
app.post("/chat", async (req, res) => {
  const { message, model, apiKey } = req.body;
  const finalApiKey = apiKey || GEMINI_API_KEY;
  const selectedModel = model || DEFAULT_MODEL;

  if (!finalApiKey) {
    return res.status(400).json({ error: "API key is required." });
  }
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_BASE_URL}/models/${selectedModel}:generateContent?key=${finalApiKey}`,
      {
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      }
    );

    const modelResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received.";

    res.json({ response: modelResponse });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: error.response?.data?.error?.message || "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
