import math
from datetime import datetime
from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import MetaData, or_

import os


db = SQLAlchemy()
migrate = Migrate()

def create_app(config_name=None):
    app = Flask(__name__)

    # Configuration de la base de données sqlite pour les tests
    if config_name == 'testing':
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    else:
        # Database configuration
        app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DATABASE')}"
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['TESTING'] = config_name == 'testing'

    # Initialize db
    metadata = MetaData(schema=os.getenv('MYSQL_DATABASE'))
    db.init_app(app)

    # Initialize Flask-Migrate
    migrate.init_app(app, db)

    # Error handler to send json response
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'description': error.description}), 400

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'description': error.description}), 500
    
    # Import models after db initialization
    from models import Tree, Family, FunctionalGroup, Genre, Location, Type


    @app.before_request
    def create_tables():
        db.create_all()

    # Routes
    @app.route('/')
    def hello_world():
        return  'Hi mom!'

    @app.route('/api/trees', methods=['GET'])
    def get_trees():
        trees = Tree.query.all()
        return jsonify([tree.to_dict() for tree in trees])

    @app.route('/api/add_tree', methods=['POST'])
    def add_tree():
        info = request.get_json()


        latitude = info.get('latitude')
        longitude = info.get('longitude')
        date_releve = info.get('date_releve')

        # Validation des coordonnees gps
        if not (-90 <= float(latitude) <= 90):
            abort(400, description="Latitude invalide.")
        if not (-180 <= float(longitude) <= 180):
            abort(400, description="Longitude invalide.")

        # validation de la date
        if not date_releve:
            abort(400, description="La date de relevé est requise.")
        else:
            try:
                date_releve = datetime.strptime(date_releve, '%Y-%m-%d').date()
            except ValueError:
                abort(400, description="Le format de la date de relevé est invalide. Utilisez YYYY-MM-DD.")

        date_plantation = info.get('date_plantation')
        if date_plantation == "":
            date_plantation = None
        else :
            try:
                date_plantation = datetime.strptime(date_plantation, '%Y-%m-%d').date()
            except ValueError:
                abort(400, description="Le format de la date de plantation est invalide. Utilisez YYYY-MM-DD.")

        details_url=info.get('details_url')
        image_url=info.get('image_url')
        type=info.get('type')
        genre=info.get('genre')
        family=info.get('family')
        functional_group=info.get('functional_group')



        dhp = info.get('dhp')
        if dhp == "" :
            dhp = None
        else:
            try:
                dhp = int(dhp)
            except ValueError:
                abort(400, description="Le champ 'dhp' doit être un entier.")

        date_plantation = info.get('date_plantation')
        if date_plantation == "":
            date_plantation = None
        else :
            try:
                date_plantation = datetime.strptime(date_plantation, '%Y-%m-%d').date()
            except ValueError:
                abort(400, description="Le format de la date de plantation est invalide. Utilisez YYYY-MM-DD.")

        new_tree = Tree(
            date_plantation=date_plantation,
            date_measure=date_releve,
            approbation_status="pending",
            location=Location(latitude=latitude, longitude=longitude),
            details_url=details_url,
            image_url=image_url,
            type=Type(name_fr=type),
            genre=Genre(name=genre),
            family=Family(name=family),
            functional_group=FunctionalGroup(group=functional_group),
            commenaires_rejet=None,
            dhp=dhp
        )

        try:
            db.session.add(new_tree)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(e)
            abort(500, description="Erreur lors de l'ajout de l'arbre.")

        return jsonify(new_tree.to_dict()), 201


    @app.route('/api/coord_tree/', methods=['GET'])
    def coord_tree():
        latitude = request.get_json().get('latitude')
        longitude = request.get_json().get('longitude')
        if latitude is None or longitude is None:
            abort(400, description="Latitude ou longitude manquante")

        # Validation des coordonnees gps
        if not (-90 <= float(latitude) <= 90):
            abort(400, description="Latitude invalide.")
        if not (-180 <= float(longitude) <= 180):
            abort(400, description="Longitude invalide.")

        trees = Tree.query.all()
        trees_proches = trees_with_short_dist(trees, latitude, longitude)
        return jsonify([tree[0].to_dict() for tree in trees_proches]), 200

    def trees_with_short_dist(trees, latitude, longitude):
        distances = []
        for tree in trees:
            if tree.location and tree.approbation_status == "approved":
                tree_latitude = float(tree.location.latitude)
                tree_longitude = float(tree.location.longitude)
                distance = math.dist([latitude, longitude], [tree_latitude, tree_longitude])
                distances.append((tree, distance))
        distances.sort(key=lambda x: x[1])
        return distances[:3]
    #
    @app.route('/api/demande_suppression/<int:id_tree>', methods=['POST'])
    def demande_suppression_arbre(id_tree):
        tree = Tree.query.filter_by(id_tree=id_tree).first()
        if tree is None:
            abort(400, description="message: Arbre non-trouvable")
        elif Tree.query.filter_by(id_tree=id_tree, approbation_status="rejected").first() is not None:
            abort(400, description="message : Demande déja envoyée")

        tree.approbation_status = "rejected"
        db.session.commit()

        return jsonify({"message": "Demande envoyée"}), 200

    @app.route('/api/delete_tree/<int:id_tree>', methods=['POST'])
    def delete_tree(id_tree):
        tree = Tree.query.filter_by(id_tree=id_tree).first()

        if tree is None:
            abort(400, description="message:Arbre non-trouvable")

        db.session.delete(tree)
        db.session.commit()
        return jsonify({"message": "Arbre supprimé"}), 200
    #
    # @app.route('/api/modifier_arbre/<int:no_emp>', methods=['POST'])
    # def modifier_arbre(no_emp):
    #     try:
    #         info = request.get_json()
    #         print(f"Demande reçue pour modifier l'arbre avec le numéro d'emplacement : {no_emp}")
    #
    #         tree = Tree.query.filter_by(no_emp=no_emp).first()
    #         if not tree:
    #             print(f"Arbre avec l'ID {no_emp} introuvable.")
    #             return jsonify({"message": "Arbre introuvable"}), 404
    #
    #         # Validation des attributs et conversion des dates
    #         if 'emplacement' in info:
    #             tree.emplacement = info['emplacement']
    #
    #         if 'dhp' in info:
    #             try:
    #                 tree.dhp = int(info['dhp'])
    #             except ValueError:
    #                 abort(400, description="Le champ 'dhp' doit être un entier.")
    #
    #         if 'date_measure' in info:
    #             try:
    #                 tree.date_measure = datetime.strptime(info['date_measure'], '%Y-%m-%d').date()
    #             except ValueError:
    #                 abort(400, description="Le format de 'date_measure' est invalide. Utilisez YYYY-MM-DD.")
    #
    #         if 'date_plantation' in info:
    #             try:
    #                 tree.date_plantation = datetime.strptime(info['date_plantation'], '%Y-%m-%d').date()
    #             except ValueError:
    #                 abort(400, description="Le format de 'date_plantation' est invalide. Utilisez YYYY-MM-DD.")
    #
    #         if 'latitude' in info:
    #             try:
    #                 tree.latitude = float(info['latitude'])
    #             except (ValueError, TypeError):
    #                 abort(400, description="Le champ 'latitude' doit être un nombre.")
    #
    #         if 'longitude' in info:
    #             try:
    #                 tree.longitude = float(info['longitude'])
    #             except (ValueError, TypeError):
    #                 abort(400, description="Le champ 'longitude' doit être un nombre.")
    #
    #         if 'inv_type' in info:
    #             if info['inv_type'] not in ['R', 'H']:
    #                 abort(400, description="Le champ 'inv_type' doit être 'R' ou 'H'.")
    #             tree.inv_type = info['inv_type']
    #
    #         if 'is_valid' in info:
    #             tree.is_valid = bool(info['is_valid'])
    #
    #         # Mise à jour des attributs spécifiques si l'arbre est de type TreeRue
    #         if isinstance(tree, TreeRue):
    #             tree.adresse = info.get('adresse', tree.adresse)
    #             tree.localisation = info.get('localisation', tree.localisation)
    #             tree.localisation_code = info.get('localisation_code', tree.localisation_code)
    #             tree.rue_de = info.get('rue_de', tree.rue_de)
    #             tree.rue_a = info.get('rue_a', tree.rue_a)
    #             tree.distance_pave = info.get('distance_pave', tree.distance_pave)
    #             tree.distance_ligne_rue = info.get('distance_ligne_rue', tree.distance_ligne_rue)
    #             tree.stationnement_jour = info.get('stationnement_jour', tree.stationnement_jour)
    #             tree.stationnement_heure = info.get('stationnement_heure', tree.stationnement_heure)
    #             tree.district = info.get('district', tree.district)
    #             tree.arbre_remarquable = info.get('arbre_remarquable', tree.arbre_remarquable)
    #
    #         db.session.commit()
    #         print(f"Arbre avec le numéro d'emplacement {no_emp} et les informations associées mises à jour avec succès.")
    #
    #         return jsonify(tree.to_dict()), 200
    #
    #     except Exception as e:
    #         print(f"Erreur lors de la modification de l'arbre : {str(e)}")
    #         db.session.rollback()
    #         return jsonify({"message": "Une erreur s'est produite lors de la modification de l'arbre"}), 500
    #
    return app


def isfloat(value):
    try:
        float(value)
        return True
    except ValueError:
        return False


if __name__== '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0')