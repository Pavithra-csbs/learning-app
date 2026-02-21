
from app.services.rag_service import RAGService
import json

def test_theory_gen():
    rag = RAGService()
    print("--- TESTING THEORY GENERATION ---")
    try:
        # Test Case: Acids for Class 10 Science
        result = rag.generate_theory(10, "Science", "Chemical Reactions and Equations", "Acids")
        print("\nSUCCESS! Generated Content:")
        print(json.dumps(result, indent=2))
        
        if not result.get('sections'):
            print("\nWARNING: No sections generated!")
        if not result.get('visual_description'):
            print("\nWARNING: No visual description generated!")
            
    except Exception as e:
        print(f"\nFAILURE! Error: {e}")

if __name__ == "__main__":
    test_theory_gen()
