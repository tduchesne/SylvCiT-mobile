from app import db
from sqlalchemy import Enum


class tree_search(db.Model):
    __tablename__ = 'tree_search'
    no_emp = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    arrondissement = db.Column(db.String(45), nullable=False)
    emplacement = db.Column(Enum("Banquette gazonnée",
                                 "Banquette Asphaltée",
                                 "Fond de trottoir",
                                 "Parc",
                                 "Parterre Gazonné",
                                 "Parterre Asphalté",
                                 "Parterre",
                                 "Terre plein",
                                 "Trottoir entre autres", name = "emplacement_tree"), nullable=False)
    essence_latin = db.Column(db.String(45), db.ForeignKey('nom_tree.essence_latin'), index = True, nullable=False)
    dhp = db.Column(db.Integer, nullable=False)
    date_releve = db.Column(db.Date, nullable=False)
    date_plantation = db.Column(db.Date, nullable=True)
    longitude = db.Column(db.Numeric(11,8), nullable=False)
    latitude = db.Column(db.Numeric(11,8), nullable=False)
    inv_type = db.Column(Enum('R', 'H', name = "inv_type_tree"), nullable=False)

    def to_dict(self):
        return {
            'no_emp': self.no_emp,
            'arrondissement': self.arrondissement,
            'emplacement': self.emplacement,
            'essence_latin': self.nom_tree.to_dict() if self.nom_tree else None,
            'dhp': self.dhp,
            'date_releve': self.date_releve,
            'date_plantation': self.date_plantation,
            'longitude': self.longitude,
            'latitude': self.latitude,
            'inv_type': self.inv_type
        }

    __mapper_args__ = {
        "polymorphic_on": inv_type,
        "polymorphic_identity": "tree_search"
    }

    nom_tree = db.relationship('nom_tree', backref='tree_search')

class tree_rue(tree_search):
    __tablename__ = 'tree_rue'
    no_emp = db.Column(db.Integer, db.ForeignKey('tree_search.no_emp'), primary_key=True, nullable=False)
    no_civique = db.Column(db.Integer, nullable=False)
    no_rue = db.Column(db.Integer, nullable=False)
    nom_rue = db.Column(db.String(45), nullable=False)
    cote = db.Column(Enum('N', 'S', 'E', 'O'), nullable=False)
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
            'no_rue': self.no_rue,
            'nom_rue': self.nom_rue,
            'cote': self.cote,
            'localisation': self.localisation,
            'rue_de': self.rue_de,
            'rue_a': self.rue_a,
            'distance_pave': self.distance_pave,
            'distance_ligne_rue': self.distance_ligne_rue,
            'stationnement_heure': self.stationnement_heure
        })
        return attributes

    __mapper_args__ = {
        "polymorphic_identity": "R"
    }

class tree_hors_rue(tree_search):
    __tablename__ = 'tree_hors_rue'
    no_emp = db.Column(db.Integer, db.ForeignKey('tree_search.no_emp'), primary_key=True, nullable=False)
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

class nom_tree(db.Model):
    __tablename__ = 'nom_tree'
    essence_latin = db.Column(db.String(45), primary_key=True,nullable=False)
    sigle = db.Column(db.String(45), nullable=False)
    essence_fr = db.Column(db.String(45), nullable=False)
    essence_en = db.Column(db.String(45), nullable=False)

    def to_dict(self):
        return {
            'essence_latin': self.essence_latin,
            'sigle': self.sigle,
            'essence_fr': self.essence_fr,
            'essence_en': self.essence_en
        }
