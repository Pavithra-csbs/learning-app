from flask import Blueprint, request, jsonify
from app.services.rag_service import RAGService
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User

quiz_generator_bp = Blueprint('quiz_generator', __name__)
rag_service = RAGService()

@quiz_generator_bp.route('/api/generate-quiz', methods=['POST'])
@jwt_required()
def generate_quiz():
    print("DEBUG: generate_quiz endpoint reached")
    data = request.get_json()
    user_id = get_jwt_identity()
    print(f"DEBUG: User Identity from JWT: {user_id}")
    
    user = User.query.get(int(user_id))
    if not user:
        print("DEBUG: User not found in database")
        return jsonify({"error": "User not found"}), 404
        
    if not user.student_profile:
        print("DEBUG: Student profile not found for user")
        return jsonify({"error": "Student profile not found"}), 404
        
    # Enforce standard from profile
    standard = user.student_profile.standard
    subject = data.get('subject')
    chapter = data.get('chapter')
    topic = data.get('topic')
    
    print(f"DEBUG: Request Params - Standard: {standard}, Subject: {subject}, Topic: {topic}")
    
    level = data.get('level', 1)
    difficulty_map = {
        1: "EASY", 2: "EASY",
        3: "MEDIUM", 4: "MEDIUM", 5: "MEDIUM",
        6: "HARD", 7: "HARD", 8: "HARD"
    }
    target_diff = difficulty_map.get(level, "MEDIUM")
    
    if not all([subject, chapter, topic]):
        return jsonify({"error": "Missing required fields (subject, chapter, topic)"}), 400
        
    try:
        result = rag_service.generate_quiz(standard, subject, chapter, topic, target_difficulty=target_diff)
        print(f"DEBUG: RAG Result: {result.get('status') if isinstance(result, dict) else 'Generated'}")
        
        if isinstance(result, dict) and "error" in result:
            return jsonify(result), 400
            
        return jsonify(result), 200
    except Exception as e:
        print(f"DEBUG: ERROR in generate_quiz: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@quiz_generator_bp.route('/api/ingest-pdf', methods=['POST'])
def ingest_pdf():
    """Endpoint to trigger PDF ingestion manually (for testing/admin)."""
    data = request.get_json()
    filename = data.get('filename')
    
    if not filename:
        return jsonify({"error": "Filename is required"}), 400
        
    result = rag_service.ingest_pdf(filename)
    return jsonify(result)
