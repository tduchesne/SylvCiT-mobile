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
    # Comparer avec une tolérance pour les flottants
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

