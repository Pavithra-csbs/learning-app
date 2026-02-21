from app import db

class GameLevel(db.Model):
    __tablename__ = 'game_level'
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
    level_number = db.Column(db.Integer, nullable=False)
    game_name = db.Column(db.String(100), nullable=False)
    game_type = db.Column(db.String(50), nullable=False) # 'sorting', 'matching', 'battle', etc.

    # Relationships
    questions = db.relationship('Question', backref='game_level', lazy=True)
    puzzles = db.relationship('Puzzle', backref='game_level', lazy=True)
    attempts = db.relationship('QuizAttempt', backref='game_level', lazy=True)
