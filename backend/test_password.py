from app import create_app, db
from app.models.user import User
import uuid

app = create_app()
email = f"test_{uuid.uuid4().hex[:6]}@example.com"
password = "testpassword123"

with app.app_context():
    print(f"Creating user: {email}")
    user = User(name="Test User", email=email, role='student')
    user.set_password(password)
    print(f"Password hash after set_password: {user.password_hash}")
    
    if user.password_hash is None:
        print("ERROR: password_hash is None after set_password!")
    
    db.session.add(user)
    db.session.commit()
    print("User committed to database.")
    
    # Reload user
    db_user = User.query.filter_by(email=email).first()
    print(f"Reloaded user password hash: {db_user.password_hash}")
    
    if db_user.password_hash is None:
        print("ERROR: password_hash is None in DB after commit!")
    else:
        print("SUCCESS: password_hash is present in DB.")
        is_valid = db_user.check_password(password)
        print(f"check_password(correct): {is_valid}")
        is_invalid = db_user.check_password("wrongpassword")
        print(f"check_password(wrong): {is_invalid}")
