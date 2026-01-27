from app import create_app, db
app = create_app()
with app.app_context():
    try:
        db.create_all()
        print("Tables created successfully via db.create_all()")
    except Exception as e:
        print(f"Error: {e}")
