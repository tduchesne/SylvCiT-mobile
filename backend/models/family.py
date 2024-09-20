from app import db

class Family(db.Model):
    __tablename__ = 'family'

    id_family = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(45))

    tree = db.relationship('Tree', back_populates='family')
