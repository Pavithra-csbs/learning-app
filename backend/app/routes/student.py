from flask import Blueprint, jsonify, request
from app import db
from app.models.academics import Standard, Subject, Topic, TopicContent
from app.models.user import User, StudentProfile
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('student', __name__, url_prefix='/student')

@bp.route('/standard/<int:standard_id>/subjects', methods=['GET'])
def get_subjects(standard_id):
    subjects = Subject.query.filter_by(standard_id=standard_id).all()
    result = [
        {"id": s.id, "name": s.name, "image_url": s.image_url} 
        for s in subjects
    ]
    return jsonify(result), 200

@bp.route('/subject/<int:subject_id>/topics', methods=['GET'])
def get_topics(subject_id):
    topics = Topic.query.filter_by(subject_id=subject_id).all()
    result = [
        {"id": t.id, "name": t.name, "description": t.description} 
        for t in topics
    ]
    return jsonify(result), 200

@bp.route('/topic/<int:topic_id>/content', methods=['GET'])
def get_topic_content(topic_id):
    content = TopicContent.query.filter_by(topic_id=topic_id).first()
    topic = Topic.query.get(topic_id)
    
    if not content:
        return jsonify({"message": "Content not found"}), 404
        
    return jsonify({
        "topic_name": topic.name,
        "theory": content.theory,
        "image_url": content.image_url,
        "diagram_url": content.diagram_url
    }), 200
@bp.route('/profile', methods=['GET', 'POST'])
@jwt_required()
def handle_profile():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    profile = user.student_profile

    if request.method == 'GET':
        return jsonify({
            "name": user.name,
            "email": user.email,
            "standard": profile.standard,
            "bio": profile.bio,
            "school_name": profile.school_name,
            "country": profile.country,
            "state": profile.state,
            "avatar_id": profile.avatar_id,
            "total_stars": profile.total_stars
        }), 200

    if request.method == 'POST':
        data = request.get_json()
        
        # Update User fields
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']
            
        # Update Profile fields
        if 'standard' in data:
            profile.standard = data['standard']
        if 'bio' in data:
            profile.bio = data['bio']
        if 'school_name' in data:
            profile.school_name = data['school_name']
        if 'country' in data:
            profile.country = data['country']
        if 'state' in data:
            profile.state = data['state']
        if 'avatar_id' in data:
            profile.avatar_id = data['avatar_id']
            
        try:
            db.session.commit()
            return jsonify({"message": "Profile updated successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Error updating profile", "error": str(e)}), 500
