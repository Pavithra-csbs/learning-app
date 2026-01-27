from app import create_app
app = create_app()
with app.app_context():
    key = app.config.get('GEMINI_API_KEY')
    print(f"GEMINI_API_KEY exists: {bool(key)}")
    if key:
        print(f"Key exists and is length: {len(key)}")
    else:
        print("Key is MISSING!")
