from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import MetaData, Enum

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
            'date_plantation': t.date_plantation.isoformat(),
            'date_measure': t.date_measure.isoformat(),
            'approbation_status': t.approbation_status,
            'details_url': t.details_url,
            'id_type': t.id_type,
            'id_genre': t.id_genre,
            'id_family': t.id_family,
            'id_functional_group': t.id_functional_group,
            'id_location': t.id_location
            } for t in trees
        ])
    
@app.route('/api/trees/<int:id_tree>', methods=['PUT'])
def update_tree_status(id_tree):
    data = request.get_json()

    if 'approbation_status' not in data:
        abort(400, description="Appropriation status is required.")
    if data['approbation_status'] not in ["pending", "approved", "rejected"]:
        abort(400, description="Invalid approbation status.")

    # Get, modify and save tree
    tree = Tree.query.get(id_tree)
    if not tree:
        abort(404, description="Tree not found.")

    tree.approbation_status = data['approbation_status']
    db.session.commit()

    return jsonify({"message": "Tree status updated successfully."}), 200


if __name__== '__main__':
    app.run(debug=True, host='0.0.0.0')
