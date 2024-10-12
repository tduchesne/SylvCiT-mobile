from app import db
from sqlalchemy import Enum


class AddTree(db.Model):
    __tablename__ = 'add_tree'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)

    no_emp = db.Column(db.Integer, nullable=False)
    no_civique = db.Column(db.Integer, nullable=False)
    nom_rue = db.Column(db.String(45), nullable=False)
    cote = db.Column(Enum('N', 'S', 'E', 'O'), nullable=True)
    essence_latin = db.Column(db.String(45), nullable=False)
    essence_ang = db.Column(db.String(45), nullable=False)
    essence_fr = db.Column(db.String(45), nullable=False)

    dhp = db.Column(db.Integer, nullable=False)

    date_plantation = db.Column(db.Date, nullable=False)
    date_releve = db.Column(db.Date, nullable=False)

    latitude = db.Column(db.Numeric(11,8), nullable=False)
    longitude = db.Column(db.Numeric(11,8), nullable=False)


    # __table_args__ = (
    #     db.UniqueConstraint('latitude', 'longitude', name='unique_location'),
    # )