import os
import json
from flask import current_app
from langchain_core.output_parsers import JsonOutputParser
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_chroma import Chroma

STATIC_FALLBACK_QUIZ = {
    "6": {
        "Science": [
            { "id": 1, "difficulty": "EASY", "question": "Which of these is a component of food?", "options": {"A": "Carbohydrates", "B": "Proteins", "C": "Fats", "D": "All of these"}, "correct_answer": "D", "ncert_reference": "Chapter 1" },
            { "id": 2, "difficulty": "EASY", "question": "Roughage helps in?", "options": {"A": "Protecting body from diseases", "B": "Getting rid of undigested food", "C": "Providing energy", "D": "Growth"}, "correct_answer": "B", "ncert_reference": "Chapter 1" },
            { "id": 3, "difficulty": "EASY", "question": "Vitamin C helps in?", "options": {"A": "Fighting diseases", "B": "Bone growth", "C": "Good eyesight", "D": "Energy"}, "correct_answer": "A", "ncert_reference": "Chapter 1" },
            { "id": 4, "difficulty": "MEDIUM", "question": "Which of these is used to separate grain from stalks?", "options": {"A": "Winnowing", "B": "Threshing", "C": "Sieving", "D": "Handpicking"}, "correct_answer": "B", "ncert_reference": "Chapter 3" },
            { "id": 5, "difficulty": "MEDIUM", "question": "The method of separating tea leaves is?", "options": {"A": "Filtration", "B": "Decantation", "C": "Sieving", "D": "Winnowing"}, "correct_answer": "A", "ncert_reference": "Chapter 3" },
            { "id": 6, "difficulty": "MEDIUM", "question": "Animals that eat only plants are called?", "options": {"A": "Carnivores", "B": "Herbivores", "C": "Omnivores", "D": "None"}, "correct_answer": "B", "ncert_reference": "Chapter 1" },
            { "id": 7, "difficulty": "MEDIUM", "question": "Which of these is a synthetic fiber?", "options": {"A": "Cotton", "B": "Wool", "C": "Nylon", "D": "Jute"}, "correct_answer": "C", "ncert_reference": "Chapter 4" },
            { "id": 8, "difficulty": "MEDIUM", "question": "Water turns to vapor by?", "options": {"A": "Condensation", "B": "Evaporation", "C": "Precipitation", "D": "Freezing"}, "correct_answer": "B", "ncert_reference": "Chapter 11" },
            { "id": 9, "difficulty": "HARD", "question": "Which part of the plant helps in evaporation?", "options": {"A": "Root", "B": "Stem", "C": "Stomata (Leaves)", "D": "Flower"}, "correct_answer": "C", "ncert_reference": "Chapter 7" },
            { "id": 10, "difficulty": "HARD", "question": "Magnetic poles always exist in?", "options": {"A": "Singles", "B": "Pairs", "C": "Triples", "D": "Quads"}, "correct_answer": "B", "ncert_reference": "Chapter 10" },
            { "id": 11, "difficulty": "HARD", "question": "Scurvy is caused by deficiency of?", "options": {"A": "Vitamin A", "B": "Vitamin B1", "C": "Vitamin C", "D": "Vitamin D"}, "correct_answer": "C", "ncert_reference": "Chapter 1" },
            { "id": 12, "difficulty": "HARD", "question": "The SI unit of length is?", "options": {"A": "Kilogram", "B": "Meter", "C": "Second", "D": "Newton"}, "correct_answer": "B", "ncert_reference": "Chapter 8" }
        ],
        "Math": [
            { "id": 1, "difficulty": "EASY", "question": "Value of 8000 + 500 + 20 + 3 is?", "options": {"A": "8523", "B": "8532", "C": "8253", "D": "5823"}, "correct_answer": "A", "ncert_reference": "Numbers" },
            { "id": 2, "difficulty": "EASY", "question": "Smallest whole number is?", "options": {"A": "1", "B": "0", "C": "-1", "D": "None"}, "correct_answer": "B", "ncert_reference": "Whole Numbers" },
            { "id": 3, "difficulty": "EASY", "question": "The predecessor of 1000 is?", "options": {"A": "999", "B": "1001", "C": "1000", "D": "990"}, "correct_answer": "A", "ncert_reference": "Whole Numbers" },
            { "id": 4, "difficulty": "MEDIUM", "question": "Which of these is a prime number?", "options": {"A": "4", "B": "9", "C": "11", "D": "15"}, "correct_answer": "C", "ncert_reference": "Playing with Numbers" },
            { "id": 5, "difficulty": "MEDIUM", "question": "Area of square with side 5cm?", "options": {"A": "20cm²", "B": "25cm²", "C": "15cm²", "D": "10cm²"}, "correct_answer": "B", "ncert_reference": "Mensuration" },
            { "id": 6, "difficulty": "MEDIUM", "question": "Value of 3/4 + 1/4 is?", "options": {"A": "1/2", "B": "4/8", "C": "1", "D": "2/4"}, "correct_answer": "C", "ncert_reference": "Fractions" },
            { "id": 7, "difficulty": "MEDIUM", "question": "Number of sides in a quadrilateral is?", "options": {"A": "3", "B": "4", "C": "5", "D": "6"}, "correct_answer": "B", "ncert_reference": "Shapes" },
            { "id": 8, "difficulty": "MEDIUM", "question": "Integer for '10 degrees below zero' is?", "options": {"A": "10", "B": "-10", "C": "0", "D": "-20"}, "correct_answer": "B", "ncert_reference": "Integers" },
            { "id": 9, "difficulty": "HARD", "question": "Ratio of 30 minutes to 1.5 hours is?", "options": {"A": "1:3", "B": "3:1", "C": "1:2", "D": "2:1"}, "correct_answer": "A", "ncert_reference": "Ratio" },
            { "id": 10, "difficulty": "HARD", "question": "Numerical factor in 12x is?", "options": {"A": "1", "B": "12", "C": "x", "D": "12x"}, "correct_answer": "B", "ncert_reference": "Algebra" },
            { "id": 11, "difficulty": "HARD", "question": "Side of square with perimeter 40cm?", "options": {"A": "20cm", "B": "10cm", "C": "5cm", "D": "15cm"}, "correct_answer": "B", "ncert_reference": "Mensuration" },
            { "id": 12, "difficulty": "HARD", "question": "Sum of three angles of a triangle is?", "options": {"A": "90°", "B": "180°", "C": "270°", "D": "360°"}, "correct_answer": "B", "ncert_reference": "Geometry" }
        ]
    },
    "7": { 
        "Science": [ { "id": 1, "difficulty": "EASY", "question": "Unit of temperature is?", "options": {"A": "Celsius", "B": "Liter", "C": "Gram", "D": "Meter"}, "correct_answer": "A", "ncert_reference": "Heat" } ],
        "Math": [ { "id": 1, "difficulty": "EASY", "question": "Mean of 1, 2, 3?", "options": {"A": "2", "B": "1", "C": "3", "D": "6"}, "correct_answer": "A", "ncert_reference": "Data" } ]
    },
    "8": { 
        "Science": [ { "id": 1, "difficulty": "MEDIUM", "question": "Force is defined as?", "options": {"A": "Push or Pull", "B": "Mass", "C": "Volume", "D": "Speed"}, "correct_answer": "A", "ncert_reference": "Force" } ],
        "Math": [ { "id": 1, "difficulty": "MEDIUM", "question": "Square root of 625?", "options": {"A": "25", "B": "15", "C": "35", "D": "45"}, "correct_answer": "A", "ncert_reference": "Squares" } ]
    },
    "9": { 
        "Science": [ { "id": 1, "difficulty": "HARD", "question": "SI unit of power is?", "options": {"A": "Watt", "B": "Joule", "C": "Newton", "D": "Pascal"}, "correct_answer": "A", "ncert_reference": "Laws of Motion" } ],
        "Math": [ { "id": 1, "difficulty": "HARD", "question": "Area of triangle using Heron formula involves?", "options": {"A": "s(s-a)(s-b)(s-c)", "B": "1/2 bh", "C": "l*h", "D": "2pr"}, "correct_answer": "A", "ncert_reference": "Heron Formula" } ]
    },
    "10": { 
        "Science": [ { "id": 1, "difficulty": "HARD", "question": "Formula of bleaching powder?", "options": {"A": "CaOCl2", "B": "NaCl", "C": "CaCO3", "D": "H2O"}, "correct_answer": "A", "ncert_reference": "Chemistry" } ],
        "Math": [ { "id": 1, "difficulty": "HARD", "question": "Sin 0 is?", "options": {"A": "0", "B": "1", "C": "Infinity", "D": "0.5"}, "correct_answer": "A", "ncert_reference": "Trigonometry" } ]
    }
}

