from app import db

class Type(db.Model):
    __tablename__ = 'type'

    id_type = db.Column(db.Integer, primary_key=True)
    name_fr = db.Column(db.String(100))
    name_en = db.Column(db.String(100))
    name_la = db.Column(db.String(100))

    tree = db.relationship('Tree', back_populates='type')
