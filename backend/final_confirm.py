from app import create_app, db
from app.models.user import User
import os

app = create_app()
with app.app_context():
    try:
        count = User.query.count()
        print(f"SUCCESS: Found {count} users in User model table.")
    except Exception as e:
        print(f"FAILED: Could not query User model. Error: {e}")
