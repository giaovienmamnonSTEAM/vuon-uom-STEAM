// Vercel Serverless Function — proxy gọi Google Gemini API.
// Giữ GEMINI_API_KEY ở phía server (biến môi trường trên Vercel),
// KHÔNG bao giờ lộ ra trình duyệt của người dùng.
//
// Thiết lập trên Vercel: Project Settings → Environment Variables
//   GEMINI_API_KEY = AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//
// Model: gemini-2.5-flash
// Docs:  https://ai.google.dev/gemini-api/docs

const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Thiếu GEMINI_API_KEY trên server. Vào Vercel → Settings → Environment Variables để thêm.'
    });
  }

  const { system, messages } = req.body || {};
  if (!system || !messages) {
    return res.status(400).json({ error: 'Thiếu tham số system hoặc messages.' });
  }

  // Chuyển đổi messages (dạng { role, content }) sang định dạng "contents" của Gemini.
  // Gemini dùng role "model" thay cho "assistant".
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: system }]
        },
        contents,
        generationConfig: {
          maxOutputTokens: 8000,
          temperature: 1,
          responseMimeType: 'application/json'
        }
      })
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Lỗi không xác định khi gọi Gemini API.' });
  }
}
