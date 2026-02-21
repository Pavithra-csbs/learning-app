from app import create_app
from app.services.rag_service import RAGService
import time

app = create_app()
with app.app_context():
    rag = RAGService()
    print("Testing generate_game_config for 'Acids, Bases and Salts'...")
    start_time = time.time()
    try:
        config = rag.generate_game_config("10", "Science", "Acids, Bases and Salts")
        end_time = time.time()
        print(f"Result (took {end_time - start_time:.2f}s):")
        print(config)
    except Exception as e:
        print(f"FAILED: {e}")
