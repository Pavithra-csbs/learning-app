from flask import Blueprint, jsonify, request
from app.models.extras import Puzzle

bp = Blueprint('puzzle', __name__, url_prefix='/puzzle')

@bp.route('/<int:topic_id>', methods=['GET'])
def get_puzzles(topic_id):
    puzzles = Puzzle.query.filter_by(topic_id=topic_id).all()
    result = [{
        "id": p.id,
        "question": p.question,
        "puzzle_type": p.puzzle_type,
        "image_url": p.image_url
    } for p in puzzles]
    return jsonify(result), 200

@bp.route('/submit', methods=['POST'])
def submit_puzzle():
    data = request.get_json()
    puzzle_id = data.get('puzzle_id')
    answer = data.get('answer')
    
    puzzle = Puzzle.query.get(puzzle_id)
    if not puzzle:
        return jsonify({"message": "Puzzle not found"}), 404
        
    is_correct = (answer.lower().strip() == puzzle.correct_answer.lower().strip())
    
    return jsonify({
        "correct": is_correct,
        "message": "Great job!" if is_correct else "Try again!"
    }), 200
