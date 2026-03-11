# Android Packaging (Capacitor)

This project can be wrapped into a native Android app using Capacitor. These steps run on your machine — they are not executed by this repo.

Prerequisites
- Node.js and npm
- Java JDK (11+ recommended)
- Android Studio + Android SDK
- `npx` CLI available (comes with npm)

Steps

1. Build the web app

```bash
npm install
npm run build:web
```

2. Install Capacitor (globally or use npx)

```bash
npm install @capacitor/core @capacitor/cli --save-dev
# or
npx @capacitor/cli init
```

3. Initialize Capacitor (if not already)

```bash
npx cap init "Knowledge Game" com.knowledgegame.app --web-dir=dist
```

4. Add Android

```bash
npm run capacitor:sync
npm run capacitor:add:android
```

5. Open Android Studio

```bash
npm run capacitor:open:android
```

6. Build & run from Android Studio

Notes
- Capacitor will create an `android/` folder. Commit it only if you plan to maintain native code.
- For Play Store builds, set release signing configs in Android Studio.
- minSdkVersion 14 is very old; modern Android Studio templates use minSdkVersion >= 21. You can edit `android/app/build.gradle` after adding the platform.

Troubleshooting
- If the app can't access local backend during development, run the server and ensure the device/emulator can reach your machine (use `adb reverse tcp:4000 tcp:4000` for emulator).

Security
- Do NOT commit `server/.env` with API keys. Use `server/.env.example` as a template.
📱 8. Mobile & Web Friendly Design

The Knowledge Game is designed to work smoothly on all devices, ensuring easy access for every student.

🔹 Responsive User Interface

Automatically adjusts to screen size

Provides smooth navigation on all devices

🔹 Multi-Device Compatibility

Works on mobile phones, tablets, laptops, and desktops

No separate app required for basic access

🔹 Simple & Colorful Interface

Clean layout with attractive colors

Easy to understand for students of all ages

➡️ Enables learning anytime, anywhere without technical difficulty.

🔔 9. Smart Notifications

Smart notifications help students stay regular, motivated, and exam-focused.

🔹 Daily Practice Reminders

Reminds students to practice every day

Builds a consistent study habit

🔹 Challenge Alerts

Notifications for new quizzes and competitions

Encourages participation and engagement

🔹 Exam Preparation Tips

Sends useful tips before exams

Helps students revise important concepts

➡️ Keeps students active and engaged continuously.

📝 10. Detailed Answer Explanation

This feature ensures that students understand concepts, not just answers.

🔹 Instant Explanation

Explanation shown immediately after each question

Helps students learn from mistakes

🔹 Formula & Concept Clarity

Step-by-step solution for numerical problems

Clear explanation of logic and theory

🔹 Reference Links

Provides additional learning resources

Encourages self-study and deeper understanding

➡️ Learning continues beyond right or wrong answers.

🧑‍🏫 11. Teacher / Admin Panel

The Teacher/Admin Panel allows effective management and monitoring of the learning system.

🔹 Question Management

Add, edit, or delete questions

Update syllabus-based content easily

🔹 Quiz Creation

Create quizzes for practice or exams

Assign quizzes to specific students or classes

🔹 Student Performance Tracking

View scores, accuracy, and progress reports

Identify weak and strong areas of students

🔹 Homework Games

Assign learning games as homework

Makes homework interactive and fun

➡️ Very useful for schools, colleges, and coaching centers.

🔐 12. Secure Login & Profiles

This feature ensures safe, personalized, and reliable access for every student.

🔹 Student Login

Login using unique ID, email, or mobile number

Prevents unauthorized access

🔹 Automatic Progress Saving

Saves scores, levels, and completed topics

Students can continue from where they stopped

🔹 Data Privacy & Security

Secure authentication system

Student data is protected and confidential

➡️ Builds trust, safety, and personalized learning experience.

🌐 13. Offline & Low-Internet Mode

This feature supports students in rural and low-network areas.

🔹 Download Questions

Download quizzes and games in advance

Stored securely on the device

🔹 Play Without Internet

Games work fully in offline mode

No interruption due to network issues

🔹 Auto Sync When Online

Progress stored locally

Automatically synced when internet is available

➡️ Ensures continuous learning without internet dependency.

📈 14. Exam & Syllabus-Based Mode

This mode is specially designed for exam-oriented preparation.

🔹 Board Exam Pattern

Questions follow State Board / CBSE / ICSE formats

Familiarizes students with real exam structure

🔹 Competitive Exam Questions

Practice MCQs for NEET, JEE, CUET, etc.

Improves speed, accuracy, and confidence

🔹 Topic-Wise Practice

Practice individual topics separately

Helps revise weak areas effectively

➡️ Provides direct and focused exam preparation.
🧠 15. AI Personal Learning Assistant

Suggests topics based on weak areas

Recommends daily practice plans

Answers student doubts (chat-based)

➡️ Makes learning personalized and smart

🎤 16. Voice-Based Learning & Quiz

Voice questions and answers

Supports pronunciation practice (English)

Helpful for visually challenged students

➡️ Improves accessibility and engagement

🧩 17. Daily Challenge & Streak System

One daily challenge per subject

Streak rewards for continuous learning

Missed day resets streak

➡️ Builds study discipline

🧪 18. Virtual Lab / Simulation Mode

Science experiments (Physics/Chemistry)

Coding logic simulators

Math step-by-step visual solving

➡️ Learning by doing, not just reading

📚 19. Notes + Game Integration

Notes linked to quiz questions

One-click revision before playing

Highlight important points automatically

➡️ Perfect for quick revision

👨‍👩‍👧 20. Parent Monitoring Dashboard

Weekly progress report

Time spent on learning

Improvement suggestions

➡️ Helps parents support students better

🎯 21. Career & Skill Path Mode

Career-based learning paths

Skill quizzes (logical thinking, aptitude)

Course recommendations

➡️ Guides students beyond exams

🏅 22. Certificates & Achievements

Auto-generated certificates

Course completion badges

Shareable achievements

➡️ Boosts motivation and confidence

🌍 23. Multilingual Support

Tamil, Hindi, English, etc.

Language switching anytime

Regional syllabus support

➡️ Inclusive for all learners

🔍 24. Smart Search & Filter

Search by topic, difficulty, exam

Filter by weak/strong areas

Saves time during revision

➡️ Faster, focused learning

🤝 25. Peer Learning & Discussion Forum

Ask doubts

Answer others’ questions

Upvote best explanations

➡️ Encourages collaborative learning

🚨 26. Exam Stress & Focus Mode

Pomodoro study timer

Focus music

Motivation quotes & tips

➡️ Helps reduce exam anxiety

✨ Bonus Feature (For Viva WOW)
📊 Predictive Performance Analytics

Predict exam score range

Identify risk areas early

Suggest improvement plan

➡️ Shows advanced AI thinking