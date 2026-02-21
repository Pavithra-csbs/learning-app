from app import socketio, db
from flask_socketio import emit, join_room, leave_room
from app.models.teacher_mode import LiveQuizSession, TeacherQuestion, LiveQuizAnswer, LiveQuizScore

@socketio.on('join_room')
def handle_join_room(data):
    room = data['room_code']
    student_name = data['student_name']
    join_room(room)
    # Broadcast to teacher that a player joined
    emit('player_joined', {'name': student_name}, room=room)
    print(f"DEBUG: {student_name} joined room {room}")

@socketio.on('start_live_quiz')
def handle_start_quiz(data):
    room = data['room_code']
    # Broadcast to all students in the room
    emit('quiz_started', {"status": "started"}, room=room)

@socketio.on('next_question')
def handle_next_question(data):
    room = data['room_code']
    question_id = data['question_id']
    question = TeacherQuestion.query.get(question_id)
    if question:
        emit('new_question', {
            "id": question.id,
            "text": question.question_text,
            "options": {
                "A": question.option_a,
                "B": question.option_b,
                "C": question.option_c,
                "D": question.option_d
            },
            "time_limit": question.time_limit
        }, room=room)

@socketio.on('submit_live_answer')
def handle_live_answer(data):
    room = data['room_code']
    student_id = data.get('student_id')
    question_id = data.get('question_id')
    selected = data.get('selected_option')
    response_time = data.get('response_time')
    
    session = LiveQuizSession.query.filter_by(room_code=room, is_active=True).first()
    question = TeacherQuestion.query.get(question_id)
    
    if session and question:
        is_correct = (selected == question.correct_option)
        
        # Save response
        ans = LiveQuizAnswer(
            session_id=session.id,
            student_id=student_id,
            question_id=question_id,
            selected_option=selected,
            is_correct=is_correct,
            response_time=response_time
        )
        db.session.add(ans)
        
        # Update score
        score_entry = LiveQuizScore.query.filter_by(session_id=session.id, student_id=student_id).first()
        if not score_entry:
            score_entry = LiveQuizScore(session_id=session.id, student_id=student_id, score=0)
            db.session.add(score_entry)
            
        if is_correct:
            # Base 10 + speed bonus (max 5)
            # time_limit usually 30s. If fast (e.g. 5s), bonus is higher.
            speed_bonus = max(0, min(5, (question.time_limit - response_time) / 5))
            score_entry.score += int(10 + speed_bonus)
            
        db.session.commit()
        
        # Notify teacher dashboard to update charts
        emit('response_received', {
            "student_id": student_id,
            "is_correct": is_correct,
            "option": selected
        }, room=room)
