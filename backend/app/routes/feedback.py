from flask import Blueprint, jsonify, request
from app import db
from app.models.extras import Feedback

bp = Blueprint('feedback', __name__, url_prefix='/feedback')

@bp.route('/', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    message = data.get('message')
    rating = data.get('rating')
    student_id = data.get('student_id')
    
    fb = Feedback(message=message, rating=rating, student_id=student_id)
    db.session.add(fb)
    db.session.commit()
    
    return jsonify({"message": "Feedback received!"}), 201
