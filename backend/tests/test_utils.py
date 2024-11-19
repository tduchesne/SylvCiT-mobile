#test_utils.py
from app import isfloat
from app import db
from models import Tree, Essence, Arrondissement, TreeHorsRue, TreeRue
from datetime import datetime
from sqlalchemy import inspect

# def isfloat(value):
#     try:
#         if value is None:
#             return False
#         float(value)
#         return True
#     except ValueError:
#         return False


def test_hello_world(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.data.decode('utf-8') == 'Hi mom!'



def test_create_tables(client, app):
    with app.app_context():
        db.drop_all()  
        client.get('/')  
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        assert tables != [], "Tables should be created by `create_tables`"

def test_tree_rue_to_dict(app):
    with app.app_context():
        tree_rue = TreeRue(
            no_emp=12345,
            inv_type="R",
            adresse="123 Rue",
            localisation="Proche du parc",
            latitude=45.5017,
            longitude=-73.5673,
            date_measure=datetime.strptime("2024-10-01", "%Y-%m-%d").date(),
            is_valid=True
        )
        expected = {
            "id": None,  
            "no_emp": 12345,
            "arrondissement": None,  
            "emplacement": None,  
            "essence": None,  
            "dhp": None,  
            "date_releve": "2024-10-01",
            "date_plantation": None, 
            "latitude": 45.5017,
            "longitude": -73.5673,
            "inv_type": "R",
            "is_valid": True,
            "adresse": "123 Rue",
            "localisation": "Proche du parc",
            "localisation_code": None,  
            "rue_de": None,  
            "rue_a": None,  
            "distance_pave": None,  
            "distance_ligne_rue": None,  
            "stationnement_jour": None,  
            "stationnement_heure": None,  
            "district": None,  
            "arbre_remarquable": None,  
        }
        assert tree_rue.to_dict() == expected
