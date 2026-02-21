from app import create_app, db
from app.models.user import User

app = create_app()
with app.app_context():
    users = User.query.all()
    with open('users_data.txt', 'w') as f:
        for u in users:
            f.write(f"Email: {u.email}, Hash: {u.password_hash}\n")
