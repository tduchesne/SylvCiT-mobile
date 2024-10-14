from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import MetaData

import json
import google.generativeai as genai
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

API_KEY = 'AIzaSyD8wWO6ut7kROGgi_XZ_q1Nz4GPihqb67Q' # Your API key here

genai.configure(api_key=API_KEY)

@app.before_first_request
def create_tables():
    db.create_all()

# Routes
@app.route('/')
def hello_world():
    return  'Hi mom!'

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
            print("Received request body:", req_body)
            content = req_body.get("contents")
            model = genai.GenerativeModel(model_name=req_body.get("model"))
            response = model.generate_content(content, stream=True)
            print("Sending content to Gemini API:", content)
            def stream():
                for chunk in response:
                    print("Received chunk from Gemini API:", chunk.text)
                    yield 'data: %s\n\n' % json.dumps({ "text": chunk.text })

            return stream(), {'Content-Type': 'text/event-stream'}

        except Exception as e:
            print("Error in API:", str(e)) 
            return jsonify({ "error": str(e) })

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


if __name__== '__main__':
    app.run(debug=True, host='0.0.0.0')
