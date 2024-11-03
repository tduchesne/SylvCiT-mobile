from enum import unique

from app import db

class Tree(db.Model):
    __tablename__ = 'tree'
    __table_args__ = (
        db.ForeignKeyConstraint(['no_arrondissement'], ['arrondissement.no_arrondissement'], name='fk_tree_arrondissement'),
        db.ForeignKeyConstraint(['sigle'], ['essence.sigle'], name='fk_tree_sigle'),
        db.Index('fk_tree_arrondissement_idx', 'no_arrondissement'),
        db.Index('fk_tree_sigle_idx', 'sigle'),
        db.UniqueConstraint('latitude', 'longitude', name='unique_location')
    )
    id = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    no_emp = db.Column(db.Integer,nullable=False, unique=True)
    no_arrondissement = db.Column(db.Integer, db.ForeignKey('arrondissement.no_arrondissement'),nullable=True)
    emplacement = db.Column(db.Enum("banquette gazonnée",
                                 "banquette asphaltée",
                                 "fond de trottoir",
                                 "parc",
                                 "parterre gazonné",
                                 "parterre asphalté",
                                 "parterre bétonné",
                                 "terre plein",
                                 "trottoir entre autres", name = "emplacement_tree", native_enum=False), nullable=True)
    sigle = db.Column(db.String(10),db.ForeignKey('essence.sigle'), nullable=True)
    dhp = db.Column(db.Integer, nullable=True)
    date_measure = db.Column(db.Date, nullable=False)
    date_plantation = db.Column(db.Date, nullable=True)
    latitude = db.Column(db.Numeric(11,8), nullable=False)
    longitude = db.Column(db.Numeric(11,8), nullable=False)
    inv_type = db.Column(db.Enum('R', 'H', name="inv_type_tree"), nullable=False)
    is_valid = db.Column(db.Boolean, nullable=False)

    arrondissement = db.relationship('Arrondissement', back_populates='trees')
    essence = db.relationship('Essence', back_populates='trees')

    def to_dict(self):
        return {
            'no_emp': self.no_emp,
            'arrondissement': self.no_arrondissement,
            'emplacement': self.emplacement,
            'sigle': self.sigle,
            'dhp': self.dhp,
            'date_measure': self.date_measure.isoformat(),
            'date_plantation': self.date_plantation.isoformat(),
            'latitude': self.latitude,
            'longitude': self.longitude,
            'inv_type': self.inv_type,
            "is_valid": self.is_valid
        }

    __mapper_args__ = {
        "polymorphic_on": inv_type,
        "polymorphic_identity": "Tree"
    }

class TreeRue(Tree):
    __tablename__ = 'tree_rue'
    id = db.Column(db.Integer, db.ForeignKey('tree.id'), primary_key=True, unique=True, nullable=False)
    adresse = db.Column(db.String(45), nullable=True)
    localisation = db.Column(db.String(45), nullable=True)
    localisation_code = db.Column(db.String(10), nullable=True)
    rue_de = db.Column(db.String(45), nullable=True)
    rue_a = db.Column(db.String(45), nullable=True)
    distance_pave = db.Column(db.Float, nullable=True)
    distance_ligne_rue = db.Column(db.String(15), nullable=True)
    stationnement_jour = db.Column(db.String(10), nullable=True)
    stationnement_heure = db.Column(db.Time, nullable=True)
    district = db.Column(db.String(45), nullable=True)
    arbre_remarquable = db.Column(db.String(1), nullable=True)

    def to_dict(self):
        attributes = super().to_dict()
        attributes.update({
            'adresse': self.adresse,
            'localisation': self.localisation,
            'localisation_code': self.localisation_code,
            'rue_de': self.rue_de,
            'rue_a': self.rue_a,
            'distance_pave': self.distance_pave,
            'distance_ligne_rue': self.distance_ligne_rue,
            'stationnement_jour': self.stationnement_jour,
            'stationnement_heure': self.stationnement_heure.strftime('%H:%M:%S'),
            'district': self.district,
            'arbre_remarquable': self.arbre_remarquable
        })
        return attributes

    __mapper_args__ = {
        "polymorphic_identity": "R"
    }

class TreeHorsRue(Tree):
    __tablename__ = 'tree_hors_rue'
    __table_args__ = (
        db.ForeignKeyConstraint(['code_parc'], ['parc.code_parc'], name='fk_tree_parc'),
        db.ForeignKeyConstraint(['code_secteur'], ['secteur.code_secteur'], name='fk_tree_secteur'),
        db.Index('fk_tree_parc_idx', 'code_parc'),
        db.Index('fk_tree_secteur_idx', 'code_secteur')
    )
    id = db.Column(db.Integer, db.ForeignKey('tree.id'), primary_key=True, unique=True, nullable=False)
    code_parc = db.Column(db.String(10), db.ForeignKey('parc.code_parc'), nullable=True)
    code_secteur = db.Column(db.String(10), db.ForeignKey('secteur.code_secteur'), nullable=True)

    parc = db.relationship('Parc', back_populates='trees')
    secteur = db.relationship('Secteur', back_populates='trees')

    def to_dict(self):
        attributes = super().to_dict()
        attributes.update({
            'code_parc': self.code_parc,
            'code_secteur': self.code_secteur
        })
        return attributes

    __mapper_args__ = {
        "polymorphic_identity": "H"
    }
