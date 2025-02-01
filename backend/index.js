const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Running Python Tutor Backend :)");
});

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const GEMINI_API_KEY = process.env.API_KEY;

app.post("/chat", async (req, res) => {
  const { message, conversation, apiKey } = req.body;
  const finalApiKey = apiKey || GEMINI_API_KEY; // Provided key or fallback to environment key

  if (!finalApiKey) {
    return res.status(400).json({ error: "API key is required." });
  }
  if (!message || !conversation) {
    return res
      .status(400)
      .json({ error: "Message and conversation history are required." });
  }

  try {
    const response = await axios.post(`${GEMINI_API_URL}?key=${finalApiKey}`, {
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    res.json({ response: response.data.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data.error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
