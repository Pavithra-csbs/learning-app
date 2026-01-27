import os
import sys
from app import create_app
from app.services.rag_service import RAGService

def ingest_all():
    print("DEBUG: STAGE 1 - Environment Check")
    openai_key = os.environ.get('OPENAI_API_KEY')
    print("DEBUG: OPENAI_API_KEY present:", bool(openai_key))
    
    app = create_app()
    with app.app_context():
        print("DEBUG: STAGE 2 - App Config Check")
        pdf_dir = app.config.get(r'C:\Users\mirun\OneDrive\Desktop\learning_platform\backend\data\ncert_pdfs')
        print("DEBUG: PDF PATH from Config:", pdf_dir)
        
        if not pdf_dir or not os.path.exists(pdf_dir):
             print("ERROR: PDF DIR DOES NOT EXIST:", pdf_dir)
             return

        rag = RAGService()
        print("DEBUG: Initializing Vector DB...")
        rag.initialize_vector_db()
        
        print("DEBUG: Scanning for PDFs...")
        for filename in os.listdir(pdf_dir):
            if filename.endswith(".pdf"):
                print("DEBUG: Ingesting:", filename)
                result = rag.ingest_pdf(filename)
                print("DEBUG: Result:", result)

if __name__ == "__main__":
    ingest_all()
