from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_socketio import SocketIO
from .config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins="*")

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}}, supports_credentials=True)
    socketio.init_app(app)

    @jwt.expired_token_loader
    def my_expired_token_callback(jwt_header, jwt_payload):
        print(f"DEBUG: Token Expired. Header: {jwt_header}, Payload: {jwt_payload}")
        return jsonify({"message": "Token has expired", "error": "token_expired"}), 401

    @jwt.invalid_token_loader
    def my_invalid_token_callback(error):
        print(f"DEBUG: Invalid Token. Error: {error}")
        return jsonify({"message": "Invalid token", "error": "invalid_token"}), 422

    @jwt.unauthorized_loader
    def my_unauthorized_callback(error):
        print(f"DEBUG: Unauthorized. Error: {error}")
        return jsonify({"message": "Missing Authorization Header", "error": "authorization_required"}), 401

    @app.before_request
    def log_request_info():
        print(f"DEBUG: Request to {request.path}")
        print(f"DEBUG: Headers: {dict(request.headers)}")

    @app.route('/')
    def index():
        return "Gamified NCERT Learning Platform Backend is Running! 🚀"




    # Register Blueprints
    from app.routes import auth, student, quiz, puzzle, teacher, leaderboard, ai_chat, feedback
    
    app.register_blueprint(auth.bp)
    app.register_blueprint(student.bp)
    app.register_blueprint(quiz.bp)
    app.register_blueprint(puzzle.bp)
    app.register_blueprint(teacher.bp)
    app.register_blueprint(leaderboard.bp)
    app.register_blueprint(ai_chat.bp)
    app.register_blueprint(feedback.bp)
    
    from app.routes import quiz_generator
    app.register_blueprint(quiz_generator.quiz_generator_bp)
    
    # Initialize Socket Events
    from app.socket import live_quiz
    
    return app
