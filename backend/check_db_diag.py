import os
from dotenv import load_dotenv
from app import create_app, db
import sqlalchemy as sa

load_dotenv()

app = create_app()
with app.app_context():
    uri = app.config.get('SQLALCHEMY_DATABASE_URI')
    print(f"DEBUG: SQLALCHEMY_DATABASE_URI used by app: {uri}")
    
    try:
        engine = db.engine
        print(f"DEBUG: Connected to engine: {engine.url}")
        
        insp = sa.inspect(engine)
        tables = insp.get_table_names()
        print(f"DEBUG: Tables found in this connection: {tables}")
        
        if not tables:
            print("DEBUG: No tables found. Attempting to check if we are in the right database.")
            # Check current database name from the connection
            res = db.session.execute(sa.text("SELECT current_database();"))
            db_name = res.scalar()
            print(f"DEBUG: Database reported by PostgreSQL: {db_name}")

    except Exception as e:
        print(f"DEBUG: Connection ERROR: {e}")
