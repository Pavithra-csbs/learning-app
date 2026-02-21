from app import create_app, db
import sqlalchemy as sa

app = create_app()
with app.app_context():
    insp = sa.inspect(db.engine)
    cols = insp.get_columns('users')
    print("COLUMNS IN 'users' TABLE:", [c['name'] for c in cols])
