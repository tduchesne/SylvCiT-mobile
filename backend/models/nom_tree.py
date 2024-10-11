from app import db

class nom_tree(db.Model):
    __tablename__ = 'nom_tree'
    essence_latin = db.Column(db.String(45), primary_key=True, nullable=False)
    sigle = db.Column(db.String(45), nullable=False)
    essence_fr = db.Column(db.String(45), nullable=False)
    essence_en = db.Column(db.String(45), nullable=False)

    tree_search = db.relationship('tree_search', back_populates='nom_tree')
    tree_rue = db.relationship('tree_rue', back_populates='nom_tree')
    tree_hors_rue = db.relationship('tree_hors_rue', back_populates='nom_tree')