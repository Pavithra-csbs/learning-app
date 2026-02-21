from flask import Blueprint, jsonify, request
from app.services.leaderboard_service import LeaderboardService
from app.models.leaderboard_ext import LeaderboardExtRank
from app.models.user import User

leaderboard_ext_bp = Blueprint('leaderboard_ext', __name__, url_prefix='/api/leaderboard')

@leaderboard_ext_bp.route('/update', methods=['POST'])
def update_leaderboard():
    data = request.get_json()
    student_id = data.get('student_id')
    if not student_id:
        return jsonify({"message": "student_id is required"}), 400
        
    try:
        LeaderboardService.update_score(student_id, data)
        return jsonify({"message": "Leaderboard updated successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@leaderboard_ext_bp.route('/global', methods=['GET'])
def get_global():
    leaderboard = LeaderboardService.get_global_leaderboard()
    return jsonify(leaderboard), 200

@leaderboard_ext_bp.route('/filter', methods=['GET'])
def filter_leaderboard():
    class_name = request.args.get('class')
    subject = request.args.get('subject')
    chapter = request.args.get('chapter')
    
    leaderboard = LeaderboardService.get_filtered_leaderboard(class_name, subject, chapter)
    return jsonify(leaderboard), 200

@leaderboard_ext_bp.route('/student/<int:student_id>', methods=['GET'])
def get_student_rank(student_id):
    rank_entry = LeaderboardExtRank.query.filter_by(student_id=student_id).first()
    if not rank_entry:
        return jsonify({"message": "No rank found for this student"}), 404
        
    user = User.query.get(student_id)
    return jsonify({
        "rank": rank_entry.rank_position,
        "total_score": rank_entry.total_score,
        "name": user.name if user else "Unknown"
    }), 200
