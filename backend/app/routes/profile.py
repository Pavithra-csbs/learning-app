from flask import Blueprint, request, jsonify
from app import db
from app.models.user_profile import UserProfile

profile_bp = Blueprint('profile_api', __name__, url_prefix='/api')

@profile_bp.route('/create-profile', methods=['POST'])
def create_profile():
    data = request.get_json()
    
    # Basic Validation
    name = data.get('name')
    email = data.get('email')
    age = data.get('age')
    country = data.get('country')
    avatar_url = data.get('avatar_url')
    
    if not all([name, email, age, country]):
        return jsonify({"message": "Missing required fields"}), 400
        
    try:
        age = int(age)
    except ValueError:
        return jsonify({"message": "Age must be a number"}), 400

    # Check if email already exists
    if UserProfile.query.filter_by(email=email).first():
        return jsonify({"message": "Profile with this email already exists"}), 409

    try:
        new_profile = UserProfile(
            name=name,
            email=email,
            age=age,
            country=country,
            avatar_url=avatar_url
        )
        db.session.add(new_profile)
        db.session.commit()
        return jsonify({"message": "Profile created successfully!", "profile": new_profile.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating profile", "error": str(e)}), 500

@profile_bp.route('/get-profile/<string:email>', methods=['GET'])
def get_profile(email):
    profile = UserProfile.query.filter_by(email=email).first()
    if not profile:
        return jsonify({"message": "Profile not found"}), 404
    return jsonify(profile.to_dict()), 200
