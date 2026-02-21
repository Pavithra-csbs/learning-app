from flask import Blueprint, jsonify, request
from app import db
from app.models.teacher_mode import TeacherQuiz, TeacherQuestion, LiveQuizSession
from app.models.user import User
import random
import string

teacher_live_bp = Blueprint('teacher_live', __name__, url_prefix='/api/teacher')

@teacher_live_bp.route('/quizzes/<int:teacher_id>', methods=['GET'])
def get_teacher_quizzes(teacher_id):
    quizzes = TeacherQuiz.query.filter_by(teacher_id=teacher_id).all()
    return jsonify([{
        "id": q.id,
        "title": q.title,
        "class": q.student_class,
        "subject": q.subject,
        "chapter": q.chapter,
        "created_at": q.created_at.isoformat()
    } for q in quizzes]), 200

@teacher_live_bp.route('/create-quiz', methods=['POST'])
def create_quiz():
    data = request.get_json()
    teacher_id = data.get('teacher_id')
    title = data.get('title')
    student_class = data.get('class')
    subject = data.get('subject')
    chapter = data.get('chapter')

    if not all([teacher_id, title, student_class, subject, chapter]):
        return jsonify({"message": "Missing required fields"}), 400

    try:
        quiz = TeacherQuiz(
            teacher_id=teacher_id,
            title=title,
            student_class=student_class,
            subject=subject,
            chapter=chapter
        )
        db.session.add(quiz)
        db.session.commit()
        return jsonify({"message": "Quiz created", "quiz_id": quiz.id}), 201
    except Exception as e:
        db.session.rollback()
        print(f"DEBUG: Error creating quiz: {str(e)}")
        return jsonify({"message": "Error creating quiz", "error": str(e)}), 500

@teacher_live_bp.route('/add-question', methods=['POST'])
def add_question():
    data = request.get_json()
    quiz_id = data.get('quiz_id')
    
    question = TeacherQuestion(
        quiz_id=quiz_id,
        question_text=data.get('question_text'),
        option_a=data.get('option_a'),
        option_b=data.get('option_b'),
        option_c=data.get('option_c'),
        option_d=data.get('option_d'),
        correct_option=data.get('correct_option'),
        time_limit=data.get('time_limit', 30)
    )
    db.session.add(question)
    db.session.commit()
    return jsonify({"message": "Question added", "question_id": question.id}), 201

@teacher_live_bp.route('/get-quiz/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    quiz = TeacherQuiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"message": "Quiz not found"}), 404
    
    questions = [{
        "id": q.id,
        "question_text": q.question_text,
        "option_a": q.option_a,
        "option_b": q.option_b,
        "option_c": q.option_c,
        "option_d": q.option_d,
        "correct_option": q.correct_option,
        "time_limit": q.time_limit
    } for q in quiz.questions]
    
    return jsonify({
        "id": quiz.id,
        "title": quiz.title,
        "class": quiz.student_class,
        "subject": quiz.subject,
        "questions": questions
    }), 200

@teacher_live_bp.route('/start-session', methods=['POST'])
def start_session():
    data = request.get_json()
    quiz_id = data.get('quiz_id')
    
    # Generate unique 6-digit code
    room_code = LiveQuizSession.generate_room_code()
    while LiveQuizSession.query.filter_by(room_code=room_code, is_active=True).first():
        room_code = LiveQuizSession.generate_room_code()
        
    session = LiveQuizSession(quiz_id=quiz_id, room_code=room_code)
    db.session.add(session)
    db.session.commit()
    
    return jsonify({
        "message": "Session started",
        "session_id": session.id,
        "room_code": room_code
    }), 201

@teacher_live_bp.route('/live-responses/<int:session_id>', methods=['GET'])
def get_live_responses(session_id):
    from app.models.teacher_mode import LiveQuizAnswer
    responses = LiveQuizAnswer.query.filter_by(session_id=session_id).all()
    
    # Aggregate by question_id and option
    report = {}
    for r in responses:
        if r.question_id not in report:
            report[r.question_id] = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'total': 0}
        report[r.question_id][r.selected_option] += 1
        report[r.question_id]['total'] += 1
        
    return jsonify(report), 200

@teacher_live_bp.route('/scoreboard/<int:session_id>', methods=['GET'])
def get_scoreboard(session_id):
    from app.models.teacher_mode import LiveQuizScore
    scores = LiveQuizScore.query.filter_by(session_id=session_id).order_by(LiveQuizScore.score.desc()).all()
    
    result = []
    for s in scores:
        user = User.query.get(s.student_id)
        result.append({
            "name": user.name if user else "Unknown",
            "score": s.score,
            "rank": s.rank
        })
    return jsonify(result), 200

# Student Joining Route
student_live_bp = Blueprint('student_live_quiz', __name__, url_prefix='/api/live-quiz')

@student_live_bp.route('/join', methods=['POST'])
def join_room():
    data = request.get_json()
    room_code = data.get('room_code')
    student_id = data.get('student_id')
    
    session = LiveQuizSession.query.filter_by(room_code=room_code, is_active=True).first()
    if not session:
        return jsonify({"message": "Invalid or inactive room code"}), 404
        
    return jsonify({
        "message": "Joined successfully",
        "session_id": session.id,
        "quiz_id": session.quiz_id
    }), 200
