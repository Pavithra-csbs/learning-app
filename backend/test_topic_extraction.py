from app import create_app
from app.services.rag_service import RAGService

def test_extraction():
    import sys
    import inspect
    print(f"DEBUG: sys.path: {sys.path}")
    app = create_app()
    with app.app_context():
        rag = RAGService()
        print(f"DEBUG: RAGService file: {inspect.getfile(RAGService)}")
        
        standards = [6, 7, 8, 9, 10]
        subjects = ["Science", "Math"]
        
        for std in standards:
            print(f"\n--- Testing Standard {std} ---")
            for sub in subjects:
                topics = rag.get_topics(std, sub, "all")
                print(f"[{sub}] {topics[:3]}... (Total: {len(topics)})")

if __name__ == "__main__":
    test_extraction()
