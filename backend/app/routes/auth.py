from flask import Blueprint, request, jsonify
from app import db, jwt
from app.models.user import User, StudentProfile
from app.services.otp_service import OTPService
from flask_jwt_extended import create_access_token

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"message": "Email is required"}), 400
        
    otp = OTPService.create_otp(email)
    
    # In a real app, send email here. For dev, we return it.
    print(f"DEBUG: OTP for {email} is {otp}")
    return jsonify({"message": "OTP sent successfully", "debug_otp": otp}), 200

@bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp_input = data.get('otp')
    name = data.get('name') # Optional if logging in
    standard = data.get('standard') # Optional if logging in
    
    is_valid, msg = OTPService.verify_otp(email, otp_input)
    
    if not is_valid:
        return jsonify({"message": msg}), 400
        
    # Check if user exists
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # Register new student
        if not name or not standard:
            return jsonify({"message": "Name and Standard required for new registration"}), 400
            
        user = User(name=name, email=email, role='student', is_verified=True)
        db.session.add(user)
        db.session.commit()
        
        profile = StudentProfile(user_id=user.id, standard=standard)
        db.session.add(profile)
        db.session.commit()
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "role": user.role,
            "standard": user.student_profile.standard if user.student_profile else None
        }
    }), 200
