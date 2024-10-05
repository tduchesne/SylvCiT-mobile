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
metadata = MetaData(schema=os.getenv('MYSQL_DATABASE'))
db = SQLAlchemy(app, metadata=metadata)

# Initialize flask-migrate
migrate = Migrate(app, db)

# Import models after db initialization
from models import Tree, AddTree


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

    latitude = info['latitude']
    longitude = info['longitude']
    date_releve = info['date_releve']
    new_tree = AddTree(latitude=latitude, longitude=longitude, date_releve=date_releve)
    db.session.add(new_tree)
    db.session.commit()
    return jsonify({'latitude': new_tree.latitude,
                    'longitude': new_tree.longitude,
                    'date_releve': new_tree.date_releve}), 201

if __name__== '__main__':
    app.run(debug=True, host='0.0.0.0')
