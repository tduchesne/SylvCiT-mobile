# backend/tests/test_add_tree.py

import pytest
from flask import url_for

def test_add_tree_success(client, db_fixture, init_database):
    data = {
        'latitude': '45.72587',
        'longitude': '-73.45703',
        'date_releve': '2023-10-01',
        'date_plantation': '2022-05-10',
        'details_url': 'http://example.com/details',
        'image_url': 'http://example.com/image.jpg',
        'type': 'Catalpa de lOuest',
        'genre': 'Catalpa',
        'family': 'Sapindaceae',
        'functional_group': '1A',
        'dhp': '10'
    }
    response = client.post('/api/add_tree', json=data)
    assert response.status_code == 201
    response_data = response.get_json()
    assert response_data['approbation_status'] == 'pending'
    assert float(response_data['location']['latitude']) == pytest.approx(45.72587, rel=1e-5)
    assert float(response_data['location']['longitude']) == pytest.approx(-73.45703, rel=1e-5)


def test_add_tree_invalid_latitude(client, db_fixture, init_database):
    data = {
        'latitude': '100.0',  #invalid latitude
        'longitude': '-73.45703',
        'date_releve': '2023-10-01',
        'date_plantation': '2022-05-10',
        'details_url': 'http://example.com/details',
        'image_url': 'http://example.com/image.jpg',
        'type': 'Catalpa de lOuest',
        'genre': 'Catalpa',
        'family': 'Sapindaceae',
        'functional_group': '1A',
        'dhp': '10'
    }
    response = client.post('/api/add_tree', json=data)
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['description'] == "Latitude invalide."

def test_add_tree_invalid_longitude(client, db_fixture, init_database):
    data = {
        'latitude': '45.72587',
        'longitude': '-200.0',  # invalid longitude
        'date_releve': '2023-10-01',
        'date_plantation': '2022-05-10',
        'details_url': 'http://example.com/details',
        'image_url': 'http://example.com/image.jpg',
        'type': 'Catalpa de lOuest',
        'genre': 'Catalpa',
        'family': 'Sapindaceae',
        'functional_group': '1A',
        'dhp': '10'
    }
    response = client.post('/api/add_tree', json=data)
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['description'] == "Longitude invalide."

def test_add_tree_invalid_date_releve(client, db_fixture, init_database):
    data = {
        'latitude': '45.72587',
        'longitude': '-73.45703',
        'date_releve': '2023-13-01',  # invalid month
        'date_plantation': '2022-05-10',
        'details_url': 'http://example.com/details',
        'image_url': 'http://example.com/image.jpg',
        'type': 'Catalpa de lOuest',
        'genre': 'Catalpa',
        'family': 'Sapindaceae',
        'functional_group': '1A',
        'dhp': '10'
    }
    response = client.post('/api/add_tree', json=data)
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['description'] == "Le format de la date de relevé est invalide. Utilisez YYYY-MM-DD."

def test_add_tree_invalid_date_plantation(client, db_fixture, init_database):
    data = {
        'latitude': '45.72587',
        'longitude': '-73.45703',
        'date_releve': '2023-10-01',
        'date_plantation': 'invalid-date',  # invalid date format
        'details_url': 'http://example.com/details',
        'image_url': 'http://example.com/image.jpg',
        'type': 'Catalpa de lOuest',
        'genre': 'Catalpa',
        'family': 'Sapindaceae',
        'functional_group': '1A',
        'dhp': '10'
    }
    response = client.post('/api/add_tree', json=data)
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['description'] == "Le format de la date de plantation est invalide. Utilisez YYYY-MM-DD."

def test_add_tree_invalid_dhp(client, db_fixture, init_database):
    data = {
        'latitude': '45.72587',
        'longitude': '-73.45703',
        'date_releve': '2023-10-01',
        'date_plantation': '2022-05-10',
        'details_url': 'http://example.com/details',
        'image_url': 'http://example.com/image.jpg',
        'type': 'Catalpa de lOuest',
        'genre': 'Catalpa',
        'family': 'Sapindaceae',
        'functional_group': '1A',
        'dhp': 'invalid-dhp'  # non-integer value
    }
    response = client.post('/api/add_tree', json=data)
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['description'] == "Le champ 'dhp' doit être un entier."

def test_add_duplicate_tree(client, db_fixture, init_database):
    data1 = {
        'latitude': '45.72587',
        'longitude': '-73.45703',
        'date_releve': '2023-10-01',
        'date_plantation': '2022-05-10',
        'details_url': 'http://example.com/details1',
        'image_url': 'http://example.com/image1.jpg',
        'type': 'Catalpa de lOuest',
        'genre': 'Catalpa',
        'family': 'Sapindaceae',
        'functional_group': '1A',
        'dhp': '10'
    }
    response1 = client.post('/api/add_tree', json=data1)
    assert response1.status_code == 201
    response_data1 = response1.get_json()
    assert response_data1['approbation_status'] == 'pending'
    location_id1 = response_data1['location']['id_location']

    data2 = {
        'latitude': '45.72587',
        'longitude': '-73.45703',
        'date_releve': '2023-10-01',
        'date_plantation': '2022-05-10',
        'details_url': 'http://example.com/details1',  
        'image_url': 'http://example.com/image1.jpg',  
        'type': 'Catalpa de lOuest',
        'genre': 'Catalpa',
        'family': 'Sapindaceae',
        'functional_group': '1A',
        'dhp': '10'
    }
    response2 = client.post('/api/add_tree', json=data2)
    assert response2.status_code == 201
    response_data2 = response2.get_json()
    assert response_data2['approbation_status'] == 'pending'
    location_id2 = response_data2['location']['id_location']

    # Vérifier que les deux arbres ont des IDs différents mais partagent le même id_location
    assert response_data1['id_tree'] != response_data2['id_tree']
    assert location_id1 == location_id2

    # Vérifier que les deux arbres existent dans la base de données en filtrant par id_location
    from models import Tree
    trees = Tree.query.filter_by(id_location=location_id1).all()
    assert len(trees) == 2
    assert trees[0].id_location == trees[1].id_location



