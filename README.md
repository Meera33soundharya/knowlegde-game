# Student Study Hub 🎓

An AI-powered learning platform that helps students master any subject through personalized quizzes, flashcards, study notes, and interactive games.

## ✨ Features

- **AI-Generated Content**: Dynamic questions and study materials powered by Google Gemini
- **Multiple Study Modes**: 
  - Interactive Quizzes with explanations
  - Flashcards for memorization
  - Speed Sprint challenges
  - Match games for vocabulary
  - AI-generated study notes
- **Progress Tracking**: Detailed analytics and performance insights
- **Gamification**: Coin system and achievements
- **Dark/Light Mode**: Comfortable studying in any environment
- **Offline Support**: Built-in question bank for offline practice
- **Cross-Platform**: Web, Desktop (Electron), and Mobile (Capacitor) support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd knowledge-game
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env and add your Google API key
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1: Start the backend server
   npm run dev:server
   
   # Terminal 2: Start the frontend
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 🔧 Configuration

### Google Gemini API Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to `server/.env`:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

### Offline Mode
The app works without an API key using built-in question banks for:
- Technical Skills (Programming, Computer Science)
- General Knowledge (Science, History, Geography)

## 📱 Build Options

### Web Build
```bash
npm run build
```

### Desktop App (Electron)
```bash
npm run electron:build
```

### Mobile App (Capacitor)
```bash
npm run capacitor:sync
npm run capacitor:add:android
npm run capacitor:open:android
```

## 🎯 Usage

1. **Enter a Topic**: Type any subject you want to study
2. **Choose Study Mode**: 
   - Quiz for testing knowledge
   - Flashcards for memorization
   - Speed Sprint for quick practice
   - Match Game for vocabulary
   - Study Notes for summaries
3. **Track Progress**: View detailed analytics in the dashboard
4. **Earn Coins**: Get rewarded for correct answers

## 🛠️ Development

### Project Structure
```
knowledge-game/
├── src/                 # React frontend
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   └── App.jsx         # Main app component
├── server/             # Express backend
│   ├── index.js        # Server entry point
│   └── questions.json  # Offline question bank
├── electron/           # Electron main process
└── public/            # Static assets
```

### Available Scripts
- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend server
- `npm run dev:all` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run electron:dev` - Start Electron app in development
- `npm run electron:build` - Build Electron app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure your API key is correctly set
3. Try the offline mode first
4. Open an issue on GitHub

## 🔮 Roadmap

- [ ] Voice-to-text question input
- [ ] Collaborative study sessions
- [ ] Advanced analytics
- [ ] Custom question banks
- [ ] Integration with learning management systems
- [ ] Mobile app optimization

---

Made with ❤️ for students worldwide