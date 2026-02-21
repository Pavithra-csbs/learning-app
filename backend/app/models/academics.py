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
    description = db.Column(db.String(255)) # Short description
    image_url = db.Column(db.String(255)) # Icon for the subject
    # Relationships
    topics = db.relationship('Topic', backref='subject', lazy=True)

class Topic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic_name = db.Column(db.String(100), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False)
    level_number = db.Column(db.Integer, default=1)
    description = db.Column(db.String(255)) # Short description
    # Relationships
    content = db.relationship('TopicContent', backref='topic', uselist=False, lazy=True)
    game_levels = db.relationship('GameLevel', backref='topic', lazy=True)

class TopicContent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
    lesson_text = db.Column(db.Text, nullable=False) # HTML or Markdown content
    images = db.Column(db.JSON) # JSON list of image URLs
    animations_url = db.Column(db.JSON) # JSON list of animation URLs
