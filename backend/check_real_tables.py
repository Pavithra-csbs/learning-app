from app import create_app, db
import sqlalchemy as sa

app = create_app()
with app.app_context():
    result = db.session.execute(sa.text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
    tables = [row[0] for row in result]
    print("REAL TABLES IN DB:", tables)
