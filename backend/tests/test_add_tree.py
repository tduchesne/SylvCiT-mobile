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

    # Données de test pour ajouter un nouvel arbre
    # Test data to add a new tree
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

    # Envoyer une requête POST pour ajouter un arbre
    response = client.post('/api/add_tree', json=tree_data)
    assert response.status_code == 201

    # Vérifier que les données de l'arbre sont bien enregistrées dans la base de données
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
