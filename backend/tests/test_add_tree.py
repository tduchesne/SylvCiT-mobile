# backend/tests/test_add_tree.py

import pytest
from app import db
from models import Tree, Essence, Arrondissement

def test_add_tree(client):
    
    # add a test essence and arrondissement so that the request succeeds
    essence = Essence(sigle="ENGOAK", la="Quercus robur", en="English Oak", fr="Chêne pédonculé")
    arrondissement = Arrondissement(no_arrondissement=1, nom_arrondissement="Exemple")
    db.session.add(essence)
    db.session.add(arrondissement)
    db.session.commit()

    # test data to add a new tree
    tree_data = {
        "no_emp": 12342,
        "adresse": "123 Rue Exemple",
        "essence_fr": "Chêne pédonculé",
        "essence_ang": "English Oak",
        "essence_latin": "Quercus robur",
        "dhp": 10,
        "date_plantation": "2020-01-01",
        "date_releve": "2024-10-01",
        "latitude": 47.123456,
        "longitude": 12.123456,
        "inv_type": "H",
        "no_arrondissement": 1,
        "emplacement": "parterre gazonné",
        "sigle": "ENGOAK"
    }

    response = client.post('/api/add_tree', json=tree_data)
    assert response.status_code == 201

    # check that the tree data is saved in the database
    tree = Tree.query.filter_by(no_emp=12342).first()
    assert tree is not None
    assert tree.no_emp == tree_data["no_emp"]
    assert tree.dhp == tree_data["dhp"]
    assert tree.date_plantation.isoformat() == tree_data["date_plantation"]
    assert tree.date_measure.isoformat() == tree_data["date_releve"]
    assert float(tree.latitude) == tree_data["latitude"]
    assert float(tree.longitude) == tree_data["longitude"]
    assert tree.inv_type == tree_data["inv_type"]
    assert tree.no_arrondissement == tree_data["no_arrondissement"]
    assert tree.emplacement == tree_data["emplacement"]
    assert tree.sigle == tree_data["sigle"]

def test_add_tree_invalid_longitude(client):
    with client.application.app_context():
        essence = Essence(sigle="INVALIDLONG", la="Invalidus longus", en="Invalid Long English", fr="Longitude Invalide")
        arrondissement = Arrondissement(no_arrondissement=2, nom_arrondissement="Invalid Longitude Arrondissement")
        db.session.add(essence)
        db.session.add(arrondissement)
        db.session.commit()

    tree_data = {
        "no_emp": 12343,
        "adresse": "456 Rue Exemple",
        "essence_fr": "Longitude Invalide",
        "essence_ang": "Invalid Long English",
        "essence_latin": "Invalidus longus",
        "dhp": 15,
        "date_plantation": "2021-02-01",
        "date_releve": "2024-11-01",
        "latitude": 48.123456,
        "longitude": 190.0,  # Longitude invalide
        "inv_type": "H",
        "no_arrondissement": 2,
        "emplacement": "parterre gazonné",
        "sigle": "INVALIDLONG"
    }

    response = client.post('/api/add_tree', json=tree_data)
    assert response.status_code == 400
    data = response.get_json()
    assert "Longitude invalide." in data['description']

def test_add_tree_invalid_date(client):
    with client.application.app_context():
        essence = Essence(sigle="INVALIDDATE", la="Invalidus dateus", en="Invalid Date English", fr="Date Invalide")
        arrondissement = Arrondissement(no_arrondissement=3, nom_arrondissement="Invalid Date Arrondissement")
        db.session.add(essence)
        db.session.add(arrondissement)
        db.session.commit()

    tree_data = {
        "no_emp": 12344,
        "adresse": "789 Rue Exemple",
        "essence_fr": "Date Invalide",
        "essence_ang": "Invalid Date English",
        "essence_latin": "Invalidus dateus",
        "dhp": 20,
        "date_plantation": "2021-03-01",
        "date_releve": "2024-13-01",  # Date invalide
        "latitude": 49.123456,
        "longitude": 14.123456,
        "inv_type": "H",
        "no_arrondissement": 3,
        "emplacement": "parterre gazonné",
        "sigle": "INVALIDDATE"
    }

    response = client.post('/api/add_tree', json=tree_data)
    assert response.status_code == 400
    data = response.get_json()
    assert "Le format de la date de relevé est invalide. Utilisez YYYY-MM-DD." in data['description']

def test_add_tree_duplicate_no_emp(client):
    with client.application.app_context():
        essence = Essence(sigle="DUPTEST", la="Duplicateus", en="Duplicate English", fr="Duplicate Français")
        arrondissement = Arrondissement(no_arrondissement=4, nom_arrondissement="Duplicate Arrondissement")
        db.session.add(essence)
        db.session.add(arrondissement)
        db.session.commit()

    tree_data = {
        "no_emp": 12345,  # Utiliser un numéro d'emplacement unique
        "adresse": "321 Rue Exemple",
        "essence_fr": "Duplicate Français",
        "essence_ang": "Duplicate English",
        "essence_latin": "Duplicateus",
        "dhp": 25,
        "date_plantation": "2021-04-01",
        "date_releve": "2024-12-01",
        "latitude": 50.123456,
        "longitude": 15.123456,
        "inv_type": "H",
        "no_arrondissement": 4,
        "emplacement": "parterre gazonné",
        "sigle": "DUPTEST"
    }

    
    # add the tree the first time
    response1 = client.post('/api/add_tree', json=tree_data)
    assert response1.status_code == 201

    # try to add the same tree again to cause an error (duplicate no_emp)
    response2 = client.post('/api/add_tree', json=tree_data)
    assert response2.status_code == 500
    data = response2.get_json()
    assert "Erreur lors de l'ajout de l'arbre." in data['description']



