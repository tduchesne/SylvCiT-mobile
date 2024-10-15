from models import db
from models.family import Family
from models.genre import Genre
from models.location import Location
from models.type import Type
from models.functional_group import FunctionalGroup

class Tree(db.Model):
    __tablename__ = 'tree'

    id_tree = db.Column(db.Integer, primary_key=True)
    date_plantation = db.Column(db.Date, nullable=False)
    date_measure = db.Column(db.Date, nullable=False)

    id_family = db.Column(db.Integer, db.ForeignKey('family.id_family'), nullable=False)
    id_genre = db.Column(db.Integer, db.ForeignKey('genre.id_genre'), nullable=False)
    id_location = db.Column(db.Integer, db.ForeignKey('location.id_location'), nullable=False)
    id_type = db.Column(db.Integer, db.ForeignKey('type.id_type'), nullable=False)
    id_functional_group = db.Column(db.Integer, db.ForeignKey('functional_group.id_functional_group'), nullable=False)

    family = db.relationship('Family', back_populates='trees')
    genre = db.relationship('Genre', back_populates='trees')
    location = db.relationship('Location', back_populates='tree')
    type = db.relationship('Type', back_populates='tree')
    functional_group = db.relationship('FunctionalGroup', back_populates='tree')

    def to_dict(self):
        return {
            'id_tree': self.id_tree,
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
