from app import db

# Tree model
class Tree(db.Model):
    __tablename__ = 'tree'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    leaf = db.Column(db.String(80), nullable=False)
    age = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Tree {self.name}>'