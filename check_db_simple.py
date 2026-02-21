import sqlite3
import os

db_path = 'backend/instance/app.db' # Flask-SQLAlchemy usually puts it here or in root
if not os.path.exists(db_path):
    db_path = 'backend/app.db'

print(f"Checking DB: {db_path}")
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print("Tables:", cursor.fetchall())
    conn.close()
else:
    print("DB file not found!")
