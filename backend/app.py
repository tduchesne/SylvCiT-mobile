from datetime import datetime
from flask import Flask, jsonify, request, abort, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import MetaData, or_

import os

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
from models import Tree, AddTree, tree_search


@app.before_request
def create_tables():
    db.create_all()

# Routes
@app.route('/')
def hello_world():
    print("Hello world")
    return  'Hi mom!'

@app.route('/api/trees', methods=['GET'])
def get_trees():
    trees = Tree.query.all()
    return jsonify(
        [{
            'id_tree': t.id_tree, 
            'date_plantation': t.date_plantation, 
            'id_family': t.id_family, 
            'id_functional_group': t.id_functional_group, 
            'id_genre': t.id_genre, 
            'id_location': t.id_location, 
            'id_type': t.id_type
            } for t in trees
        ])



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

    try:
        date_releve = datetime.strptime(date_releve, '%Y-%m-%d').date()
    except ValueError:
        abort(400, description="Le format de la date de relevé est invalide. Utilisez YYYY-MM-DD.")

    try:
        new_tree = AddTree(latitude=latitude, longitude=longitude, date_releve=date_releve)
        db.session.add(new_tree)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(e)
        abort(500, description="Erreur lors de l'ajout de l'arbre.")

    return jsonify({
        'latitude': new_tree.latitude,
        'longitude': new_tree.longitude,
        'date_releve': new_tree.date_releve
        }), 201


@app.route('/api/search_tree', methods=['GET'])
def search_tree():
    recherche = request.json.get('recherche')
    conditions = []
    for column in tree_search.__table__.columns :
        if isinstance(column.type, db.String):
            conditions.append(column.ilike(f'%{recherche}%'))
    trees = tree_search.query.filter(or_(*conditions)).all()

    list_tree = [tree.to_dict() for tree in trees]

    return jsonify(list_tree), 200
    #
    # jsonify(
    #     [{
    #         'no_emp': ts.no_emp,
    #         'arrondissement': ts.arrondissement,
    #         'emplacement': ts.emplacement,
    #         'essence_latin': ts.essence_latin,
    #         'dhp': ts.dhp,
    #         'date_releve': ts.date_releve,
    #         'date_plantation': ts.date_plantation,
    #         'longitude': ts.longitude,
    #         'latitude': ts.latitude,
    #         'inv_type': ts.inv_type
    #         } for ts in trees
    #     ])

@app.route('/api/modifier_arbre/<no_emp>', methods=['POST'])
def modifier_arbre(no_emp):
    info = request.get_json()
    tree = tree_search.query.get(no_emp)

    if tree is None:
        return jsonify({"message": "Arbre non-trouvé"}), 404

    tree.arrondissement = info.get('arrondissement')
    tree.emplacement = info.get('emplacement')
    tree.essence_latin = info.get('essence_latin')
    tree.dhp = info.get('dhp')
    tree.date_releve = info.get('date_releve')
    tree.date_plantation = info.get('date_plantation')
    tree.longitude = info.get('longitude')
    tree.latitude = info.get('latitude')
    tree.inv_type = info.get('inv_type')

    return jsonify(tree.to_dict()), 202

if __name__== '__main__':
    app.run(debug=True, host='0.0.0.0')
