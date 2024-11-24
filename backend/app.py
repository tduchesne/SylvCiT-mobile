from flask import Flask, jsonify, request, abort, send_file, send_from_directory
import math
from datetime import datetime
from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import MetaData, func, or_ 
from flask_cors import CORS  
import bcrypt
import json
import google.generativeai as genai
import os
import flask

app = Flask(__name__)

CORS(app, origins=["http://localhost:8081"]) 
# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DATABASE')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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
db = SQLAlchemy(app, metadata=metadata)

# Initialize flask-migrate
migrate = Migrate(app, db)

# Import models after db initialization
from models import Tree, User, location, type, genre, family

API_KEY = 'GEMINI_API_KEY_HERE' # Your API key here
genai.configure(api_key=API_KEY)

flask_version = tuple(map(int, flask.__version__.split('.')[:2]))
if flask_version < (2, 0):
    @app.before_first_request
    def before_first_request():
        db.create_all()
else:  # Flask 2.0 or newer
    with app.app_context():
        db.create_all()
    @app.before_request
    def create_tables():
        db.create_all()

# Routes
@app.route('/')
def hello_world():
    return 'Hi mom!'

@app.route('/health')
def health_check():
    return {'status': 'ok'}, 200

@app.route("/api/generate", methods=["POST"])
def generate_api():
    if request.method == "POST":
        if API_KEY == '':
            return jsonify({ "error": '''
                To get started, get an API key at
                https://g.co/ai/idxGetGeminiKey and enter it in
                main.py
                '''.replace('\n', '') })
        try:
            req_body = request.get_json()
            #print("Received request body:", req_body)
            content = req_body.get("contents")
            model = genai.GenerativeModel(model_name=req_body.get("model"))
            response = model.generate_content(content)
            #print("Sending content to Gemini API:", content)
            full_response = ''.join([chunk.text for chunk in response])
            print("Full response:", full_response)

            return jsonify({ "text": full_response })
        
        except Exception as e:
            print("Error in API:", str(e)) 
            return jsonify({ "error": str(e) })
    # Routes
    @app.route('/')
    def hello_world():
        return  'Hi mom!'

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
    #
    @app.route('/api/demande_suppression/<int:id_tree>', methods=['POST'])
    def demande_suppression_arbre(id_tree):
        tree = Tree.query.filter_by(id_tree=id_tree).first()
        if tree is None:
            abort(400, description="message: Arbre non-trouvable")
        elif Tree.query.filter_by(id_tree=id_tree, approbation_status="rejected").first() is not None:
            abort(400, description="message : Demande déja envoyée")

        tree.approbation_status = "rejected"
        db.session.commit()

        return jsonify({"message": "Demande envoyée"}), 200


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


