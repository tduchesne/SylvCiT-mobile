from app import db

class Genre(db.Model):
    __tablename__ = 'genre'

    id_genre = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(45))

    tree = db.relationship('Tree', back_populates='genre')

    def to_dict(self):
        return {
            'id_genre': self.id_genre,
            'name': self.name
        }
