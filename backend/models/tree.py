from app import db

# Tree model
class Tree(db.Model):
    __tablename__ = 'Tree'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=True)
    type = db.Column(db.String(100), nullable=True)

    def __repr__(self):
        return f'<Tree {self.name}>'