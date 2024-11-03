from datetime import datetime
from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import MetaData, or_

import os

from sqlalchemy.orm import with_polymorphic

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
    from models import ListDelete, Tree, TreeRue, TreeHorsRue, Parc, Secteur, Arrondissement, Essence


    @app.before_request
    def create_tables():
        db.create_all()

    # Routes
    @app.route('/')
    def hello_world():
        print("Hello world")
        return  'Hi mom!'

    # @app.route('/api/trees', methods=['GET'])
    # def get_trees():
    #     trees = Tree.query.all()
    #     return jsonify(
    #         [{
    #             'id_tree': t.id_tree,
    #             'date_plantation': t.date_plantation,
    #             'id_family': t.id_family,
    #             'id_functional_group': t.id_functional_group,
    #             'id_genre': t.id_genre,
    #             'id_location': t.id_location,
    #             'id_type': t.id_type
    #             } for t in trees
    #         ])



    @app.route('/api/add_tree', methods=['POST'])
    def add_tree():
        info = request.get_json()

        try:
            no_emp = int(info.get('no_emp'))
            if Tree.query.filter_by(no_emp=no_emp).first() :
                abort(409, description="Arbre deja existant.")
        except ValueError:
            abort(400, description="Le numéro d'emplacement doit etre un entier.")

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

        try:
            date_releve = datetime.strptime(date_releve, '%Y-%m-%d').date()
        except ValueError:
            abort(400, description="Le format de la date de relevé est invalide. Utilisez YYYY-MM-DD.")

        no_arrondissement = info.get('no_arrondissement')
        emplacement = info.get('emplacement')
        sigle = info.get('sigle')
        dhp = info.get('dhp')
        if dhp == "":
            dhp = None
        else:
            try:
                dhp = int(dhp)
            except ValueError:
                abort(400, description="Le champ 'dhp' doit être un entier.")

        date_plantation = info.get('date_plantation')
        if date_plantation:
            try:
                date_plantation = datetime.strptime(date_plantation, '%Y-%m-%d').date()
            except ValueError:
                abort(400, description="Le format de la date de plantation est invalide. Utilisez YYYY-MM-DD.")

        inv_type = info.get('inv_type')
        if inv_type == "":
            inv_type = None
            abort(400, description="Le champ 'inv_type' est obligatoire.")
        elif inv_type not in ['R', 'H']:
            abort(400, description="Le champ 'inv_type' doit être 'R' ou 'H'.")

        if inv_type == 'R':
            new_tree = TreeRue(
                no_emp=no_emp,
                no_arrondissement=no_arrondissement,
                emplacement=emplacement,
                sigle=sigle,
                dhp=dhp,
                date_plantation=date_plantation,
                date_measure=date_releve,
                longitude=longitude,
                latitude=latitude,
                inv_type=inv_type,
                adresse=info.get('adresse'),
                localisation=info.get('localisation'),
                localisation_code=info.get('localisation_code'),
                rue_de=info.get('rue_de'),
                rue_a=info.get('rue_a'),
                distance_pave=info.get('distance_pave'),
                distance_ligne_rue=info.get('distance_ligne_rue'),
                stationnement_jour=info.get('stationnement_jour'),
                stationnement_heure=info.get('stationnement_heure'),
                district=info.get('district'),
                arbre_remarquable=info.get('arbre_remaquable'),
                is_valid=False
            )
        else:
            new_tree = TreeHorsRue(
                no_emp=no_emp,
                no_arrondissement=no_arrondissement,
                emplacement=emplacement,
                sigle=sigle,
                dhp=dhp,
                date_plantation=date_plantation,
                date_measure=date_releve,
                longitude=longitude,
                latitude=latitude,
                inv_type=inv_type,
                code_parc=info.get('code_parc'),
                code_secteur=info.get('code_secteur'),
                is_valid=False
            )

        try:
            db.session.add(new_tree)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(e)
            abort(500, description="Erreur lors de l'ajout de l'arbre.")

        return jsonify(new_tree.to_dict()), 201



    @app.route('/api/search_tree', methods=['GET'])
    def search_tree():
        recherche = request.args.get('recherche')
        if not recherche:
            return jsonify({"error": "Missing search parameter"}), 400

        conditions = []

        if recherche.isdigit() or isfloat(recherche) :
            for mapper in Tree.__mapper__.self_and_descendants:
                for column in mapper.columns:
                    if isinstance(column.type, (db.Integer, db.Float, db.Numeric)):
                        conditions.append(column == float(recherche))
        else:
            for mapper in Tree.__mapper__.self_and_descendants:
                for column in mapper.columns:
                    if isinstance(column.type, db.String):
                        conditions.append(column.ilike(f'%{recherche}%'))

        tree_poly = with_polymorphic(Tree, [TreeRue, TreeHorsRue])

        trees = db.session.query(tree_poly).join(
                    Essence,
                    Tree.sigle == Essence.sigle
                ).join(
                    Arrondissement,
                    Tree.no_arrondissement == Arrondissement.no_arrondissement
                ).outerjoin(
                    Parc,
                    TreeHorsRue.code_parc == Parc.code_parc
                ).outerjoin(
                    Secteur,
                    TreeHorsRue.code_secteur == Secteur.code_secteur
                ).filter(or_(*conditions,
                             Essence.la.ilike(f'%{recherche}%'),
                             Essence.fr.ilike(f'%{recherche}%'),
                             Essence.en.ilike(f'%{recherche}%'),
                             Arrondissement.nom_arrondissement.ilike(f'%{recherche}%'),
                             Parc.nom_parc.ilike(f'%{recherche}%'),
                             Secteur.nom_secteur.ilike(f'%{recherche}%')
                             )).all()

        list_tree = [tree.to_dict() for tree in trees]

        return jsonify(list_tree), 200

    @app.route('/api/demande_suppression/<int:no_emp>', methods=['POST'])
    def demande_suppression_arbre(no_emp):
        if Tree.query.filter_by(no_emp=no_emp).first() is None:
            return jsonify({"message": "Arbre non-trouvable"}), 404
        elif ListDelete.query.filter_by(no_emp=no_emp).first() is not None:
            return jsonify({"message": "Demande déja envoyée"}), 409

        request_delete = ListDelete(
            no_emp=no_emp
        )

        db.session.add(request_delete)
        db.session.commit()

        return jsonify({"message": "Demande envoyée"}), 200

    @app.route('/api/delete_tree/<int:no_emp>', methods=['POST'])
    def delete_tree(no_emp):
        tree = Tree.query.filter_by(no_emp=no_emp).first()

        if tree is None:
            return jsonify({"message": "Arbre non-trouvable"}), 404

        db.session.delete(tree)
        db.session.commit()
        list_delete = ListDelete.query.filter_by(no_emp=no_emp).first()
        if list_delete:
            db.session.delete(list_delete)
            db.session.commit()

        return jsonify({"message": "Arbre supprimé"}), 200

    @app.route('/api/modifier_arbre/<int:no_emp>', methods=['POST'])
    def modifier_arbre(no_emp):
        try:
            info = request.get_json()
            print(f"Demande reçue pour modifier l'arbre avec le numéro d'emplacement : {no_emp}")

            tree = Tree.query.filter_by(no_emp=no_emp).first()
            if not tree:
                print(f"Arbre avec l'ID {no_emp} introuvable.")
                return jsonify({"message": "Arbre introuvable"}), 404

            # Validation des attributs et conversion des dates
            if 'emplacement' in info:
                tree.emplacement = info['emplacement']

            if 'dhp' in info:
                try:
                    tree.dhp = int(info['dhp'])
                except ValueError:
                    abort(400, description="Le champ 'dhp' doit être un entier.")

            if 'date_measure' in info:
                try:
                    tree.date_measure = datetime.strptime(info['date_measure'], '%Y-%m-%d').date()
                except ValueError:
                    abort(400, description="Le format de 'date_measure' est invalide. Utilisez YYYY-MM-DD.")

            if 'date_plantation' in info:
                try:
                    tree.date_plantation = datetime.strptime(info['date_plantation'], '%Y-%m-%d').date()
                except ValueError:
                    abort(400, description="Le format de 'date_plantation' est invalide. Utilisez YYYY-MM-DD.")

            if 'latitude' in info:
                try:
                    tree.latitude = float(info['latitude'])
                except (ValueError, TypeError):
                    abort(400, description="Le champ 'latitude' doit être un nombre.")

            if 'longitude' in info:
                try:
                    tree.longitude = float(info['longitude'])
                except (ValueError, TypeError):
                    abort(400, description="Le champ 'longitude' doit être un nombre.")

            if 'inv_type' in info:
                if info['inv_type'] not in ['R', 'H']:
                    abort(400, description="Le champ 'inv_type' doit être 'R' ou 'H'.")
                tree.inv_type = info['inv_type']

            if 'is_valid' in info:
                tree.is_valid = bool(info['is_valid'])

            # Mise à jour des attributs spécifiques si l'arbre est de type TreeRue
            if isinstance(tree, TreeRue):
                tree.adresse = info.get('adresse', tree.adresse)
                tree.localisation = info.get('localisation', tree.localisation)
                tree.localisation_code = info.get('localisation_code', tree.localisation_code)
                tree.rue_de = info.get('rue_de', tree.rue_de)
                tree.rue_a = info.get('rue_a', tree.rue_a)
                tree.distance_pave = info.get('distance_pave', tree.distance_pave)
                tree.distance_ligne_rue = info.get('distance_ligne_rue', tree.distance_ligne_rue)
                tree.stationnement_jour = info.get('stationnement_jour', tree.stationnement_jour)
                tree.stationnement_heure = info.get('stationnement_heure', tree.stationnement_heure)
                tree.district = info.get('district', tree.district)
                tree.arbre_remarquable = info.get('arbre_remarquable', tree.arbre_remarquable)

            db.session.commit()
            print(f"Arbre avec le numéro d'emplacement {no_emp} et les informations associées mises à jour avec succès.")

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