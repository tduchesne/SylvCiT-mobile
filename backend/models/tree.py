from app import db

class Tree(db.Model):
    __tablename__ = 'tree'
    __table_args__ = (
        db.ForeignKeyConstraint(['id_family'], ['family.id_family'], name='fk_tree_family'),
        db.ForeignKeyConstraint(['id_functional_group'], ['functional_group.id_functional_group'], name='fk_tree_functional_group'),
        db.ForeignKeyConstraint(['id_genre'], ['genre.id_genre'], name='fk_tree_genre'),
        db.ForeignKeyConstraint(['id_location'], ['location.id_location'], name='fk_tree_id_location'),
        db.ForeignKeyConstraint(['id_type'], ['type.id_type'], name='fk_tree_type'),
        db.Index('fk_tree_family_idx', 'id_family'),
        db.Index('fk_tree_functional_group_idx', 'id_functional_group'),
        db.Index('fk_tree_genre_idx', 'id_genre'),
        db.Index('fk_tree_id_location_idx', 'id_location'),
        db.Index('fk_tree_type_idx', 'id_type')
    )

    id_tree = db.Column(db.Integer, primary_key=True)
    date_plantation = db.Column(db.Date, nullable=False)
    date_measure = db.Column(db.Date, nullable=False)
    details_url = db.Column(db.String(150))
    id_type = db.Column(db.Integer)
    id_genre = db.Column(db.Integer)
    id_family = db.Column(db.Integer)
    id_functional_group = db.Column(db.Integer)
    id_location = db.Column(db.Integer)

    approbation_status = db.Column(
        db.Enum("pending", "approved", name="approbation_status_enum"),
        default="pending",
        nullable=False
    )
    dhp = db.Column(db.Integer)

    family = db.relationship('Family', back_populates='tree')
    functional_group = db.relationship('FunctionalGroup', back_populates='tree')
    genre = db.relationship('Genre', back_populates='tree')
    location = db.relationship('Location', back_populates='tree')
    type = db.relationship('Type', back_populates='tree')
