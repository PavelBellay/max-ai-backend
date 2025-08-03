import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // install this if not present: `npm i node-fetch`

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

app.post('/ask', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { text: message }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      return res.status(500).json({ reply: 'Error from Hugging Face API' });
    }

    const data = await response.json();

    const reply = data.generated_text || data[0]?.generated_text || "Sorry, no response.";
    res.json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ reply: "Sorry, something went wrong on the server." });
  }
});

app.get('/', (req, res) => {
  res.send('Max AI backend is running.');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
