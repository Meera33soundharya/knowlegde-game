const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const db = new sqlite3.Database('./studyhub.db', (err) => {
    if (err) console.error(err);
    else console.log('Connected to SQLite database');
});

// Create Tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    bio TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    topic TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    difficulty TEXT,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    topic TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    topic TEXT,
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.userId = user.id;
        next();
    });
};

// Routes

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', message: 'StudyHub API is running' });
});

// Register
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }

                const token = jwt.sign({ id: this.lastID }, JWT_SECRET, { expiresIn: '7d' });

                db.get('SELECT id, username, email, bio, avatar, created_at FROM users WHERE id = ?', [this.lastID], (err, user) => {
                    res.status(201).json({
                        message: 'User created successfully',
                        access_token: token,
                        user
                    });
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

        const { password: _, ...userWithoutPassword } = user;
        res.json({ access_token: token, user: userWithoutPassword });
    });
});

// Get Current User
app.get('/api/auth/me', authenticateToken, (req, res) => {
    db.get('SELECT id, username, email, bio, avatar, created_at FROM users WHERE id = ?', [req.userId], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    });
});

// Save Quiz Attempt
app.post('/api/quiz/attempts', authenticateToken, (req, res) => {
    const { topic, score, total_questions, difficulty } = req.body;

    db.run(
        'INSERT INTO quiz_attempts (user_id, topic, score, total_questions, difficulty) VALUES (?, ?, ?, ?, ?)',
        [req.userId, topic, score, total_questions, difficulty || 'medium'],
        function (err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            db.get('SELECT * FROM quiz_attempts WHERE id = ?', [this.lastID], (err, attempt) => {
                if (attempt) {
                    attempt.percentage = Math.round((attempt.score / attempt.total_questions) * 100);
                }
                res.status(201).json(attempt);
            });
        }
    );
});

// Get Quiz Attempts
app.get('/api/quiz/attempts', authenticateToken, (req, res) => {
    db.all(
        'SELECT * FROM quiz_attempts WHERE user_id = ? ORDER BY completed_at DESC',
        [req.userId],
        (err, attempts) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            attempts.forEach(a => {
                a.percentage = Math.round((a.score / a.total_questions) * 100);
            });
            res.json(attempts);
        }
    );
});

// Get Quiz Stats
app.get('/api/quiz/stats', authenticateToken, (req, res) => {
    db.all('SELECT * FROM quiz_attempts WHERE user_id = ?', [req.userId], (err, attempts) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (attempts.length === 0) {
            return res.json({
                total_attempts: 0,
                average_score: 0,
                total_questions_answered: 0,
                topics_studied: []
            });
        }

        const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
        const totalQuestions = attempts.reduce((sum, a) => sum + a.total_questions, 0);
        const topics = [...new Set(attempts.map(a => a.topic))];

        res.json({
            total_attempts: attempts.length,
            average_score: Math.round((totalScore / totalQuestions) * 100),
            total_questions_answered: totalQuestions,
            topics_studied: topics
        });
    });
});

// Create Study Session
app.post('/api/study/sessions', authenticateToken, (req, res) => {
    const { topic, duration_minutes, notes } = req.body;

    db.run(
        'INSERT INTO study_sessions (user_id, topic, duration_minutes, notes) VALUES (?, ?, ?, ?)',
        [req.userId, topic, duration_minutes || 0, notes || ''],
        function (err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            db.get('SELECT * FROM study_sessions WHERE id = ?', [this.lastID], (err, session) => {
                res.status(201).json(session);
            });
        }
    );
});

// Get Study Sessions
app.get('/api/study/sessions', authenticateToken, (req, res) => {
    db.all(
        'SELECT * FROM study_sessions WHERE user_id = ? ORDER BY created_at DESC',
        [req.userId],
        (err, sessions) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(sessions);
        }
    );
});

// Get All Posts
app.get('/api/posts', (req, res) => {
    db.all(
        `SELECT p.*, u.id as author_id, u.username as author_username, u.email as author_email, u.bio as author_bio, u.avatar as author_avatar
     FROM posts p
     JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC
     LIMIT 50`,
        (err, posts) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            const formattedPosts = posts.map(p => ({
                id: p.id,
                title: p.title,
                content: p.content,
                topic: p.topic,
                likes: p.likes,
                created_at: p.created_at,
                author: {
                    id: p.author_id,
                    username: p.author_username,
                    email: p.author_email,
                    bio: p.author_bio,
                    avatar: p.author_avatar
                }
            }));

            res.json(formattedPosts);
        }
    );
});

// Create Post
app.post('/api/posts', authenticateToken, (req, res) => {
    const { title, content, topic } = req.body;

    db.run(
        'INSERT INTO posts (user_id, title, content, topic) VALUES (?, ?, ?, ?)',
        [req.userId, title, content, topic || ''],
        function (err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            db.get(
                `SELECT p.*, u.id as author_id, u.username as author_username, u.email as author_email, u.bio as author_bio, u.avatar as author_avatar
         FROM posts p
         JOIN users u ON p.user_id = u.id
         WHERE p.id = ?`,
                [this.lastID],
                (err, post) => {
                    const formattedPost = {
                        id: post.id,
                        title: post.title,
                        content: post.content,
                        topic: post.topic,
                        likes: post.likes,
                        created_at: post.created_at,
                        author: {
                            id: post.author_id,
                            username: post.author_username,
                            email: post.author_email,
                            bio: post.author_bio,
                            avatar: post.author_avatar
                        }
                    };
                    res.status(201).json(formattedPost);
                }
            );
        }
    );
});

// Like Post
app.post('/api/posts/:id/like', authenticateToken, (req, res) => {
    const postId = req.params.id;

    db.run('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId], function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });

        db.get(
            `SELECT p.*, u.id as author_id, u.username as author_username, u.email as author_email, u.bio as author_bio, u.avatar as author_avatar
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
            [postId],
            (err, post) => {
                if (!post) return res.status(404).json({ error: 'Post not found' });

                const formattedPost = {
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    topic: post.topic,
                    likes: post.likes,
                    created_at: post.created_at,
                    author: {
                        id: post.author_id,
                        username: post.author_username,
                        email: post.author_email,
                        bio: post.author_bio,
                        avatar: post.author_avatar
                    }
                };
                res.json(formattedPost);
            }
        );
    });
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
    db.all('SELECT * FROM users', (err, users) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        const promises = users.map(user => {
            return new Promise((resolve) => {
                db.all('SELECT * FROM quiz_attempts WHERE user_id = ?', [user.id], (err, attempts) => {
                    if (err || attempts.length === 0) {
                        resolve(null);
                    } else {
                        const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
                        const totalQuestions = attempts.reduce((sum, a) => sum + a.total_questions, 0);
                        const avgPercentage = Math.round((totalScore / totalQuestions) * 100);

                        resolve({
                            user: {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                bio: user.bio,
                                avatar: user.avatar
                            },
                            total_attempts: attempts.length,
                            average_score: avgPercentage,
                            total_points: totalScore
                        });
                    }
                });
            });
        });

        Promise.all(promises).then(results => {
            const leaderboard = results
                .filter(r => r !== null)
                .sort((a, b) => b.total_points - a.total_points)
                .slice(0, 10);

            res.json(leaderboard);
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ StudyHub Backend running on http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
});
