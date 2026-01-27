import time
try:
    from langchain_ollama import OllamaEmbeddings
    print("OllamaEmbeddings import success.")
    
    embed = OllamaEmbeddings(model="nomic-embed-text")
    print("OllamaEmbeddings object created.")
    
    print("Testing embedding generation for 'Hello world'...")
    start = time.time()
    vector = embed.embed_query("Hello world")
    print(f"SUCCESS! Vector length: {len(vector)} (Time: {time.time() - start:.2f}s)")
except Exception as e:
    print(f"FAILED: {e}")
