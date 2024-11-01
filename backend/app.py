from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import MetaData, or_

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

@app.route('/api/trees/filter', methods=['GET'])
def filter():

    keyword = request.args.get('keyword', '')
    print(keyword)

    if keyword:
        print("")
        trees = db.session.query(Tree).join(Tree.location).join(Tree.type).filter(
            or_(
                Tree.date_plantation.ilike(f"%{keyword}%"),
                Tree.date_measure.ilike(f"%{keyword}%"),
                Tree.location.latitude.ilike(f"%{keyword}%"),
                Tree.location.longitude.ilike(f"%{keyword}%"),
                Tree.type.name_fr.ilike(f"%{keyword}%"),
                Tree.type.name_en.ilike(f"%{keyword}%"),
                Tree.type.name_la.ilike(f"%{keyword}%"),
            )).all()
    else:
        trees = Tree.query.all()
    
    print(len(trees))
    return jsonify(
        [{
            'date_plantation': tree.date_plantation,
            'date_releve': tree.date_measure,
            'essence_latin': tree.type.name_la,
            'essence_ang': tree.type.name_en,
            'essence_fr': tree.type.name_fr,
            'latitude': tree.location.latitude,
            'longitude': tree.location.longitude,
        } for tree in trees]
    )

if __name__== '__main__':
    app.run(debug=True, host='0.0.0.0')
