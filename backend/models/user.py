from app import db

class User(db.Model):
    __tablename__ = 'user' 
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(255), nullable=False) 
    role = db.Column(db.Integer, nullable=False)  # Either 1 or 2