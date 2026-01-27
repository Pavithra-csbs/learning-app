from flask import Blueprint, jsonify, request
from app import db
from app.models.leaderboard import Leaderboard
from app.models.user import User
from app.models.quiz import QuizAttempt
from sqlalchemy import func

bp = Blueprint('leaderboard', __name__, url_prefix='/leaderboard')

@bp.route('/<int:standard>', methods=['GET'])
def get_leaderboard(standard):
    topic_id = request.args.get('topic_id', type=int)
    
    if topic_id:
        # Filter by specific topic - sum of best attempts per user for this topic
        results = db.session.query(
            QuizAttempt.student_id, 
            func.max(QuizAttempt.score).label('max_score'),
            func.max(QuizAttempt.stars_earned).label('max_stars')
        ).filter_by(topic_id=topic_id).group_by(QuizAttempt.student_id).order_by(func.max(QuizAttempt.score).desc()).limit(10).all()
        
        result = []
        for r in results:
            user = User.query.get(r.student_id)
            if user:
                result.append({
                    "name": user.name,
                    "score": r.max_score,
                    "stars": r.max_stars,
                    "avatar": user.student_profile.avatar_id if user.student_profile else "fun-emoji"
                })
        return jsonify(result), 200

    # Default: Standard-wide leaderboard
    entries = Leaderboard.query.filter_by(standard=standard).order_by(Leaderboard.total_score.desc()).limit(10).all()
    
    result = []
    for e in entries:
        user = User.query.get(e.student_id)
        if user:
            result.append({
                "name": user.name,
                "score": e.total_score,
                "stars": e.total_stars,
                "avatar": user.student_profile.avatar_id if user.student_profile else "fun-emoji"
            })
    
    return jsonify(result), 200
