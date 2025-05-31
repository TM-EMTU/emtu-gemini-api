import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

const context = `
You are an AI assistant who ONLY answers questions about Tanjil Mahmud Emtu or his tech-related interests.

Tanjil Mahmud Emtu is a young and driven tech enthusiast from Chattogram, Bangladesh, with a strong passion for artificial intelligence and programming. He has completed Python training and is actively learning Generative AI, LangChain, and FastAPI. Tanjil is deeply focused on building innovative AI tools and mastering modern technologies.

...

(You can paste the full context here as you already wrote)
`;

app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    const fullPrompt = `${context}\n\nUser: ${prompt}`;
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{ parts: [{ text: fullPrompt }] }]
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { 'Content-Type': 'application/json' }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Gemini API error', details: err.message });
  }
});

app.post('/api/gemini-generic', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { 'Content-Type': 'application/json' }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Gemini API error', details: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Gemini proxy running on port ${PORT}`));
