import os
from dotenv import load_dotenv
from app import create_app, db
import sqlalchemy as sa

load_dotenv()

app = create_app()
with app.app_context():
    try:
        # 1. Get current database
        db_res = db.session.execute(sa.text("SELECT current_database();")).scalar()
        print(f"DATABASE: {db_res}")
        
        # 2. Get current user
        user_res = db.session.execute(sa.text("SELECT current_user;")).scalar()
        print(f"USER: {user_res}")

        # 3. List tables with their schemas
        insp = sa.inspect(db.engine)
        schemas = insp.get_schema_names()
        print(f"SCHEMAS: {schemas}")
        
        for schema in ['public', 'learning_platform']: # check common ones
            if schema in schemas:
                tables = insp.get_table_names(schema=schema)
                if tables:
                    print(f"TABLES in schema `{schema}`: {tables[:5]}... (total {len(tables)})")
                else:
                    print(f"TABLES in schema `{schema}`: NONE")

    except Exception as e:
        print(f"ERROR: {e}")
