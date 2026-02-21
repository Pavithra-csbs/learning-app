from app import db
from datetime import datetime

class LeaderboardExtScore(db.Model):
    __tablename__ = 'leaderboard_scores'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    student_class = db.Column(db.String(10), nullable=False) # e.g., '6', '7', '8', '9', '10'
    subject = db.Column(db.String(50), nullable=False) # Biology, Physics, Chemistry
    chapter = db.Column(db.String(100), nullable=False)
    stars_earned = db.Column(db.Integer, default=0)
    quiz_score = db.Column(db.Integer, default=0)
    total_score = db.Column(db.Integer, default=0)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to user
    student = db.relationship('User', backref='extended_scores', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "class": self.student_class,
            "subject": self.subject,
            "chapter": self.chapter,
            "stars_earned": self.stars_earned,
            "quiz_score": self.quiz_score,
            "total_score": self.total_score,
            "updated_at": self.updated_at.isoformat()
        }

class LeaderboardExtRank(db.Model):
    __tablename__ = 'leaderboard_ranks'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rank_position = db.Column(db.Integer, nullable=False)
    total_score = db.Column(db.Integer, nullable=False)
    last_calculated = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to user
    student = db.relationship('User', backref='global_rank', lazy=True)

    def to_dict(self):
        return {
            "student_id": self.student_id,
            "rank": self.rank_position,
            "total_score": self.total_score,
            "last_calculated": self.last_calculated.isoformat()
        }
