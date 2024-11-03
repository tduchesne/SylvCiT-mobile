from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import MetaData, Enum
import bcrypt
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
from models import Tree, User, location, type


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
            'image_url': t.image_url,
            'id_type': t.id_type,
            'id_genre': t.id_genre,
            'id_family': t.id_family,
            'id_functional_group': t.id_functional_group,
            'id_location': t.id_location
            } for t in trees
        ])

@app.route('/api/tree/status/<int:id_tree>', methods=['PUT'])
def update_tree_status(id_tree):
    data = request.get_json()

    if 'approbation_status' not in data:
        abort(400, description="Appropriation status is required.")
    if data['approbation_status'] not in ["pending", "approved"]:
        abort(400, description="Invalid approbation status.")

    # Get, modify and save tree
    tree = Tree.query.get(id_tree)
    if not tree:
        abort(404, description="Tree not found.")

    tree.approbation_status = data['approbation_status']
    db.session.commit()

    return jsonify({"message": "Tree status updated successfully."}), 200

@app.route('/api/trees/filter', methods=['GET'])
def filter():

    keyword = request.args.get('keyword', '')
    query = db.session.query(Tree).join(Tree.location).join(Tree.type)

    # TODO: update filtered fields when db fields are added
    if keyword:
        query = query.filter(
            Tree.date_plantation.ilike(f"%{keyword}%") |
                Tree.date_measure.ilike(f"%{keyword}%") |
                location.Location.latitude.ilike(f"%{keyword}%") |
                location.Location.longitude.ilike(f"%{keyword}%") |
                type.Type.name_fr.ilike(f"%{keyword}%") |
                type.Type.name_en.ilike(f"%{keyword}%") |
                type.Type.name_la.ilike(f"%{keyword}%")
        )

    trees = query.all()

    # TODO: update filtered fields when db fields are added
    return jsonify(
        [{
            'id_tree': tree.id_tree,
            'image_url': tree.image_url,
            'date_plantation': tree.date_plantation,
            'date_releve': tree.date_measure,
            'essence_latin': tree.type.name_la,
            'essence_ang': tree.type.name_en,
            'essence_fr': tree.type.name_fr,
            'latitude': tree.location.latitude,
            'longitude': tree.location.longitude,
        } for tree in trees]
    )

# pas sécuritaire vraiment
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    user = User.query.filter_by(username=username).first()

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"role": user.role}), 200

    return jsonify({"role": -1}), 401

if __name__== '__main__':
    app.run(debug=True, host='0.0.0.0')
