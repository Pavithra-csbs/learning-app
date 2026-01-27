from app import db
from datetime import datetime

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=False) # List of options strings
    correct_option = db.Column(db.String(1), nullable=False) # 'A', 'B', 'C', 'D' or index
    explanation = db.Column(db.Text) # For learning after answer

class QuizAttempt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False) # Number of correct answers
    total_questions = db.Column(db.Integer, default=8)
    level_achieved = db.Column(db.String(20)) # 'LOW', 'MODERATE', 'FULL'
    stars_earned = db.Column(db.Integer, default=0)
    attempted_at = db.Column(db.DateTime, default=datetime.utcnow)

class StudentTopicProgress(db.Model):
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), primary_key=True)
    stars = db.Column(db.Integer, default=0) # Max stars achieved for this topic
    is_completed = db.Column(db.Boolean, default=False)
    unlocked_at = db.Column(db.DateTime, default=datetime.utcnow)
