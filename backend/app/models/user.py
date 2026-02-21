from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'student' or 'teacher'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    password_hash = db.Column(db.String(256), nullable=True)
    
    # Relationships
    student_profile = db.relationship('StudentProfile', backref='user', uselist=False, lazy=True)
    teacher_quizzes = db.relationship('TeacherQuiz', backref='teacher', lazy=True)

class StudentProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    grade = db.Column(db.Integer, nullable=False) # 6, 7, 8, 9, 10
    points = db.Column(db.Integer, default=0)
    avatar = db.Column(db.String(50)) # For future funny avatar selection
    bio = db.Column(db.Text)
    school = db.Column(db.String(200))
    country = db.Column(db.String(100))
    state = db.Column(db.String(100))

class EmailOTP(db.Model):
    email = db.Column(db.String(120), primary_key=True)
    otp_code = db.Column(db.String(6), nullable=False)
    expiry_time = db.Column(db.DateTime, nullable=False)
