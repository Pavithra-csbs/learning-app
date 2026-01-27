import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.services.rag_service import RAGService

app = create_app()

def test_rag():
    with app.app_context():
        rag = RAGService()
        print("Checking Vector DB...")
        if rag.initialize_vector_db():
            print("Vector DB initialized.")
        else:
            print("Failed to initialize Vector DB (Check API Key).")
            
        # Mocking or checking for PDF
        pdf_dir = app.config['NCERT_PDF_PATH']
        pdfs = os.listdir(pdf_dir) if os.path.exists(pdf_dir) else []
        print(f"Found PDFs: {pdfs}")
        
        if pdfs:
            print(f"Ingesting {pdfs[0]}...")
            res = rag.ingest_pdf(pdfs[0])
            print(f"Ingestion Result: {res}")
            
            print("Generating Quiz...")
            quiz = rag.generate_quiz("Class 8", "Science", "Crop Production", "Agricultural Practices")
            print(f"Quiz Result: {quiz}")
        else:
            print("No PDFs found to test ingestion.")

if __name__ == "__main__":
    test_rag()
