from app import db
from datetime import datetime

class Puzzle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    game_level_id = db.Column(db.Integer, db.ForeignKey('game_level.id'), nullable=False)
    puzzle_data = db.Column(db.JSON, nullable=False) # Store puzzle_type, question, image_url, etc.
    correct_answer = db.Column(db.String(100), nullable=False)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # Optional (can be anonymous)
    message = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer) # 1-5 stars
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class LiveQuiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) # Teacher
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
    room_code = db.Column(db.String(6), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
