# teacher_mode.py - Models for Teacher Live Quiz Mode
from app import db
from datetime import datetime
import random
import string

class TeacherQuiz(db.Model):
    __tablename__ = 'teacher_quizzes'
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    student_class = db.Column(db.String(10), nullable=False) # e.g., '6', '7', '8', '9', '10'
    subject = db.Column(db.String(50), nullable=False)
    chapter = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to questions
    questions = db.relationship('TeacherQuestion', backref='quiz', lazy=True, cascade="all, delete-orphan")

class TeacherQuestion(db.Model):
    __tablename__ = 'teacher_questions'
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('teacher_quizzes.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    option_a = db.Column(db.String(200), nullable=False)
    option_b = db.Column(db.String(200), nullable=False)
    option_c = db.Column(db.String(200), nullable=False)
    option_d = db.Column(db.String(200), nullable=False)
    correct_option = db.Column(db.String(1), nullable=False) # 'A', 'B', 'C', 'D'
    time_limit = db.Column(db.Integer, default=30) # in seconds

class LiveQuizSession(db.Model):
    __tablename__ = 'live_quiz_sessions'
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('teacher_quizzes.id'), nullable=False)
    room_code = db.Column(db.String(6), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    ended_at = db.Column(db.DateTime, nullable=True)

    @staticmethod
    def generate_room_code():
        return ''.join(random.choices(string.digits, k=6))

class LiveQuizAnswer(db.Model):
    __tablename__ = 'live_quiz_answers'
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('live_quiz_sessions.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('teacher_questions.id'), nullable=False)
    selected_option = db.Column(db.String(1), nullable=False) # 'A', 'B', 'C', 'D'
    is_correct = db.Column(db.Boolean, nullable=False)
    response_time = db.Column(db.Float, nullable=False) # seconds from question start

class LiveQuizScore(db.Model):
    __tablename__ = 'live_quiz_scores'
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('live_quiz_sessions.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    score = db.Column(db.Integer, default=0)
    rank = db.Column(db.Integer, nullable=True)
