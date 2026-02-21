from flask import Blueprint, jsonify, request
from app.models.extras import Puzzle
from app.models.game_level import GameLevel

bp = Blueprint('puzzle', __name__, url_prefix='/puzzle')

@bp.route('/<int:level_id>', methods=['GET'])
def get_puzzles(level_id):
    puzzles = Puzzle.query.filter_by(game_level_id=level_id).all()
    result = [{
        "id": p.id,
        "question": p.puzzle_data.get('question'),
        "puzzle_type": p.puzzle_data.get('puzzle_type'),
        "image_url": p.puzzle_data.get('image_url')
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
        
    is_correct = (str(answer).lower().strip() == str(puzzle.correct_answer).lower().strip())
    
    return jsonify({
        "correct": is_correct,
        "message": "Great job!" if is_correct else "Try again!"
    }), 200
