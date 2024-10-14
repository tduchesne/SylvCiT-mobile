from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import MetaData

import os

app = Flask(__name__)
# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DATABASE')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize db
metadata = MetaData(schema=os.getenv('MYSQL_DATABASE'));
db = SQLAlchemy(app, metadata=metadata)

# Initialize flask-migrate
migrate = Migrate(app, db)

# Import models after db initialization
from models import Tree

from models import Tree, Genre

@app.before_first_request
def create_tables():
    db.create_all()

# Routes
@app.route('/')
def hello_world():
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


@app.route('/search-trees', methods=['GET'])
def search_trees():
    # Récupérer le terme de recherche depuis les paramètres de la requête
    search_term = request.args.get('term', '')

    # Rechercher les arbres qui correspondent au terme de recherche par genre
    trees = (db.session.query(Tree, Genre)
             .join(Genre, Tree.id_genre == Genre.id_genre)
             .filter(Genre.name.like(f"%{search_term}%"))
             .all())

    # Retourner les résultats au format JSON avec des informations sur le genre
    return jsonify(
        [{
            'id_tree': tree.id_tree,
            'name': genre.name,  # Utilise le nom du genre dans la table genre
            'date_plantation': tree.date_plantation,
            'id_family': tree.id_family,
            'id_functional_group': tree.id_functional_group,
            'id_location': tree.id_location,
            'id_type': tree.id_type
        } for tree, genre in trees]
    )


if __name__== '__main__':
    app.run(debug=True, host='0.0.0.0')
