from flask import Blueprint, jsonify, request
from app.services.ai_service import AIService
from app.models.ai_learning import AIQuizLog
from app import db

ai_bp = Blueprint('ai_learning', __name__, url_prefix='/api/ai')

@ai_bp.route('/analyze_student/<int:student_id>', methods=['GET'])
def analyze_student(student_id):
    analysis = AIService.analyze_student_performance(student_id)
    return jsonify(analysis), 200

@ai_bp.route('/recommendations/<int:student_id>', methods=['GET'])
def get_recommendations(student_id):
    recommendations = AIService.get_recommendations(student_id)
    return jsonify([r.to_dict() for r in recommendations]), 200

@ai_bp.route('/generate_quiz', methods=['POST'])
def generate_adaptive_quiz():
    data = request.get_json()
    student_id = data.get('student_id')
    if not student_id:
        return jsonify({"message": "student_id is required"}), 400
    
    questions = AIService.generate_adaptive_quiz(student_id)
    return jsonify({"questions": questions}), 200

@ai_bp.route('/log_quiz_answer', methods=['POST'])
def log_quiz_answer():
    data = request.get_json()
    try:
        new_log = AIQuizLog(
            student_id=data['student_id'],
            question_id=data['question_id'],
            student_answer=data['student_answer'],
            correct_answer=data['correct_answer'],
            topic=data['topic'],
            difficulty=data['difficulty']
        )
        db.session.add(new_log)
        db.session.commit()
        return jsonify({"message": "Log saved"}), 201
    except KeyError as e:
        return jsonify({"message": f"Missing field: {str(e)}"}), 400
