from app import socketio
from flask_socketio import emit, join_room, leave_room
from app.models.extras import LiveQuiz

@socketio.on('join_quiz')
def handle_join_quiz(data):
    room = data['room_code']
    student_name = data['student_name']
    join_room(room)
    emit('player_joined', {'name': student_name}, room=room)
    print(f"{student_name} joined room {room}")

@socketio.on('start_quiz')
def handle_start_quiz(data):
    room = data['room_code']
    emit('quiz_started', data, room=room)

@socketio.on('submit_answer')
def handle_answer(data):
    room = data['room_code']
    # Broadcast or store answer. For now, let's just echo score to teacher
    # In a full app, we'd validate against the DB question
    emit('update_score', data, room=room)
