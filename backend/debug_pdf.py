import os
import sys
from app import create_app
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

app = create_app()

def debug_ingestion(filename):
    with app.app_context():
        pdf_dir = app.config['NCERT_PDF_PATH']
        file_path = os.path.join(pdf_dir, filename)
        
        if not os.path.exists(file_path):
            print(f"Error: File {file_path} not found")
            return

        print(f"Loading {file_path}...")
        try:
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            print(f"Loaded {len(documents)} pages")
            
            if len(documents) > 0:
                print(f"First page content (truncated): {documents[0].page_content[:200]}")
                
                text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
                chunks = text_splitter.split_documents(documents)
                print(f"Created {len(chunks)} chunks")
            else:
                print("PDF loaded but no content found (maybe scanned image?)")
        except Exception as e:
            print(f"Error during loading/splitting: {e}")

if __name__ == "__main__":
    debug_ingestion("science 6th.pdf")
