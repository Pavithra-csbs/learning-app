from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'student' or 'teacher'
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    student_profile = db.relationship('StudentProfile', backref='user', uselist=False, lazy=True)

class StudentProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    standard = db.Column(db.Integer, nullable=False) # 6, 7, 8, 9, 10
    total_stars = db.Column(db.Integer, default=0)
    avatar_id = db.Column(db.String(50)) # For future funny avatar selection
    bio = db.Column(db.Text)
    school_name = db.Column(db.String(200))
    country = db.Column(db.String(100))
    state = db.Column(db.String(100))

class EmailOTP(db.Model):
    email = db.Column(db.String(120), primary_key=True)
    otp = db.Column(db.String(6), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
