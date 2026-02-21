from flask import Blueprint, request, jsonify
from app.services.rag_service import RAGService
from flask_jwt_extended import jwt_required, get_jwt_identity

match_bp = Blueprint('match', __name__)
rag_service = RAGService()

@match_bp.route('/api/match-pairs', methods=['POST'])
@jwt_required()
def get_match_pairs():
    user_id = get_jwt_identity()
    data = request.get_json()
    subject = data.get('subject')
    chapter = data.get('chapter')
    topic = data.get('topic')
    standard = data.get('standard', "10")  # Default to 10 if not provided
    
    if not subject or not chapter:
        return jsonify({"error": "Missing subject or chapter"}), 400
        
    try:
        result = rag_service.generate_matching_pairs(standard, subject, chapter, topic)
        return jsonify(result)
    except Exception as e:
        print(f"MATCH_ERROR: {e}")
        return jsonify({"error": str(e)}), 500

@match_bp.route('/api/get-game-config', methods=['POST'])
@jwt_required()
def get_game_config():
    user_id = get_jwt_identity()
    data = request.get_json()
    subject = data.get('subject')
    chapter = data.get('chapter')
    topic = data.get('topic')
    standard = data.get('standard', "6")
    level = data.get('level', 1)
    
    try:
        print(f"DEBUG: get_game_config called with: Standard={standard}, Subject={subject}, Chapter={chapter}, Topic={topic}, Level={level}")
        result = rag_service.generate_game_config(standard, subject, chapter, topic, level=level)
        print(f"DEBUG: generate_game_config result type: {result.get('type') if result else 'None'}")
        return jsonify(result)
    except Exception as e:
        print(f"GAME_CONFIG_ERROR: {e}")
        return jsonify({"error": str(e)}), 500
