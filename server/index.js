import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Simple mock/proxy endpoint for generative tasks.
// If you set GOOGLE_API_KEY in server/.env it will still return mock responses unless you implement
// the real Google Generative API call here. This keeps the key safe on the server side.

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt = '', type = 'text' } = req.body || {}

    // If a real Google API key is provided in the environment, attempt a real call.
    const apiKey = process.env.GOOGLE_API_KEY
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Return a simplified shape expected by the frontend
        return res.json({ text });
      } catch (err) {
        console.error('Google API request failed', err)
        // fall through to mock response
      }
    }

    // Basic heuristics to return useful mock data for the frontend
    if (type === 'notes' || prompt.toLowerCase().includes('generate a concise study summary')) {
      return res.json({ text: `Summary (mock): ${prompt.slice(0, 140)}...` })
    }

    if (type === 'questions' || prompt.toLowerCase().includes('generate 10')) {
      const questions = Array.from({ length: 6 }).map((_, i) => ({
        question: `Mock question ${i + 1} about ${prompt.slice(0, 40)}`,
        options: [`Option A`, `Option B`, `Option C`, `Option D`],
        answer: `Option A`,
        explanation: `This is a mock explanation for question ${i + 1}`
      }))
      return res.json({ questions })
    }

    if (type === 'match' || prompt.toLowerCase().includes('generate 5 key terms')) {
      const pairs = Array.from({ length: 5 }).map((_, i) => ({ id: i + 1, term: `Term ${i + 1}`, def: `Definition ${i + 1}` }))
      return res.json({ pairs })
    }

    // Default fallback
    return res.json({ text: `Mock response for: ${prompt.slice(0, 140)}` })
  } catch (err) {
    console.error('server /api/generate error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Questions endpoints: simple JSON-backed DB for offline/random play
const QUESTIONS_FILE = path.join(process.cwd(), 'server', 'questions.json')
const loadQuestions = () => {
  try {
    const raw = fs.readFileSync(QUESTIONS_FILE, 'utf-8')
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.warn('Failed to load questions.json', err)
    return []
  }
}

app.get('/api/questions', (req, res) => {
  const limit = parseInt(req.query.limit || '1', 10)
  const questions = loadQuestions()
  if (!questions.length) return res.json({ questions: [] })

  // pick random questions
  const pick = []
  for (let i = 0; i < Math.min(limit, questions.length); i++) {
    const idx = Math.floor(Math.random() * questions.length)
    pick.push(questions[idx])
  }
  res.json({ questions: pick })
})

app.post('/api/answer', (req, res) => {
  try {
    const { id, answer } = req.body || {}
    const questions = loadQuestions()
    const q = questions.find(x => x.id === id)
    if (!q) return res.status(400).json({ error: 'Question not found' })
    const correct = q.answer === answer
    return res.json({ correct, coins: correct ? 1 : 0 })
  } catch (err) {
    console.error('/api/answer error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API mock server listening on http://localhost:${PORT}`))
