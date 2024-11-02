from app import db

class Parc(db.Model):
    __tablename__ = 'parc'
    code_parc = db.Column(db.String(10), primary_key=True)
    nom_parc = db.Column(db.String(45), nullable=False)
    trees = db.relationship('TreeHorsRue', back_populates='parc')

    def to_dict(self):
        return {
            'code_parc': self.code_parc,
            'nom_parc': self.nom_parc
        }
