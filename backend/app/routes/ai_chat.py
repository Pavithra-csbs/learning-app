from flask import Blueprint, jsonify, request
from app.services.ai_service import AIService

bp = Blueprint('ai_chat', __name__, url_prefix='/ai')

@bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    query = data.get('query')
    
    response = AIService.get_response(query)
    return jsonify(response), 200
