from app import db

class Essence(db.Model):
    __tablename__ = 'essence'

    sigle = db.Column(db.String(10), primary_key=True,nullable=False, unique=True)
    la = db.Column(db.String(50), nullable=True, unique=True)
    en = db.Column(db.String(50), nullable=True, unique=True)
    fr = db.Column(db.String(50), nullable=True, unique=True)

    trees = db.relationship('Tree', back_populates='essence')

    def to_dict(self):
        return {
            'sigle': self.sigle,
            'la': self.la,
            'en': self.en,
            'fr': self.fr
        }
