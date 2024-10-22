from app import db

class Location(db.Model):
    __tablename__ = 'location'

    id_location = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.String(45), nullable=False)
    longitude = db.Column(db.String(45), nullable=False)

    tree = db.relationship('Tree', back_populates='location')
