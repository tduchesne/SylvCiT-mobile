from app import db

class AddTree(db.Model):
    __tablename__ = 'add_tree'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    latitude = db.Column(db.Numeric(9,6), nullable=False)
    longitude = db.Column(db.Numeric(9,6), nullable=False)

    date_releve = db.Column(db.Date, nullable=False)

    # flask_app_history