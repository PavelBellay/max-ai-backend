import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/ask', async (req, res) => {
  const { message } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a warm, friendly assistant named Max AI, built to help and chat." },
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo"
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Sorry, I couldn't process that." });
  }
});

app.get('/', (req, res) => {
  res.send('Max AI backend is running.');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
