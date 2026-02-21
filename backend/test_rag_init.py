
print("DEBUG: SCRIPT START")
import os
import sys

# Add the project root to sys.path so we can import app modules directly
sys.path.append(os.getcwd())

print("DEBUG: Importing RAGService directly...")
try:
    from app.services.rag_service import RAGService
    print("DEBUG: RAGService imported.")
    
    rag = RAGService()
    # Mocking current_app.config for standalone test
    class MockConfig:
        def get(self, key):
            if key == 'VECTOR_DB_PATH': return os.path.join(os.getcwd(), 'data', 'vector_db_ollama')
            if key == 'NCERT_PDF_PATH': return os.path.join(os.getcwd(), 'data', 'ncert_pdfs')
            return None
            
    rag.vector_db_path = os.path.join(os.getcwd(), 'data', 'vector_db_ollama')
    rag.pdf_path = os.path.join(os.getcwd(), 'data', 'ncert_pdfs')
    
    print("DEBUG: Initializing vector DB (standalone)...")
    # We need to manually set embeddings for standalone test since _load_config uses current_app
    from langchain_ollama import OllamaEmbeddings
    rag.embeddings = OllamaEmbeddings(
        base_url="http://127.0.0.1:11434",
        model="nomic-embed-text"
    )
    
    rag.initialize_vector_db()
    print("TEST: SUCCESS - RAGService initialized standalone.")
    
except Exception as e:
    print(f"TEST: FAILED with error: {e}")
    import traceback
    traceback.print_exc()
