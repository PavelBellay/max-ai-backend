import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // make sure to install node-fetch@2

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const MODEL = 'microsoft/DialoGPT-medium';

app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: 'No message provided' });
  }

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: userMessage,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Hugging Face API error:', errText);
      return res.status(500).json({ reply: 'Error from Hugging Face API' });
    }

    const data = await response.json();

    // Usually the reply is in generated_text, but might vary by model
    const reply = data.generated_text || 'Sorry, no reply received';

    res.json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ reply: "Sorry, I couldn't process that." });
  }
});

app.get('/', (req, res) => {
  res.send('Max AI backend is running.');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