class RAGService:
    def __init__(self):
        self.vector_db_path = None
        self.pdf_path = None
        self.embeddings = None
        self.vector_store = None

    def _load_config(self):
        """Loads configuration with Ollama setup."""
        if not self.embeddings:
            print("--- RAG_DEBUG: STAGE 1 - LOADING OLLAMA CONFIG ---")
            try:
                self.vector_db_path = current_app.config.get('VECTOR_DB_PATH')
                self.pdf_path = current_app.config.get('NCERT_PDF_PATH')
                
                print(f"RAG_DEBUG: PDF_PATH: {self.pdf_path}")
                print(f"RAG_DEBUG: VECTOR_DB_PATH: {self.vector_db_path}")
                
                print("RAG_DEBUG: Initializing OllamaEmbeddings (nomic-embed-text)...")
                self.embeddings = OllamaEmbeddings(
                    model="nomic-embed-text"
                )
                print("RAG_DEBUG: Embeddings object created.")
            except Exception as e:
                print(f"RAG_DEBUG: FATAL ERROR during _load_config: {e}")

    def initialize_vector_db(self):
        """Initializes or loads the ChromaDB vector store with extreme logging."""
        self._load_config()
        if not self.embeddings:
            print("RAG_DEBUG: Cannot initialize Vector DB - No Embeddings object!")
            return None
            
        print("--- RAG_DEBUG: STAGE 2 - DB INITIALIZATION ---")
        try:
            if not os.path.exists(self.vector_db_path):
                print(f"RAG_DEBUG: Creating vector folder at {self.vector_db_path}")
                os.makedirs(self.vector_db_path)

            print(f"RAG_DEBUG: Attempting Chroma instantiation at {self.vector_db_path}")
            self.vector_store = Chroma(
                persist_directory=self.vector_db_path,
                embedding_function=self.embeddings
            )
            print("RAG_DEBUG: SUCCESS - Chroma instance is active.")
            return self.vector_store
        except Exception as e:
            print(f"RAG_DEBUG: FATAL ERROR during initialize_vector_db: {e}")
            import traceback
            traceback.print_exc()
            return None

    def ingest_pdf(self, filename):
        """Ingests a PDF file with extreme logging."""
        self._load_config()
        if not self.vector_store:
            print("RAG_DEBUG: Vector store not active. Initializing now...")
            self.initialize_vector_db()
            if not self.vector_store:
                print("RAG_DEBUG: FAILED to initialize vector store for ingestion.")
                return {"error": "Vector DB not initialized. Check server logs."}
            
        file_path = os.path.join(self.pdf_path, filename)
        print(f"--- RAG_DEBUG: STAGE 3 - INGESTING {filename} ---")
        
        if not os.path.exists(file_path):
            print(f"RAG_DEBUG: ERROR - File not found at {file_path}")
            return {"error": f"File {filename} not found"}

        try:
            from langchain_community.document_loaders import PyPDFLoader
            from langchain_text_splitters import RecursiveCharacterTextSplitter
            
            print(f"RAG_DEBUG: Loading {filename} via PyPDFLoader...")
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            print(f"RAG_DEBUG: Loaded {len(documents)} pages.")

            print("RAG_DEBUG: Splitting text into chunks...")
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            chunks = text_splitter.split_documents(documents)
            print(f"RAG_DEBUG: Created {len(chunks)} chunks.")

            print("RAG_DEBUG: Adding chunks to vector store...")
            self.vector_store.add_documents(chunks)
            print("RAG_DEBUG: INGESTION COMPLETE.")
            
            return {"status": "success", "chunks_added": len(chunks)}
        except Exception as e:
            print(f"RAG_DEBUG: FATAL ERROR during ingest_pdf: {e}")
            import traceback
            traceback.print_exc()
            return {"error": str(e)}

    def generate_quiz(self, standard, subject, chapter, topic, target_difficulty="EASY"):
        """Generates a progressive 12-question quiz strictly based on NCERT data."""
        self._load_config()
        
        print(f"--- RAG_DEBUG: GENERATING QUIZ FOR LEVEL {target_difficulty} ---")
        context_text = ""
        if self.initialize_vector_db():
            try:
                print(f"RAG_DEBUG: Searching context for: {subject} Class {standard} {topic}")
                retriever = self.vector_store.as_retriever(search_kwargs={"k": 5})
                print("RAG_DEBUG: Invoking retriever...")
                docs = retriever.invoke(f"NCERT Class {standard} {subject} {chapter} {topic}")
                print(f"RAG_DEBUG: Found {len(docs)} relevant documents.")
                context_text = "\n\n".join([doc.page_content for doc in docs])
                print(f"RAG_DEBUG: Context retrieved ({len(context_text)} chars).")
            except Exception as e:
                print(f"RAG_DEBUG: ERROR in context search: {e}")
                import traceback
                traceback.print_exc()

        prompt_template = """
You are an NCERT Quiz Master for Class {standard}.
STRICTLY use ONLY the provided NCERT context below to generate 12 MCQ questions.
DO NOT use any external knowledge. 

Target Difficulty: {difficulty} (Ensure questions are appropriately challenging for this level)

Context:
{context}

Topic: {topic}

Rules:
1. Generate EXACTLY 12 MCQ questions.
2. All 12 questions MUST be of {difficulty} difficulty.
3. Provide VALID JSON only.
4. Content must be appropriate for Class {standard} students.

Format:
{{
  "questions": [
    {{
      "id": 1,
      "difficulty": "{difficulty}",
      "question": "...",
      "options": {{ "A": "...", "B": "...", "C": "...", "D": "..." }},
      "correct_answer": "A",
      "ncert_reference": "..."
    }}
  ]
}}
"""
        if context_text:
            try:
                from langchain_core.prompts import PromptTemplate
                from langchain_core.output_parsers import JsonOutputParser
                
                print("RAG_DEBUG: Prompting Ollama (mistral)...")
                llm = ChatOllama(model="mistral", temperature=0.4)
                chain = PromptTemplate.from_template(prompt_template) | llm | JsonOutputParser()
                result = chain.invoke({
                    "context": context_text, 
                    "standard": standard, 
                    "topic": topic, 
                    "difficulty": target_difficulty
                })
                print("RAG_DEBUG: Ollama Generation success.")
                return result
            except Exception as e:
                print(f"RAG_DEBUG: Ollama FAILED: {e}")

        print("RAG_DEBUG: ERROR - Falling back to static data!")
        std_str = str(standard)
        if std_str in STATIC_FALLBACK_QUIZ and subject in STATIC_FALLBACK_QUIZ[std_str]:
            return {"questions": STATIC_FALLBACK_QUIZ[std_str][subject]}
            
        return {"error": "No curriculum found for this topic yet! 🤖"}
