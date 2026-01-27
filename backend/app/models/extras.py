from app import db
from datetime import datetime

class Puzzle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    puzzle_type = db.Column(db.String(50)) # 'image_match', 'word_scramble', etc.
    image_url = db.Column(db.String(255))
    correct_answer = db.Column(db.String(100), nullable=False)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) # Optional (can be anonymous)
    message = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer) # 1-5 stars
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class LiveQuiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # Teacher
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
    room_code = db.Column(db.String(6), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
