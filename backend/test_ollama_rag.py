import os
import time
from flask import Flask
from app.services.rag_service import RAGService

def test_rag():
    print("--- STARTING OLLAMA RAG TEST ---")
    app = Flask(__name__)
    app.config['NCERT_PDF_PATH'] = os.path.join(os.getcwd(), 'data', 'ncert_pdfs')
    app.config['VECTOR_DB_PATH'] = os.path.join(os.getcwd(), 'data', 'vector_db')
    
    with app.app_context():
        rag = RAGService()
        
        print("\n[STEP 1] Initializing Vector DB...")
        start = time.time()
        db = rag.initialize_vector_db()
        print(f"DONE in {time.time() - start:.2f}s. DB Active: {db is not None}")
        
        if not db:
            print("ERROR: DB failed to initialize.")
            return

        print("\n[STEP 2] Testing Context Retrieval...")
        start = time.time()
        query = "NCERT Class 6 Science Food Components"
        retriever = db.as_retriever(search_kwargs={"k": 3})
        print(f"Querying: '{query}'")
        docs = retriever.invoke(query)
        print(f"DONE in {time.time() - start:.2f}s. Found {len(docs)} docs.")
        
        if docs:
            print(f"Preview: {docs[0].page_content[:200]}...")

        print("\n[STEP 3] Testing LLM Generation (Mistral)...")
        start = time.time()
        # Mocking generate_quiz context to avoid full logic re-implementation for test
        try:
            from langchain_ollama import ChatOllama
            from langchain_core.prompts import PromptTemplate
            from langchain_core.output_parsers import JsonOutputParser
            
            llm = ChatOllama(model="mistral", temperature=0)
            prompt = PromptTemplate.from_template("Generate 1 easy question about {topic} based on {context}. JSON format only.")
            chain = prompt | llm | JsonOutputParser()
            
            res = chain.invoke({"topic": "Food", "context": docs[0].page_content[:500] if docs else "General science"})
            print(f"DONE in {time.time() - start:.2f}s.")
            print(f"LLM Response: {res}")
        except Exception as e:
            print(f"LLM FAILED: {e}")

if __name__ == "__main__":
    test_rag()
