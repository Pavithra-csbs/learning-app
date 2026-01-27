import os
import shutil
import time
from flask import Flask
from app.services.rag_service import RAGService

def verify_fix():
    print("--- VERIFYING RAG FIX ---")
    temp_db = os.path.join(os.getcwd(), 'data', 'temp_vector_db')
    if os.path.exists(temp_db):
        shutil.rmtree(temp_db)
    
    app = Flask(__name__)
    app.config['VECTOR_DB_PATH'] = temp_db
    app.config['NCERT_PDF_PATH'] = os.path.join(os.getcwd(), 'data', 'ncert_pdfs')
    
    with app.app_context():
        rag = RAGService()
        print("\n[1] Initializing Clean Vector DB...")
        db = rag.initialize_vector_db()
        
        print("\n[2] Testing ingestion of one small book (Math 6)...")
        # Ensure we pick a file that actually exists
        files = [f for f in os.listdir(app.config['NCERT_PDF_PATH']) if '6th' in f]
        if not files:
            print("ERROR: No 6th grade PDF found to test.")
            return
            
        test_file = files[0]
        print(f"Ingesting: {test_file}")
        start = time.time()
        res = rag.ingest_pdf(test_file)
        print(f"Ingestion result: {res} (Time: {time.time() - start:.2f}s)")
        
        if "error" not in res:
            print("\n[3] Testing Retrieval on new DB...")
            start = time.time()
            retriever = db.as_retriever(search_kwargs={"k": 2})
            docs = retriever.invoke("math numbers")
            print(f"Retrieval SUCCESS! Found {len(docs)} docs (Time: {time.time() - start:.2f}s)")
            if docs:
                print(f"Sample: {docs[0].page_content[:100]}...")

if __name__ == "__main__":
    verify_fix()
