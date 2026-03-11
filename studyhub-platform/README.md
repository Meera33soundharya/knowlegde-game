# StudyHub Platform - Full-Stack Educational App

A comprehensive educational platform with user authentication, quiz tracking, community features, and AI integration.

## 🚀 Features

### Backend (Flask/Python)
- ✅ User Authentication (JWT)
- ✅ Quiz Attempt Tracking
- ✅ Study Session Management
- ✅ Community Posts & Discussions
- ✅ Leaderboard System
- ✅ RESTful API
- ✅ SQLite Database

### Frontend (React + Vite)
- ✅ Modern UI with Tailwind-like styling
- ✅ User Dashboard with Statistics
- ✅ Quiz Integration
- ✅ Community Feed
- ✅ Leaderboard
- ✅ Responsive Design
- ✅ Protected Routes

## 📦 Installation

### Backend Setup

1. Navigate to backend folder:
```bash
cd studyhub-platform/backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file:
```bash
copy .env.example .env
```

6. Run the backend:
```bash
python app.py
```

Backend will run on: **http://localhost:5000**

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd studyhub-platform/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend:
```bash
npm run dev
```

Frontend will run on: **http://localhost:5174** (or 5173)

## 🎯 Usage

### 1. Register/Login
- Open the frontend URL
- Create a new account or login
- You'll be redirected to the dashboard

### 2. Dashboard
- View your statistics
- See recent quiz attempts
- Check the leaderboard
- Navigate to different sections

### 3. Take Quizzes
- Click "Start New Quiz"
- Enter a topic
- Complete the quiz
- Your score is automatically saved

### 4. Community
- Create posts
- Share knowledge
- Like posts from other users
- Discuss topics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Quiz
- `POST /api/quiz/attempts` - Save quiz attempt
- `GET /api/quiz/attempts` - Get user's quiz attempts
- `GET /api/quiz/stats` - Get user statistics

### Study Sessions
- `POST /api/study/sessions` - Create study session
- `GET /api/study/sessions` - Get user's study sessions

### Community
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like a post

### Leaderboard
- `GET /api/leaderboard` - Get top users

## 🎨 Integration with Existing Quiz App

To integrate your existing quiz component:

1. Copy your quiz logic from the main app
2. Replace the `QuizPage` component in `frontend/src/App.jsx`
3. Make sure to save quiz results using:
```javascript
await axios.post(`${API_URL}/quiz/attempts`, {
  topic: 'Your Topic',
  score: userScore,
  total_questions: totalQuestions,
  difficulty: 'medium'
});
```

## 📊 Database Schema

### Users
- id, username, email, password, bio, avatar, created_at

### QuizAttempts
- id, user_id, topic, score, total_questions, difficulty, completed_at

### StudySessions
- id, user_id, topic, duration_minutes, notes, created_at

### Posts
- id, user_id, title, content, topic, likes, created_at

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected API routes
- CORS enabled for frontend communication

## 🚀 Deployment

### Backend (Heroku/Render)
1. Create `Procfile`:
```
web: gunicorn app:app
```

2. Deploy to Heroku or Render

### Frontend (Vercel/Netlify)
1. Build the app:
```bash
npm run build
```

2. Deploy the `dist` folder

## 📝 Environment Variables

### Backend (.env)
```
JWT_SECRET_KEY=your-secret-key
FLASK_ENV=development
DATABASE_URL=sqlite:///studyhub.db
```

## 🎯 Next Steps

1. ✅ Run both backend and frontend
2. ✅ Create an account
3. ✅ Take some quizzes
4. ✅ Check the leaderboard
5. ✅ Create community posts
6. 🔄 Integrate your existing quiz component
7. 🔄 Add AI features (OpenAI/Gemini)
8. 🔄 Deploy to production

## 🤝 Contributing

Feel free to enhance this platform with:
- More quiz modes
- AI-powered study notes
- Real-time chat
- File uploads
- Badges and achievements
- Study groups

## 📄 License

MIT License

---

**Built with ❤️ for students worldwide**
