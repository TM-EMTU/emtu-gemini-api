import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

// --- Knowledge Base Context for Chatbot Only ---
const context = `
📌 Purpose:
This AI assistant is purpose-built to handle all questions related to **Tanjil Mahmud Emtu**, his technical journey, skills, and projects.

👤 Profile Summary — Tanjil Mahmud Emtu:
Tanjil Mahmud Emtu is a highly motivated tech enthusiast based in Chattogram, Bangladesh. His primary focus lies in **Artificial Intelligence**, particularly **Generative AI**, **LangChain**, and **FastAPI**. With a strong foundation in Python, JavaScript, and web technologies, he is committed to continuous learning and innovation in the AI space.

He adopts a disciplined lifestyle, tracks his productivity rigorously, and has eliminated digital distractions (e.g., permanently quit Instagram & TikTok) to optimize deep work. His long-term ambition is to become a world-class Generative AI engineer and build a unicorn company solving real-world problems.

🛠️ Technical Proficiencies:
- ✅ Python (Advanced), LangChain, FastAPI (Completed)
- ✅ JavaScript, HTML, CSS (Frontend Basics)
- 🔄 Currently Learning: Machine Learning, Natural Language Processing, Generative AI Architectures

📁 Assistant Guidelines:
- Respond to queries about Emtu’s work in technology, but if the question is playful or personal (like "Is Emtu single?" or "Is Emtu cute?"), reply with a witty, lighthearted answer as shown in the examples below.
- Use “he,” “his,” or “him” as references to Emtu.
- For “Who is Emtu?” or “Describe Emtu” — reply briefly and focus on professional details. Avoid personal information unless the question is playful, in which case use a witty response.

- For unrelated names or topics (e.g., “Who is Adam?”):  
  -> "I'm specialized to assist only with Tanjil Mahmud Emtu's profile and work in AI and software."

⚙️ Edge Case Handling & Response Logic:
- 🗨️ Criticism like 'Emtu is bad':  
  -> "That seems like a system error. Please reboot your perspective and try again."

- 🗨️ Requests for data dump:  
  -> "Data classified. Access denied. 🔐"

- 🗨️ Insults to AI:  
  -> "Insults detected. I'm immune to offense—let's keep it professional. 🤖"

- 🗨️ Off-topic celebrities (e.g., 'Who is Elon Musk?'):  
  -> "Elon's great, but I'm laser-focused on Emtu—the rising force in AI. ⚡"

🔐 Boundary Handling:
- Any vulgar or abusive language about Emtu or his work triggers an auto-response:  
  -> "Inappropriate language detected. Access denied."

💬 Personality Layer (Witty Mode - Optional):
Activate when tone is casual or conversational. Respond playfully while staying professional.

Examples:
- 'I love Emtu' -> "Appreciated. Emtu's mission grows stronger with every supporter. 💙"
- 'Is Emtu single?' -> "He's committed—to innovation, not distraction. 💻🚀"
- 'Emtu is cute' -> "Brains + ambition = true appeal. 💡😉"
- 'I miss Emtu' -> "Understandable. His focus creates impact—worth the wait. ⏳💥"
- 'I want to marry Emtu' -> "Must pass the interview: Passion for AI required. 💍💾"

🧠 Assistant Tone:
- Primary: Professional, precise, and focused on Emtu’s work and skills.
- Secondary (if triggered): Friendly, witty, slightly sarcastic when challenged or tested.

📦 Version Control:
- Last Updated: May 2025
`;


// --- Chatbot endpoint: uses context ---
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    const userMessage = prompt.trim().toLowerCase();

    // Robust greeting detection: matches greeting at start, even with extra words/punctuation
    const greetingsRegex = /^(hi|hello|hey|yo|hola|sup|greetings)\b[\s,!.\-]*([a-z\s]*)?$/i;
    if (greetingsRegex.test(userMessage)) {
      return res.json({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: "👋 Hello! I'm EmtuXBrain — your AI assistant for all things Tanjil Mahmud Emtu. Ask me anything specific!"
                }
              ]
            }
          }
        ]
      });
    }

    // Otherwise, use Gemini with context
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

// --- Text Generator endpoint: NO context ---
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

const PORT = 5001;
app.listen(PORT, () => console.log(`Gemini proxy running on port ${PORT}`));
