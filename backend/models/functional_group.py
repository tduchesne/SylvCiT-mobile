from app import db

class FunctionalGroup(db.Model):
    __tablename__ = 'functional_group'

    id_functional_group = db.Column(db.Integer, primary_key=True)
    group = db.Column(db.String(2))
    description = db.Column(db.String(250))

    def to_dict(self):
        return {
            'id_functional_group': self.id_functional_group,
            'group': self.group,
            'description': self.description
        }
