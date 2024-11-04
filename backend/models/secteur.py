from app import db

class Secteur(db.Model):
    __tablename__ = 'secteur'
    code_secteur = db.Column(db.String(10), primary_key=True)
    nom_secteur = db.Column(db.String(45), nullable=True, unique=True)
    trees = db.relationship('TreeHorsRue', back_populates='secteur')

    def to_dict(self):
        return {
            'code_secteur': self.code_secteur,
            'nom_secteur': self.nom_secteur
        }
