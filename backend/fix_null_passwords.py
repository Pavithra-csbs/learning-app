from app import create_app, db
from app.models.user import User

app = create_app()
default_password = "password123"

with app.app_context():
    users = User.query.filter(User.password_hash.is_(None)).all()
    if not users:
        print("No users found with null password hash.")
    else:
        for u in users:
            print(f"Setting default password for: {u.email}")
            u.set_password(default_password)
        
        db.session.commit()
        print(f"Successfully updated {len(users)} users. Default password is: {default_password}")
