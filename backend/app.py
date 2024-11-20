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

        type = Type.query.filter_by(name_fr=type).first()
        genre = Genre.query.filter_by(name=genre).first()
        family = Family.query.filter_by(name=family).first()
        functional_group = FunctionalGroup.query.filter_by(group=functional_group).first()
        existing_location = Location.query.filter_by(latitude=latitude, longitude=longitude).first()
        if not existing_location:
            existing_location = Location(latitude=latitude, longitude=longitude)
            db.session.add(existing_location)
            db.session.flush()
            existing_location = Location.query.filter_by(latitude=latitude, longitude=longitude).first()

        new_tree = Tree(
            date_plantation=date_plantation,
            date_measure=date_releve,
            approbation_status="pending",
            location=existing_location,
            details_url=details_url,
            image_url=image_url,
            type=type,
            genre=genre,
            family=family,
            functional_group=functional_group,
            commentaires_rejet=None,
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

    @app.route('/api/genre', methods=['GET'])
    def get_genres():
        genres = Genre.query.all()
        return jsonify([genre.to_dict() for genre in genres])

    @app.route('/api/family', methods=['GET'])
    def get_families():
        families = Family.query.all()
        return jsonify([family.to_dict() for family in families])

    @app.route('/api/type', methods=['GET'])
    def get_types():
        types = Type.query.all()
        return jsonify([type.to_dict() for type in types])

    @app.route('/api/fetch_type', methods=['GET'])
    def fetch_type_details():
        type_fr = request.get_json().get('type')
        type_obj = Type.query.filter_by(name_fr=type_fr).first()
        return jsonify({
            'name_en': type_obj.name_en,
            'name_la': type_obj.name_la
        })

    @app.route('/api/functional_group', methods=['GET'])
    def get_functional_groups():
        functional_groups = FunctionalGroup.query.all()
        return jsonify([functional_group.to_dict() for functional_group in functional_groups])

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

    @app.route('/api/arbre_rejet', methods=['GET'])
    def arbre_rejet():
        trees = Tree.query.filter_by(approbation_status="rejected").all()
        return jsonify([tree.to_dict() for tree in trees]), 200

    @app.route('/api/delete_tree/<int:id_tree>', methods=['POST'])
    def delete_tree(id_tree):
        tree = Tree.query.filter_by(id_tree=id_tree).first()

        if tree is None:
            abort(400, description="message:Arbre non-trouvable")

        db.session.delete(tree)
        db.session.commit()
        return jsonify({"message": "Arbre supprimé"}), 200

    @app.route('/api/modifier_arbre/<int:id_tree>', methods=['POST'])
    def modifier_arbre(id_tree):
        try:
            info = request.get_json()
            print(f"Demande reçue pour modifier l'arbre avec le numéro d'emplacement : {id_tree}")

            tree = Tree.query.filter_by(id_tree=id_tree).first()
            if not tree:
                print(f"Arbre avec l'ID {id_tree} introuvable.")
                return jsonify({"message": "Arbre introuvable"}), 404

            date_releve = info.get('date_releve', tree.date_releve)
            if not date_releve:
                abort(400, description="La date de relevé est requise.")
            else:
                try:
                    date_releve = datetime.strptime(tree.date_releve, '%Y-%m-%d').date()
                except ValueError:
                    abort(400, description="Le format de la date de relevé est invalide. Utilisez YYYY-MM-DD.")

            if 'dhp' in info:
                try:
                    tree.dhp = int(info.get ('dhp', tree('dhp')))
                except ValueError:
                    abort(400, description="Le champ 'dhp' doit être un entier.")

            approbation_status = info.get('approbation_status', tree.approbation_status)

            if approbation_status not in ['approved', 'rejected']:
                abort(400, description="Le champ 'approbation_status' doit être 'approved' ou 'rejected'.")
            tree.approbation_status = approbation_status

            # Mise à jour des attributs spécifiques si l'arbre est de type TreeRue
            tree.genre.name = info.get('genre', tree.genre.name)
            tree.functional_group.group = info.get('functional_group', tree.functional_group.group)
            tree.type.name_fr = info.get('type', tree.type.name_fr)
            tree.family.name = info.get('family', tree.family.name)

            db.session.commit()
            print(f"Arbre avec le numéro d'emplacement {id_tree} et les informations associées mises à jour avec succès.")

            return jsonify(tree.to_dict()), 200

        except Exception as e:
            print(f"Erreur lors de la modification de l'arbre : {str(e)}")
            db.session.rollback()
            return jsonify({"message": "Une erreur s'est produite lors de la modification de l'arbre"}), 500

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