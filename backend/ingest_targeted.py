import os
import sys
from app import create_app
from app.services.rag_service import RAGService

app = create_app()

def ingest_targeted(filename):
    with app.app_context():
        rag = RAGService()
        print(f"Ingesting {filename}...")
        try:
            res = rag.ingest_pdf(filename)
            print(f"Result: {res}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    # We target Science 6th as it's a common starting point
    ingest_targeted("science 6th.pdf")
