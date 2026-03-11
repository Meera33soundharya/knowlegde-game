from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///studyhub.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

CORS(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    bio = db.Column(db.Text, default='')
    avatar = db.Column(db.String(200), default='')
    
    # Relationships
    quiz_attempts = db.relationship('QuizAttempt', backref='user', lazy=True)
    study_sessions = db.relationship('StudySession', backref='user', lazy=True)
    posts = db.relationship('Post', backref='author', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'bio': self.bio,
            'avatar': self.avatar,
            'created_at': self.created_at.isoformat()
        }

class QuizAttempt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    topic = db.Column(db.String(200), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    difficulty = db.Column(db.String(50))
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'topic': self.topic,
            'score': self.score,
            'total_questions': self.total_questions,
            'difficulty': self.difficulty,
            'percentage': round((self.score / self.total_questions) * 100, 2),
            'completed_at': self.completed_at.isoformat()
        }

class StudySession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    topic = db.Column(db.String(200), nullable=False)
    duration_minutes = db.Column(db.Integer, default=0)
    notes = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'topic': self.topic,
            'duration_minutes': self.duration_minutes,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    topic = db.Column(db.String(100))
    likes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'author': self.author.to_dict(),
            'title': self.title,
            'content': self.content,
            'topic': self.topic,
            'likes': self.likes,
            'created_at': self.created_at.isoformat()
        }

# Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'StudyHub API is running'}), 200

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    access_token = create_access_token(identity=new_user.id)
    
    return jsonify({
        'message': 'User created successfully',
        'access_token': access_token,
        'user': new_user.to_dict()
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(username=data['username']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify(user.to_dict()), 200

# Quiz Routes
@app.route('/api/quiz/attempts', methods=['POST'])
@jwt_required()
def save_quiz_attempt():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    attempt = QuizAttempt(
        user_id=user_id,
        topic=data['topic'],
        score=data['score'],
        total_questions=data['total_questions'],
        difficulty=data.get('difficulty', 'medium')
    )
    
    db.session.add(attempt)
    db.session.commit()
    
    return jsonify(attempt.to_dict()), 201

@app.route('/api/quiz/attempts', methods=['GET'])
@jwt_required()
def get_quiz_attempts():
    user_id = get_jwt_identity()
    attempts = QuizAttempt.query.filter_by(user_id=user_id).order_by(QuizAttempt.completed_at.desc()).all()
    return jsonify([attempt.to_dict() for attempt in attempts]), 200

@app.route('/api/quiz/stats', methods=['GET'])
@jwt_required()
def get_quiz_stats():
    user_id = get_jwt_identity()
    attempts = QuizAttempt.query.filter_by(user_id=user_id).all()
    
    if not attempts:
        return jsonify({
            'total_attempts': 0,
            'average_score': 0,
            'total_questions_answered': 0,
            'topics_studied': []
        }), 200
    
    total_score = sum(a.score for a in attempts)
    total_questions = sum(a.total_questions for a in attempts)
    topics = list(set(a.topic for a in attempts))
    
    return jsonify({
        'total_attempts': len(attempts),
        'average_score': round((total_score / total_questions) * 100, 2) if total_questions > 0 else 0,
        'total_questions_answered': total_questions,
        'topics_studied': topics
    }), 200

# Study Session Routes
@app.route('/api/study/sessions', methods=['POST'])
@jwt_required()
def create_study_session():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    session = StudySession(
        user_id=user_id,
        topic=data['topic'],
        duration_minutes=data.get('duration_minutes', 0),
        notes=data.get('notes', '')
    )
    
    db.session.add(session)
    db.session.commit()
    
    return jsonify(session.to_dict()), 201

@app.route('/api/study/sessions', methods=['GET'])
@jwt_required()
def get_study_sessions():
    user_id = get_jwt_identity()
    sessions = StudySession.query.filter_by(user_id=user_id).order_by(StudySession.created_at.desc()).all()
    return jsonify([session.to_dict() for session in sessions]), 200

# Community/Social Routes
@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = Post.query.order_by(Post.created_at.desc()).limit(50).all()
    return jsonify([post.to_dict() for post in posts]), 200

@app.route('/api/posts', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    post = Post(
        user_id=user_id,
        title=data['title'],
        content=data['content'],
        topic=data.get('topic', '')
    )
    
    db.session.add(post)
    db.session.commit()
    
    return jsonify(post.to_dict()), 201

@app.route('/api/posts/<int:post_id>/like', methods=['POST'])
@jwt_required()
def like_post(post_id):
    post = Post.query.get_or_404(post_id)
    post.likes += 1
    db.session.commit()
    return jsonify(post.to_dict()), 200

# Leaderboard
@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    # Get top 10 users by total score
    users = User.query.all()
    leaderboard = []
    
    for user in users:
        attempts = QuizAttempt.query.filter_by(user_id=user.id).all()
        if attempts:
            total_score = sum(a.score for a in attempts)
            total_questions = sum(a.total_questions for a in attempts)
            avg_percentage = round((total_score / total_questions) * 100, 2) if total_questions > 0 else 0
            
            leaderboard.append({
                'user': user.to_dict(),
                'total_attempts': len(attempts),
                'average_score': avg_percentage,
                'total_points': total_score
            })
    
    leaderboard.sort(key=lambda x: x['total_points'], reverse=True)
    return jsonify(leaderboard[:10]), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
