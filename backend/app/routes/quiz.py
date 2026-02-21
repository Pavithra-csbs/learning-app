from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.quiz import Question, QuizAttempt, StudentTopicProgress
from app.models.game_level import GameLevel
from app.models.leaderboard import Leaderboard
from app.models.user import User, StudentProfile
from app.services.quiz_engine import QuizService

bp = Blueprint('quiz', __name__, url_prefix='/quiz')

@bp.route('/level/<int:level_id>/questions', methods=['GET'])
@jwt_required()
def get_questions(level_id):
    questions = Question.query.filter_by(game_level_id=level_id).all()
    result = []
    for q in questions:
        result.append({
            "id": q.id,
            "question": q.question_text,
            "options": q.options,
        })
    return jsonify(result), 200

@bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_quiz():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    data = request.get_json()
    level_id = data.get('level_id')
    topic_id = data.get('topic_id') # Needed for overall progress
    score = data.get('score')
    time_taken = data.get('time_taken', 0)
    
    # Calculate Game Logic
    results = QuizService.calculate_results(score)
    
    # Save Attempt
    attempt = QuizAttempt(
        student_id=user_id,
        game_level_id=level_id,
        score=score,
        time_taken=time_taken,
        level_achieved=results['level'],
        stars_earned=results['stars']
    )
    db.session.add(attempt)
    
    # Update Topic Progress
    if topic_id:
        progress = StudentTopicProgress.query.filter_by(student_id=user_id, topic_id=topic_id).first()
        if not progress:
            progress = StudentTopicProgress(student_id=user_id, topic_id=topic_id)
            db.session.add(progress)
        
        # Update stars if better
        if results['stars'] > progress.stars:
            progress.stars = results['stars']
        progress.lesson_completed = True
    
    # Update Leaderboard
    profile = user.student_profile
    if profile:
        lb_entry = Leaderboard.query.filter_by(student_id=user_id).first()
        if not lb_entry:
            lb_entry = Leaderboard(student_id=user_id, grade=profile.grade)
            db.session.add(lb_entry)
        
        lb_entry.total_score += score
        lb_entry.total_stars += results['stars']
    
    db.session.commit()
    
    return jsonify(results), 200
