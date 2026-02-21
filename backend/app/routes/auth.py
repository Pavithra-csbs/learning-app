from flask import Blueprint, request, jsonify
from app import db, jwt
from app.models.user import User, StudentProfile
from app.services.otp_service import OTPService
from flask_jwt_extended import create_access_token

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/send-otp', methods=['POST'])
def send_otp():
    # Deprecated: OTP no longer required.
    return jsonify({"message": "OTP verification is disabled. Please proceed to login directly."}), 200

@bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    print("DEBUG: Received login request (previously verify-otp)")
    data = request.get_json()
    print(f"DEBUG: Data: {data}")
    email = data.get('email')
    name = data.get('name') 
    standard = data.get('standard')
    
    import traceback
    try:
        if not email:
            return jsonify({"message": "Email is required"}), 400
            
        # Bypass OTP check completely
        print(f"DEBUG: Bypassing OTP check for {email}")
        
        # Check if user exists
        query = User.query.filter_by(email=email)
        print(f"DEBUG: SQL query generated: {query}")
        user = query.first()
        print(f"DEBUG: User query result: {user}")
        
        if not user:
            # Register new student
            print(f"DEBUG: Registering new user: {email}")
            if not name or not standard:
                return jsonify({"message": "Name and Standard (Grade) required for new registration"}), 400
                
            user = User(name=name, email=email, role='student')
            db.session.add(user)
            db.session.commit()
            print(f"DEBUG: Created User ID: {user.id}")
            
            profile = StudentProfile(student_id=user.id, grade=standard)
            db.session.add(profile)
            db.session.commit()
            print(f"DEBUG: Created Profile")
        
        print(f"DEBUG: Creating access token for user ID: {user.id}")
        access_token = create_access_token(identity=str(user.id))
        print(f"DEBUG: Token created successfully")
        return jsonify({
            "message": "Login successful",
            "token": access_token,
            "user": {
                "id": user.id,
                "name": user.name,
                "role": user.role,
                "standard": user.student_profile.grade if user.student_profile else None
            }
        }), 200
    except Exception as e:
        print(f"DEBUG: CRASH in verify_otp: {e}")
        traceback.print_exc()
        return jsonify({"message": str(e)}), 500
