from app import db

class Location(db.Model):
    __tablename__ = 'location'

    id_location = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Numeric(21,17), nullable=False)
    longitude = db.Column(db.Numeric(21,17), nullable=False)

    tree = db.relationship('Tree', back_populates='location')

    def to_dict(self):
        return {
            'id_location': self.id_location,
            'latitude': self.latitude,
            'longitude': self.longitude
        }