import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess-gamified-ncert'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'super-secret-jwt-key'
    
    # For future: Mail settings for OTP
    # MAIL_SERVER = ... 

    # RAG Configuration
    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    NCERT_PDF_PATH = os.path.join(BASE_DIR, 'data', 'ncert_pdfs')
    VECTOR_DB_PATH = os.path.join(BASE_DIR, 'data', 'vector_db')
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
