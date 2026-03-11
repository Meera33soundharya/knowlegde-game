# Server

This server provides simple mock/generative endpoints used by the frontend.

- `POST /api/generate` - mock generative responses. If you set `GOOGLE_API_KEY` in `server/.env`, the server will attempt to call the Google Generative API and fall back to mock responses on error.
- `GET /api/questions?limit=1` - returns random question(s) from `questions.json`.
- `POST /api/answer` - validate an answer for a question id. Body: `{ id: number, answer: string }` returns `{ correct: boolean, coins: 0|1 }`.

Quick start

```powershell
cd "c:\Users\Admin\OneDrive\Desktop\knowlegde game\server"
npm install
# create .env with GOOGLE_API_KEY if you want live Google calls
npm start
```

Security

- Never commit your `.env` file with real API keys. Use `.env.example` as a template.
