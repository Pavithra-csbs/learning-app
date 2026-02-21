from app import create_app, db
import sqlalchemy as sa

app = create_app()
with app.app_context():
    insp = sa.inspect(db.engine)
    tables = insp.get_table_names()
    print('ALL TABLES:', tables)
    print()
    for t in ['user', 'users', 'student_profile']:
        if t in tables:
            cols = insp.get_columns(t)
            print(f'Table `{t}` columns:', [c['name'] for c in cols])
    print()
    # Try a direct query
    try:
        result = db.session.execute(sa.text("SELECT id, name, email, role FROM \"user\" LIMIT 3"))
        print('user table rows:', result.fetchall())
    except Exception as e:
        print('ERROR querying user:', e)
    try:
        result = db.session.execute(sa.text("SELECT id, name, email, role FROM users LIMIT 3"))
        print('users table rows:', result.fetchall())
    except Exception as e:
        print('ERROR querying users:', e)
