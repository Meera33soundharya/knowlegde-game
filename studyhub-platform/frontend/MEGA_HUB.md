# MEGA LEARNHUB - Feature Documentation

## Overview
The **Mega LearnHub** is a comprehensive, all-in-one learning module integrated into the StudyHub platform. It combines gamified learning tools with productivity utilities in a single, immersive "neon/cyberpunk" themed interface.

## Features

### 1. 🎴 Flashcards
- **Difficulty Levels**: Easy, Medium, Hard.
- **Interactivity**: Click to flip, navigate previous/next.
- **Content**: Pre-loaded questions (can be extended).

### 2. ❓ Quiz Arena
- **Timed Challenges**: 30 seconds per question.
- **Score & Combo System**: Earn more points for consecutive correct answers.
- **Progress Tracking**: Real-time progress bar and final score summary.

### 3. 🎯 Matching Game
- **Objective**: Match terms with their definitions or pairs (e.g., Element -> Symbol).
- **Mechanics**: Click to select, auto-match or reset.
- **Stats**: Tracks attempts and matches.

### 4. 🧠 Memory Game
- **Objective**: Find matching pairs of cards (emojis/icons).
- **Stats**: Tracks moves and time taken.
- **Win Condition**: Clear the board to win points.

### 5. 🔤 Word Scramble
- **Objective**: Unscramble the given word based on a hint.
- **Input**: Type your answer and check.
- **Streak System**: Build a streak of correct answers.

### 6. ⌨️ Typing Test
- **Objective**: Type the paragraph as fast and accurately as possible.
- **Real-time Stats**: WPM (Words Per Minute), Accuracy, and Time.
- **Feedback**: Color-coded text (Green = Correct, Red = Wrong).

### 7. 💻 Code Lab
- **Language Support**: HTML, CSS, JS tabs.
- **Live Preview**: secure sandbox iframe to render code in real-time.
- **Editor**: Simple textarea-based editor for quick experiments.

### 8. 📝 Notes
- **Simple storage**: Create, Edit, Delete notes.
- **Local Persistence**: Notes are saved to `localStorage` so they aren't lost on refresh.

### 9. 🔢 Calculator
- **Standard Functions**: Add, Subtract, Multiply, Divide.
- **UI**: Styled to match the neon theme.

### 10. ⏱️ Pomodoro Timer
- **Modes**: Work (25m), Short Break (5m).
- **Controls**: Start, Pause, Reset.
- **Audio**: (Visual only for now, can be extended for sound).

## Technical Details

- **Component**: `MegaLearnHub.jsx`
- **Styling**: `MegaLearnHub.css` (Scoped with `.mega-` prefix to prevent conflicts).
- **State Management**: `useState` and `useEffect` for logic and timers.
- **Persistence**: Uses `localStorage` key `megaLearnhubReactData` for stats and notes.

## How to Extend
To add new questions or content, edit the `flashcardsData` or quiz `questions` arrays inside `MegaLearnHub.jsx`.
