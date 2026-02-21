import os
import shutil
import sys
import time
from app import create_app
from app.services.rag_service import RAGService

def ingest_all_new():
    print("--- NEW TEXTBOOK INGESTION START ---")
    sys.stdout.flush()
    
    source_root = r'D:\textbook_test\textbook'
    app = create_app()
    
    with app.app_context():
        target_dir = app.config.get('NCERT_PDF_PATH')
        if not os.path.exists(target_dir):
            os.makedirs(target_dir)
            
        rag = RAGService()
        print("DEBUG: Initializing Vector DB...")
        rag.initialize_vector_db()
        
        # Iterate through class folders
        for class_folder in os.listdir(source_root):
            class_path = os.path.join(source_root, class_folder)
            if not os.path.isdir(class_path):
                continue
                
            standard_num = "".join(filter(str.isdigit, class_folder))
            if not standard_num:
                continue
                
            print(f"\n>>> Processing {class_folder} (Standard {standard_num})")
            
            for filename in os.listdir(class_path):
                if not filename.endswith(".pdf"):
                    continue
                    
                subject_name = filename.replace(".pdf", "").lower()
                new_filename = f"class_{standard_num}_{subject_name}.pdf"
                dest_path = os.path.join(target_dir, new_filename)
                
                print(f"  Copying {filename} -> {new_filename}")
                shutil.copy2(os.path.join(class_path, filename), dest_path)
                
                print(f"  Ingesting {new_filename}...")
                start_time = time.time()
                try:
                    result = rag.ingest_pdf(new_filename)
                    duration = time.time() - start_time
                    print(f"  RESULT: {result} (Time: {duration:.2f}s)")
                except Exception as e:
                    print(f"  FAILED: {e}")
                sys.stdout.flush()

    print("\n--- INGESTION COMPLETE ---")
    sys.stdout.flush()

if __name__ == "__main__":
    if not os.path.exists(r'D:\textbook_test\textbook'):
        print("ERROR: Source directory D:\\textbook_test\\textbook not found. Please ensure the zip is extracted.")
    else:
        ingest_all_new()
