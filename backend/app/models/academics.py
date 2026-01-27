from app import db

class Standard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False) # "Class 6", etc.
    # Relationships
    subjects = db.relationship('Subject', backref='standard', lazy=True)

class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False) # "Mathematics", "Science"
    standard_id = db.Column(db.Integer, db.ForeignKey('standard.id'), nullable=False)
    image_url = db.Column(db.String(255)) # Icon for the subject
    # Relationships
    topics = db.relationship('Topic', backref='subject', lazy=True)

class Topic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False)
    description = db.Column(db.String(255)) # Short description
    # Relationships
    content = db.relationship('TopicContent', backref='topic', uselist=False, lazy=True)
    questions = db.relationship('Question', backref='topic', lazy=True)
    puzzles = db.relationship('Puzzle', backref='topic', lazy=True)

class TopicContent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
    theory = db.Column(db.Text, nullable=False) # HTML or Markdown content
    image_url = db.Column(db.String(255)) # Main visualization
    diagram_url = db.Column(db.String(255)) # Extra diagram
