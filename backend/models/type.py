from models import db

class Type(db.Model):
    __tablename__ = 'type'

    id_type = db.Column(db.Integer, primary_key=True)
    name_fr = db.Column(db.String(100))
    name_en = db.Column(db.String(100))
    name_la = db.Column(db.String(100))

    def to_dict(self):
        return {
            'id_type': self.id_type,
            'name_fr': self.name_fr,
            'name_en': self.name_en,
            'name_la': self.name_la
        }
