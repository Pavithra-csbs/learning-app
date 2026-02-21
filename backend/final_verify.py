from app import create_app, db
import sqlalchemy as sa
import os

app = create_app()
with app.app_context():
    insp = sa.inspect(db.engine)
    tables = insp.get_table_names()
    with open('final_verify.txt', 'w') as f:
        f.write(f"Tables found: {', '.join(tables)}\n")
        if 'user' in tables:
            f.write("PASS: 'user' table exists.\n")
        else:
            f.write("FAIL: 'user' table MISSING!\n")
