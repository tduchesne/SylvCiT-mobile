from app import db

class Arrondissement(db.Model):
    __tablename__ = 'arrondissement'

    no_arrondissement = db.Column(db.Integer, primary_key=True)
    nom_arrondissement = db.Column(db.String(45), nullable=False, unique=True)

    trees = db.relationship('Tree', back_populates='arrondissement')

    def to_dict(self):
        return {
            'no_arrondissement': self.no_arrondissement,
            'name': self.nom_arrondissement
        }
