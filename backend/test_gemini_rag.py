from app import create_app
from app.services.rag_service import RAGService
import os

app = create_app()

def test_gen():
    with app.app_context():
        rag = RAGService()
        # Try to ingest first to be sure
        print("Ensuring content is ingested...")
        res = rag.ingest_pdf("science 6th.pdf")
        print(f"Ingestion result: {res}")
        
        print("Generating quiz...")
        quiz = rag.generate_quiz(6, "Science", "Chapter 1", "Food")
        print(f"Quiz: {quiz}")

if __name__ == "__main__":
    test_gen()
