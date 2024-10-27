from app import db

class Family(db.Model):
    __tablename__ = 'family'

    id_family = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(45))

    trees = db.relationship('Tree', back_populates='family')

    def to_dict(self):
        return {
            'id_family': self.id_family,
            'name': self.name
        }
