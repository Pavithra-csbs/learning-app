from flask import Blueprint, jsonify, request
from app import db
from app.models.extras import LiveQuiz
import random
import string

bp = Blueprint('teacher', __name__, url_prefix='/teacher')

def generate_room_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@bp.route('/live-quiz/create', methods=['POST'])
def create_live_quiz():
    data = request.get_json()
    host_id = data.get('host_id')
    topic_id = data.get('topic_id')
    
    room_code = generate_room_code()
    
    quiz = LiveQuiz(host_id=host_id, topic_id=topic_id, room_code=room_code)
    db.session.add(quiz)
    db.session.commit()
    
    return jsonify({
        "message": "Live Quiz Created",
        "room_code": room_code,
        "quiz_id": quiz.id
    }), 201

# Real-time questions logic handled via SocketIO, not REST
