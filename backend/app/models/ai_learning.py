from app import db
from datetime import datetime

class AIRecommendation(db.Model):
    __tablename__ = 'ai_recommendations'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    chapter = db.Column(db.String(100), nullable=False)
    recommended_game = db.Column(db.String(100), nullable=True)
    difficulty_level = db.Column(db.String(20), nullable=False) # Easy, Medium, Hard
    reason = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "chapter": self.chapter,
            "recommended_game": self.recommended_game,
            "difficulty_level": self.difficulty_level,
            "reason": self.reason,
            "created_at": self.created_at.isoformat()
        }

class AIQuizLog(db.Model):
    __tablename__ = 'ai_quiz_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    question_id = db.Column(db.Integer, nullable=False)
    student_answer = db.Column(db.String(255), nullable=True)
    correct_answer = db.Column(db.String(255), nullable=False)
    topic = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "question_id": self.question_id,
            "student_answer": self.student_answer,
            "correct_answer": self.correct_answer,
            "topic": self.topic,
            "difficulty": self.difficulty,
            "timestamp": self.timestamp.isoformat()
        }
