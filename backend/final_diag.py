from app import create_app, db
from app.models.user import User
import traceback

app = create_app()
with app.app_context():
    print(f"Connected to: {db.engine.url}")
    try:
        users = db.session.query(User).all()
        print(f"SUCCESS: Found {len(users)} users.")
        for u in users:
            print(f"User: {u.email}, Hash: {u.password_hash}")
    except Exception as e:
        print("FAILED!")
        traceback.print_exc()
