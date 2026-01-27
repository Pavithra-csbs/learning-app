from app import create_app
app = create_app()
with app.app_context():
    key = app.config.get('OPENAI_API_KEY')
    print(f"OPENAI_API_KEY exists: {bool(key)}")
    if key:
        print(f"Key starts with: {key[:5]}...")
    else:
        print("Key is MISSING!")
