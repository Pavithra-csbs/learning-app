import os
import sys
import time
from app import create_app
from app.services.rag_service import RAGService

def ingest_now():
    print("--- INGESTION START ---")
    sys.stdout.flush()
    
    app = create_app()
    with app.app_context():
        target_key = 'NCERT_PDF_PATH'
        pdf_dir = app.config.get(target_key)
        
        print(f"DEBUG: PDF Directory: {pdf_dir}")
        sys.stdout.flush()
        
        if not pdf_dir or not os.path.exists(pdf_dir):
             print(f"ERROR: Directory {pdf_dir} does not exist!")
             sys.stdout.flush()
             return

        rag = RAGService()
        print("DEBUG: Initializing Vector DB with Ollama...")
        sys.stdout.flush()
        
        try:
            rag.initialize_vector_db()
            print("DEBUG: Vector DB initialization sequence passed.")
            sys.stdout.flush()
        except Exception as e:
            print(f"FATAL ERROR during init: {e}")
            sys.stdout.flush()
            return

        print(f"DEBUG: Scanning for PDFs in: {pdf_dir}")
        files = [f for f in os.listdir(pdf_dir) if f.endswith(".pdf")]
        print(f"DEBUG: Found {len(files)} PDFs")
        sys.stdout.flush()
        
        for i, filename in enumerate(files):
            print(f"[{i+1}/{len(files)}] INGESTING: {filename}")
            sys.stdout.flush()
            start_time = time.time()
            try:
                result = rag.ingest_pdf(filename)
                duration = time.time() - start_time
                print(f"[{i+1}/{len(files)}] RESULT: {result} (Time: {duration:.2f}s)")
                sys.stdout.flush()
            except Exception as e:
                print(f"[{i+1}/{len(files)}] FAILED: {e}")
                sys.stdout.flush()

    print("--- INGESTION COMPLETE ---")
    sys.stdout.flush()

if __name__ == "__main__":
    ingest_now()
