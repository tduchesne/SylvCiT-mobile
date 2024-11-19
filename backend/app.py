from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import MetaData, func, or_ 
from flask_cors import CORS  
import bcrypt
import os

app = Flask(__name__)
# To enable CORS for all routes of the application
CORS(app)  

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DATABASE')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize db
metadata = MetaData(schema=os.getenv('MYSQL_DATABASE'))
db = SQLAlchemy(app, metadata=metadata)

# Initialize flask-migrate
migrate = Migrate(app, db)

# Import models after db initialization
from models import Tree, User, location, type, genre, family

@app.before_first_request
def create_tables():
    db.create_all()

# Routes
@app.route('/')
def hello_world():
    return 'Hi mom!'

@app.route('/api/trees', methods=['GET'])
def get_trees():
    query = db.session.query(Tree).join(Tree.location).join(Tree.type).join(Tree.genre).join(Tree.family)
    trees = query.all()
    return jsonify(
        [{
            'id_tree': tree.id_tree,
            'image_url': tree.image_url,
            'date_plantation': tree.date_plantation,
           'date_measure': tree.date_measure,
             'name_la': tree.type.name_la,
            'name_en': tree.type.name_en,
            'name_fr': tree.type.name_fr,
            'latitude': tree.location.latitude,
            'longitude': tree.location.longitude,
            'genre': tree.genre.name,
            'family_name': tree.family.name,
            } for tree in trees
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

@app.route('/api/trees/setfilters', methods=['GET'])
def setfilters():
    
    # Grab unique values for different filters using database query
    unique_years = db.session.query(func.extract('year', Tree.date_plantation)).distinct().order_by(func.extract('year', Tree.date_plantation)).all()
    unique_years = [str(int(year[0])) for year in unique_years]

    unique_species = db.session.query(type.Type.name_la).distinct().order_by(type.Type.name_la).all()
    unique_species = [species[0] for species in unique_species]

    unique_regions = db.session.query(location.Location.region).distinct().order_by(location.Location.region).all()
    unique_regions = [regions[0] for regions in unique_regions]
    
    dhp_values = db.session.query(Tree.dhp).all()
    dhp_values = [value[0] for value in dhp_values if value[0] is not None]

    ## TODO: might not be the correct fix, but this checks that dhp_values is not empty before trying to calculate min-max
    dhp_ranges = []
    if dhp_values:
        min_dhp, max_dhp = min(dhp_values), max(dhp_values)
        dhp_intervals = 5
        dhp_ranges = [f"{i}-{i + dhp_intervals}" for i in range(min_dhp, max_dhp + 1, dhp_intervals)]

    return jsonify({
        "years": unique_years,
        "species": unique_species,
        "regions": unique_regions,
        "dhp_ranges": dhp_ranges
    })

@app.route('/api/trees/filter', methods=['GET'])
def filter():
    
    # Grab filter options from params
    keyword = request.args.get('keyword', '')
    region = request.args.get('region', None)
    dhp_range = request.args.get('dhp', None)
    species = request.args.get('species', None)
    year_planted = request.args.get('year', None)

    query = db.session.query(Tree).join(Tree.location).join(Tree.type).join(Tree.genre).join(Tree.family)
    query = query.filter(Tree.approbation_status.ilike("pending"))
    
    if region:
        # Strips quotes around param
        region = region.strip("'")
        query = query.filter(location.Location.region.ilike(f"%{region}%"))

    if dhp_range:
        dhp_range = dhp_range.strip("'")
    
        try:
            # Receives dhp filter option under format "x-y"
            min_dhp, max_dhp = map(float, dhp_range.split('-'))
            query = query.filter(Tree.dhp >= min_dhp, Tree.dhp <= max_dhp)
        except ValueError:
            return jsonify({"error": "Invalid DHP range format. Expected format: 'min-max'."}), 400


    if species:
        species = species.strip("'")
        query = query.filter(type.Type.name_la.ilike(f"%{species}%"))


    if year_planted:
        year_planted = year_planted.strip("'")
        query = query.filter(Tree.date_plantation.like(f'{year_planted}-%'))
        
        app.logger.info(year_planted, query)

    # If keyword filter exists, strip quotes then apply filter on certain important attributes
    if keyword:
        keyword = keyword.strip("'")
        
        query = query.filter(
            or_(
            Tree.date_plantation.ilike(f"%{keyword}%"),
            Tree.date_measure.ilike(f"%{keyword}%"),
            type.Type.name_la.ilike(f"%{keyword}%"),
            type.Type.name_en.ilike(f"%{keyword}%"),
            type.Type.name_fr.ilike(f"%{keyword}%"),
            genre.Genre.name.like(f"%{keyword}%"),
            family.Family.name.like(f"%{keyword}%"),
            Tree.dhp.ilike(f"%{keyword}%"),
            location.Location.region.ilike(f"%{keyword}%")
            )
        )

    trees = query.all()

    return jsonify([
        {
            'id_tree': tree.id_tree,
            'family_name': tree.family.name,
            'group': tree.functional_group.group,
            'description': tree.functional_group.description,
            'genre': tree.genre.name,
            'latitude': tree.location.latitude,
            'longitude': tree.location.longitude,
            'date_plantation': tree.date_plantation,
            'date_measure': tree.date_measure,
            'approbation_status': tree.approbation_status,
            'details_url': tree.details_url,
            'image_url': tree.image_url,
            'name_la': tree.type.name_la,
            'name_en': tree.type.name_en,
            'name_fr': tree.type.name_fr,
            'dhp': tree.dhp,
            'region': tree.location.region
        }
        for tree in trees
    ])

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')


