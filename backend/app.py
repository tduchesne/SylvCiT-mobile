from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DB')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.before_first_request
def create_tables():
    db.create_all()

# Import models after db initialization
from models import Tree

# Routes
@app.route('/')
def hello_world():
    return  'Hi mom!'

@app.route('/api/trees', methods=['GET'])
def get_trees():
    tree = Tree.query.all()
    return jsonify([{'id': p.id, 'name': p.name, 'price': p.price, 'in_stock': p.in_stock} for p in products])


if __name__== '__main__':
    app.run(debug=True, host='0.0.0.0')
