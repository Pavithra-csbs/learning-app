import os
import sys
from app import create_app
from app.services.rag_service import RAGService
from langchain_core.documents import Document

app = create_app()

def test_chroma_save():
    with app.app_context():
        rag = RAGService()
        rag.initialize_vector_db()
        
        print("Creating mock documents...")
        docs = [
            Document(page_content="The Earth is round.", metadata={"source": "test"}),
            Document(page_content="Mars is red.", metadata={"source": "test"})
        ]
        
        print("Adding documents to Chroma...")
        try:
            rag.vector_store.add_documents(docs)
            print("Documents added.")
            # Explicitly checking if we can query it immediately
            results = rag.vector_store.similarity_search("What color is Mars?")
            print(f"Search results: {len(results)}")
            if results:
                print(f"Top result: {results[0].page_content}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_chroma_save()
