from datetime import datetime
from flask import Flask, jsonify, request, abort, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import MetaData, or_

import os
from sqlalchemy.orm import joinedload


app = Flask(__name__)
# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DATABASE')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize db
metadata = MetaData(schema=os.getenv('MYSQL_DATABASE'))
db = SQLAlchemy(app, metadata=metadata)

# Initialize flask-migrate
migrate = Migrate(app, db)

# Import models after db initialization
from models import AddTree, tree_search, Tree, Family, FunctionalGroup, Genre, Location, Type


@app.before_request
def create_tables():
    db.create_all()

# Routes
@app.route('/')
def hello_world():
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

    no_emp = info.get('no_emp')
    if no_emp == "":
        no_emp = None

    adresse = info.get('adresse')

    essence_latin = info.get('essence_latin')

    essence_fr = info.get('essence_fr')

    essence_ang = info.get('essence_ang')

    dhp = info.get('dhp')

    if dhp == "" or not isinstance(dhp, int):
        dhp = None

    date_plantation = info.get('date_plantation')

    if date_plantation == "" or not isinstance(date_plantation, datetime):
        date_plantation = None

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

    try:
        new_tree = AddTree(
            no_emp=no_emp,
            adresse=adresse,
            essence_latin=essence_latin,
            essence_ang=essence_ang,
            essence_fr=essence_fr,
            dhp=dhp,
            date_plantation=date_plantation,
            date_releve=date_releve,
            latitude=latitude,
            longitude=longitude
        )
        db.session.add(new_tree)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(e)
        abort(500, description="Erreur lors de l'ajout de l'arbre.")

    return jsonify({
        'no_emp': new_tree.no_emp,
        'adresse': new_tree.adresse,
        'essence_latin': new_tree.essence_latin,
        'essence_fr': new_tree.essence_fr,
        'essence_ang': new_tree.essence_ang,
        'dhp': new_tree.dhp,
        'date_plantation': new_tree.date_plantation,
        'date_releve': new_tree.date_releve,
        'latitude': new_tree.latitude,
        'longitude': new_tree.longitude
        }), 201


@app.route('/api/search_tree2', methods=['GET'])
def search_tree2():
    recherche = request.json.get('recherche')
    conditions = []
    for column in tree_search.__table__.columns :
        if isinstance(column.type, db.String):
            conditions.append(column.ilike(f'%{recherche}%'))
    trees = tree_search.query.filter(or_(*conditions)).all()

    list_tree = [tree.to_dict() for tree in trees]

    return jsonify(list_tree), 200

@app.route('/api/search_tree_by_id', methods=['GET'])
def search_tree_by_id():
    recherche = request.args.get('recherche')
    if not recherche:
        return jsonify({"error": "Missing search parameter"}), 400

    conditions = []

    if recherche.isdigit():
        conditions.append(Tree.id_tree == int(recherche))

    for column in Tree.__table__.columns:
        if isinstance(column.type, db.String):
            conditions.append(column.ilike(f'%{recherche}%'))

    trees = Tree.query.options(
        joinedload(Tree.family),
        joinedload(Tree.genre),
        joinedload(Tree.location),
        joinedload(Tree.type),
        joinedload(Tree.functional_group)
    ).filter(or_(*conditions)).all()

    list_tree = [tree.to_dict() for tree in trees]

    return jsonify(list_tree), 200

@app.route('/api/delete_tree/<int:id_tree>', methods=['POST'])
def delete_tree(id_tree):
    tree = Tree.query.get(id_tree)

    if tree is None:
        return jsonify({"message": "Arbre non-trouvable"}), 404

    db.session.delete(tree)
    db.session.commit()

    return jsonify({"message": "Arbre supprimé"}), 200

@app.route('/api/search_tree', methods=['GET'])
def search_tree():
    recherche = request.args.get('recherche')
    if not recherche:
        return jsonify({"error": "Missing search parameter"}), 400

    conditions = []

    if recherche.isdigit():
        conditions.append(Tree.id_tree == int(recherche))

    for column in Tree.__table__.columns:
        if isinstance(column.type, db.String):
            conditions.append(column.ilike(f'%{recherche}%'))

    trees = Tree.query.options(
        joinedload(Tree.family),
        joinedload(Tree.genre),
        joinedload(Tree.location),
        joinedload(Tree.type),
        joinedload(Tree.functional_group)
    ).filter(or_(*conditions)).all()

    list_tree = [tree.to_dict() for tree in trees]

    return jsonify(list_tree), 200

@app.route('/api/modifier_arbre/<int:id_tree>', methods=['POST'])
def modifier_arbre(id_tree):
    try:
        info = request.get_json()
        print(f"Demande reçue pour modifier l'arbre avec l'ID : {id_tree}")

        tree = Tree.query.get(id_tree)
        if not tree:
            print(f"Arbre avec l'ID {id_tree} introuvable.")
            return jsonify({"message": "Arbre introuvable"}), 404

        tree.date_plantation = info.get('date_plantation', tree.date_plantation)
        tree.date_measure = info.get('date_measure', tree.date_measure)

        family_name = info.get('family')
        if family_name:
            family = Family.query.get(tree.id_family)
            if family:
                family.name = family_name
                print(f"Nom de famille mis à jour en {family_name} pour l'arbre avec l'ID : {id_tree}")
            else:
                print(f"Famille avec l'ID {tree.id_family} introuvable.")

        genre_name = info.get('genre')
        if genre_name:
            genre = Genre.query.get(tree.id_genre)
            if genre:
                genre.name = genre_name
                print(f"Nom de genre mis à jour en {genre_name} pour l'arbre avec l'ID : {id_tree}")
            else:
                print(f"Genre avec l'ID {tree.id_genre} introuvable.")

        functional_group_name = info.get('functional_group')
        if functional_group_name:
            functional_group = FunctionalGroup.query.get(tree.id_functional_group)
            if functional_group:
                functional_group.group = functional_group_name
                print(f"Groupe fonctionnel mis à jour en {functional_group_name} pour l'arbre avec l'ID : {id_tree}")
            else:
                print(f"Groupe fonctionnel avec l'ID {tree.id_functional_group} introuvable.")

        type_name = info.get('type')
        if type_name:
            type_ = Type.query.get(tree.id_type)
            if type_:
                type_.name_fr = type_name
                print(f"Type mis à jour en {type_name} pour l'arbre avec l'ID : {id_tree}")
            else:
                print(f"Type avec l'ID {tree.id_type} introuvable.")

        latitude = info.get('latitude')
        longitude = info.get('longitude')

        if latitude and longitude:
            location = Location.query.get(tree.id_location)
            if location:
                if not (-90 <= float(latitude) <= 90):
                    abort(400, description="Latitude invalide.")
                if not (-180 <= float(longitude) <= 180):
                    abort(400, description="Longitude invalide.")

                location.latitude = latitude
                location.longitude = longitude
                print(f"Emplacement mis à jour avec latitude : {latitude} et longitude : {longitude} pour l'arbre avec l'ID : {id_tree}")
            else:
                print(f"Emplacement avec l'ID {tree.id_location} introuvable.")

        db.session.commit()
        print(f"Arbre avec l'ID {id_tree} et les informations associées mises à jour avec succès.")

        return jsonify(tree.to_dict()), 200

    except Exception as e:
        print(f"Erreur lors de la modification de l'arbre : {str(e)}")
        db.session.rollback()
        return jsonify({"message": "Une erreur s'est produite lors de la modification de l'arbre"}), 500

if __name__== '__main__':
    app.run(debug=True, host='0.0.0.0')
