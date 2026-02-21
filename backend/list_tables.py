from app import create_app, db
import sqlalchemy as sa

app = create_app()
with app.app_context():
    insp = sa.inspect(db.engine)
    tables = insp.get_table_names()
    print('ALL TABLES:', tables)
    for table in tables:
        cols = [c['name'] for c in insp.get_columns(table)]
        print(f'Table `{table}` columns:', cols)
