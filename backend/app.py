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
    
    @app.route('/api/trees_pending_deletion', methods=['GET'])
    def get_trees_pending_deletion():
        deletion_requests = ListDelete.query.all()
        trees = [Tree.query.filter_by(no_emp=req.no_emp).first() for req in deletion_requests]
        trees = [tree.to_dict() for tree in trees if tree]
        return jsonify(trees)
    
    @app.route('/api/refuse_deletion/<int:id_tree>', methods=['POST'])
    def refuse_deletion(id_tree):
        tree = Tree.query.filter_by(id_tree=id_tree, approbation_status='rejected').first()

        if tree is None:
            abort(400, description="Aucune demande de suppression trouvée pour cet arbre")

        tree.approbation_status = 'approved'
        db.session.commit()
        return jsonify({"message": "Demande de suppression refusée"}), 200
    
    @app.route('/api/approve_deletion/<int:id_tree>', methods=['POST'])
    def approve_deletion(id_tree):
        tree = Tree.query.filter_by(id_tree=id_tree, approbation_status='rejected').first()

        if tree is None:
            abort(400, description="Aucune demande de suppression trouvée pour cet arbre")

        try:
            db.session.delete(tree)
            db.session.commit()
            return jsonify({"message": "Arbre supprimé avec succès"}), 200
        except Exception as e:
            print(f"Erreur lors de la suppression de l'arbre {id_tree}: {e}")
            db.session.rollback()
            return jsonify({"message": "Erreur lors de la suppression de l'arbre"}), 500

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
    
    @app.route('/api/demande_suppression/<int:id_tree>', methods=['POST'])
    def demande_suppression_arbre(id_tree):
        tree = Tree.query.filter_by(id_tree=id_tree).first()
        if tree is None:
            abort(400, description="Arbre non trouvable")
        elif tree.approbation_status == "rejected":
            abort(400, description="Demande déjà envoyée")

        tree.approbation_status = "rejected"
        db.session.commit()

        return jsonify({"message": "Demande de suppression envoyée"}), 200

    @app.route('/api/arbre_rejet', methods=['GET'])
    def arbre_rejet():
        trees = Tree.query.filter_by(approbation_status="rejected").all()
        return jsonify([tree.to_dict() for tree in trees]), 200


    @app.route('/api/delete_tree/<int:id_tree>', methods=['POST'])
    def delete_tree(id_tree):
        tree = Tree.query.filter_by(id_tree=id_tree, approbation_status='rejected').first()

        if not tree:
            abort(400, description="Aucune demande de suppression trouvée ou l'arbre n'existe pas")

        try:
            db.session.delete(tree)
            db.session.commit()
            return jsonify({"message": "Arbre supprimé avec succès"}), 200
        except Exception as e:
            print(f"Erreur lors de la suppression de l'arbre {id_tree}: {e}")
            db.session.rollback()
            return jsonify({"message": "Erreur lors de la suppression de l'arbre"}), 500


    @app.route('/api/modifier_arbre/<int:id_tree>', methods=['POST'])
    def modifier_arbre(id_tree):
        try:
            info = request.get_json()
            print(f"Demande reçue pour modifier l'arbre avec l'ID : {id_tree}")
            print(f"Payload reçu : {info}")

            tree = Tree.query.filter_by(id_tree=id_tree).first()
            if not tree:
                return jsonify({"message": "Arbre introuvable"}), 404

            dhp = info.get('dhp')
            if dhp is not None:
                try:
                    tree.dhp = int(dhp)
                except ValueError:
                    return jsonify({"message": "Le champ 'dhp' doit être un entier."}), 400

            tree.details_url = info.get('details_url', tree.details_url)
            tree.image_url = info.get('image_url', tree.image_url)

            if 'location' in info:
                loc_info = info['location']
                latitude = loc_info.get('latitude')
                longitude = loc_info.get('longitude')

                if latitude and longitude:
                    location = Location.query.filter_by(latitude=latitude, longitude=longitude).first()
                    if not location:
                        location = Location(latitude=latitude, longitude=longitude)
                        db.session.add(location)
                        db.session.flush()
                    tree.location = location

            date_measure = info.get('date_measure')
            if date_measure:
                try:
                    tree.date_measure = datetime.strptime(date_measure, '%Y-%m-%d').date()
                except ValueError:
                    return jsonify({"message": "Le format de la date relevé est invalide. Utilisez YYYY-MM-DD."}), 400

            date_plantation = info.get('date_plantation')
            if date_plantation:
                try:
                    tree.date_plantation = datetime.strptime(date_plantation, '%Y-%m-%d').date()
                except ValueError:
                    return jsonify({"message": "Le format de la date de plantation est invalide. Utilisez YYYY-MM-DD."}), 400
            else:
                tree.date_plantation = None

            if 'type' in info and info['type']:
                type_info = info['type']
                type_name_fr = type_info.get('name_fr')
                if type_name_fr:
                    type_obj = Type.query.filter_by(name_fr=type_name_fr).first()
                    if not type_obj:
                        type_obj = Type(
                            name_fr=type_name_fr,
                            name_en=type_info.get('name_en', ''),
                            name_la=type_info.get('name_la', '')
                        )
                        db.session.add(type_obj)
                        db.session.flush()
                    tree.type = type_obj

            if 'family' in info and info['family']:
                family_info = info['family']
                family_name = family_info.get('name')
                if family_name:
                    family_obj = Family.query.filter_by(name=family_name).first()
                    if not family_obj:
                        family_obj = Family(name=family_name)
                        db.session.add(family_obj)
                        db.session.flush()
                    tree.family = family_obj

            if 'genre' in info and info['genre']:
                genre_info = info['genre']
                genre_name = genre_info.get('name')
                if genre_name:
                    genre_obj = Genre.query.filter_by(name=genre_name).first()
                    if not genre_obj:
                        genre_obj = Genre(name=genre_name)
                        db.session.add(genre_obj)
                        db.session.flush()
                    tree.genre = genre_obj

            if 'functional_group' in info and info['functional_group']:
                fg_info = info['functional_group']
                group_name = fg_info.get('group')
                if group_name:
                    fg_obj = FunctionalGroup.query.filter_by(group=group_name).first()
                    if not fg_obj:
                        fg_obj = FunctionalGroup(group=group_name, description=fg_info.get('description', ''))
                        db.session.add(fg_obj)
                        db.session.flush()
                    tree.functional_group = fg_obj

            db.session.commit()
            return jsonify({"message": "Arbre modifié avec succès"}), 200
        except Exception as e:
            print(f"Erreur lors de la modification de l'arbre : {e}")
            db.session.rollback()
            return jsonify({"message": "Erreur interne du serveur"}), 500


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