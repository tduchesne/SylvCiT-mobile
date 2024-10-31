from app import db
from models.family import Family
from models.genre import Genre
from models.location import Location
from models.type import Type
from models.functional_group import FunctionalGroup

class Tree(db.Model):
    __tablename__ = 'tree'

    id_tree = db.Column(db.Integer, primary_key=True)
    no_emp = db.Column(db.Integer, nullable=True, unique=True)
    adresse = db.Column(db.String(45), nullable=True)
    dhp = db.Column(db.Integer, nullable=True)
    date_plantation = db.Column(db.Date, nullable=True)
    date_measure = db.Column(db.Date, nullable=False)
    is_valid = db.Column(db.Boolean, nullable=False)

    id_family = db.Column(db.Integer, db.ForeignKey('family.id_family'), nullable=True)
    id_genre = db.Column(db.Integer, db.ForeignKey('genre.id_genre'), nullable=True)
    id_location = db.Column(db.Integer, db.ForeignKey('location.id_location'), nullable=True)
    id_type = db.Column(db.Integer, db.ForeignKey('type.id_type'), nullable=True)
    id_functional_group = db.Column(db.Integer, db.ForeignKey('functional_group.id_functional_group'), nullable=True)

    family = db.relationship('Family', back_populates='trees')
    genre = db.relationship('Genre', back_populates='trees')
    location = db.relationship('Location', back_populates='tree')
    type = db.relationship('Type', back_populates='tree')
    functional_group = db.relationship('FunctionalGroup', back_populates='tree')

    def to_dict(self):
        return {
            'id_tree': self.id_tree,
            'no_emp': self.no_emp,
            'adresse': self.adresse,
            'dhp': self.dhp,
            'date_plantation': self.date_plantation.isoformat(),
            'date_measure': self.date_measure.isoformat(),
            'family': self.family.to_dict() if self.family else None,
            'genre': self.genre.to_dict() if self.genre else None,
            'location': self.location.to_dict() if self.location else None,
            'type': self.type.to_dict() if self.type else None,
            'functional_group': self.functional_group.to_dict() if self.functional_group else None
        }

Family.trees = db.relationship('Tree', back_populates='family')
Genre.trees = db.relationship('Tree', back_populates='genre')
Location.tree = db.relationship('Tree', back_populates='location')
Type.tree = db.relationship('Tree', back_populates='type')
FunctionalGroup.tree = db.relationship('Tree', back_populates='functional_group')
