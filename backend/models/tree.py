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
        db.Index('fk_tree_type_idx', 'id_type'),
    )

    id_tree = db.Column(db.Integer, primary_key=True)
    no_emp = db.Column(db.Integer,nullable=False, unique=True)
    adresse = db.Column(db.String(45), nullable=True)
    arrondissement = db.Column(db.String(45), nullable=True)
    emplacement = db.Column(db.Enum("Banquette gazonnée",
                                 "Banquette Asphaltée",
                                 "Fond de trottoir",
                                 "Parc",
                                 "Parterre Gazonné",
                                 "Parterre Asphalté",
                                 "Parterre bÉtonné",
                                 "Terre plein",
                                 "Trottoir entre autres", name = "emplacement_tree", native_enum=False), nullable=True)
    details_url = db.Column(db.String(150), nullable=True)
    dhp = db.Column(db.Integer, nullable=True)
    date_plantation = db.Column(db.Date, nullable=True)
    date_measure = db.Column(db.Date, nullable=False)
    inv_type = db.Column(db.Enum('R', 'H', name="inv_type_tree"), nullable=False)
    is_valid = db.Column(db.Boolean, nullable=False)

    id_family = db.Column(db.Integer, db.ForeignKey('family.id_family'), nullable=True)
    id_genre = db.Column(db.Integer, db.ForeignKey('genre.id_genre'), nullable=True)
    id_location = db.Column(db.Integer, db.ForeignKey('location.id_location'), nullable=True)
    id_type = db.Column(db.Integer, db.ForeignKey('type.id_type'), nullable=True)
    id_functional_group = db.Column(db.Integer, db.ForeignKey('functional_group.id_functional_group'), nullable=True)

    family = db.relationship('Family', back_populates='trees')
    genre = db.relationship('Genre', back_populates='trees')
    location = db.relationship('Location', back_populates='trees')
    type = db.relationship('Type', back_populates='trees')
    functional_group = db.relationship('FunctionalGroup', back_populates='trees')

    def to_dict(self):
        return {
            'id_tree': self.id_tree,
            'arrondissement': self.arrondissement,
            'details_url': self.details_url,
            'inv_type': self.inv_type,
            'emplacement': self.emplacement,
            'no_emp': self.no_emp,
            'adresse': self.adresse,
            'dhp': self.dhp,
            'date_plantation': self.date_plantation.isoformat(),
            'date_measure': self.date_measure.isoformat(),
            'family': self.family.to_dict() if self.family else None,
            'genre': self.genre.to_dict() if self.genre else None,
            'location': self.location.to_dict() if self.location else None,
            'type': self.type.to_dict() if self.type else None,
            'functional_group': self.functional_group.to_dict() if self.functional_group else None,
            "is_valid": self.is_valid
        }

    __mapper_args__ = {
        "polymorphic_on": inv_type,
        "polymorphic_identity": "Tree"
    }

class tree_rue(Tree):
    __tablename__ = 'tree_rue'
    id_tree = db.Column(db.Integer, db.ForeignKey('tree.id_tree'), primary_key=True, nullable=False)
    no_civique = db.Column(db.Integer, nullable=False)
    nom_rue = db.Column(db.String(45), nullable=False)
    cote = db.Column(db.Enum('N', 'S', 'E', 'O'), nullable=True)
    localisation = db.Column(db.String(45), nullable=False)
    rue_de= db.Column(db.String(45), nullable=False)
    rue_a = db.Column(db.String(45), nullable=False)
    distance_pave = db.Column(db.Float, nullable=False)
    distance_ligne_rue = db.Column(db.Float, nullable=False)
    stationnement_heure = db.Column(db.Time, nullable=False)

    def to_dict(self):
        attributes = super().to_dict()
        attributes.update({
            'no_civique': self.no_civique,
            'nom_rue': self.nom_rue,
            'cote': self.cote,
            'localisation': self.localisation,
            'rue_de': self.rue_de,
            'rue_a': self.rue_a,
            'distance_pave': self.distance_pave,
            'distance_ligne_rue': self.distance_ligne_rue,
            'stationnement_heure': self.stationnement_heure.strftime('%H:%M:%S')
        })
        return attributes

    __mapper_args__ = {
        "polymorphic_identity": "R"
    }

class tree_hors_rue(Tree):
    __tablename__ = 'tree_hors_rue'
    id_tree = db.Column(db.Integer, db.ForeignKey('tree.id_tree'), primary_key=True, nullable=False)
    nom_parc = db.Column(db.String(45), nullable=False)
    nom_secteur = db.Column(db.String(45), nullable=False)

    def to_dict(self):
        attributes = super().to_dict()
        attributes.update({
            'nom_parc': self.nom_parc,
            'nom_secteur': self.nom_secteur
        })
        return attributes

    __mapper_args__ = {
        "polymorphic_identity": "H"
    }