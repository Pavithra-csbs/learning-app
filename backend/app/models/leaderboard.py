from app import db

class Leaderboard(db.Model):
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    grade = db.Column(db.Integer, nullable=False)
    total_score = db.Column(db.Integer, default=0)
    total_stars = db.Column(db.Integer, default=0)
    rank = db.Column(db.Integer)
    
    # Relationship to user to get name/avatar
    student = db.relationship('User', backref='leaderboard_entry', lazy=True)
