# backend/tests/test_add_tree.py

import pytest
from datetime import datetime

def test_add_tree_success(test_client):
    """
    test the successful addition of a tree with all valid data.
    """
    payload = {
        "no_emp": 12345,
        "adresse": "123 Rue albert",
        "essence_latin": "Quercus robur",
        "essence_fr": "Chêne pédonculé",
        "essence_ang": "English Oak",
        "dhp": 10,
        "date_plantation": None,
        "date_releve": "2024-10-01",
        "latitude": 45.123456,
        "longitude": 12.123456
    }

    response = test_client.post('/api/add_tree', json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert data['no_emp'] == 12345
    assert data['adresse'] == "123 Rue albert"
    assert data['essence_latin'] == "Quercus robur"
    assert data['essence_fr'] == "Chêne pédonculé"
    assert data['essence_ang'] == "English Oak"
    assert data['dhp'] == 10
    assert data['date_plantation'] == None
    assert data['date_releve'] == "Tue, 01 Oct 2024 00:00:00 GMT"
    assert data['latitude'] == "45.123456"
    assert data['longitude'] == "12.123456"

def test_add_tree_missing_required_field(test_client):
    """
    test adding a tree with a missing required field (essence_latin).
    """
    payload = {
        # "essence_latin" missing
        "no_emp": 12345,
        "adresse": "123 Rue Exemple",
        "essence_fr": "Chêne pédonculé",
        "essence_ang": "English Oak",
        "dhp": 10,
        "date_plantation": "2020-01-01",
        "date_releve": "2024-10-01",
        "latitude": 45.123456,
        "longitude": 12.123456
    }

    response = test_client.post('/api/add_tree', json=payload)
    assert response.status_code == 500

   
def test_add_tree_invalid_latitude(test_client):
    """
    test adding a tree with an invalid latitude.
    """
    payload = {
        "no_emp": 12345,
        "adresse": "123 Rue Exemple",
        "essence_latin": "Quercus robur",
        "essence_fr": "Chêne pédonculé",
        "essence_ang": "English Oak",
        "dhp": 10,
        "date_plantation": "2020-01-01",
        "date_releve": "2024-10-01",
        "latitude": 100.0,  # latitude invalide
        "longitude": 12.123456
    }

    response = test_client.post('/api/add_tree', json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert 'Latitude invalide' in data.get('description', '')

def test_add_tree_invalid_longitude(test_client):
    """
    test adding a tree with an invalid longitude.
    """
    payload = {
        "no_emp": 12345,
        "adresse": "123 Rue Exemple",
        "essence_latin": "Quercus robur",
        "essence_fr": "Chêne pédonculé",
        "essence_ang": "English Oak",
        "dhp": 10,
        "date_plantation": "2020-01-01",
        "date_releve": "2024-10-01",
        "latitude": 45.123456,
        "longitude": 200.0  # longitude invalide
    }

    response = test_client.post('/api/add_tree', json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert 'Longitude invalide' in data.get('description', '')

def test_add_tree_invalid_date_format(test_client):
    """
    test adding a tree with an invalid date format for date_plantation.
    """
    payload = {
        "no_emp": 12345,
        "adresse": "123 Rue Exemple",
        "essence_latin": "Quercus robur",
        "essence_fr": "Chêne pédonculé",
        "essence_ang": "English Oak",
        "dhp": 10,
        "date_plantation": "01-01-2020",  # Format invalide
        "date_releve": "2024-10-01",
        "latitude": 45.123456,
        "longitude": 12.123456
    }

    response = test_client.post('/api/add_tree', json=payload)
    assert response.status_code == 400
    data = response.get_json()
   

def test_add_tree_missing_date_releve(test_client):
    """
    test adding a tree without providing the date_releve.
    """
    payload = {
        "no_emp": 12345,
        "adresse": "123 Rue Exemple",
        "essence_latin": "Quercus robur",
        "essence_fr": "Chêne pédonculé",
        "essence_ang": "English Oak",
        "dhp": 10,
        "date_plantation": "2020-01-01",
        # "date_releve" missing
        "latitude": 45.123456,
        "longitude": 12.123456
    }

    response = test_client.post('/api/add_tree', json=payload)
    assert response.status_code == 400
    
    
    

def test_add_tree_invalid_dhp_type(test_client):
    """
    test adding a tree with an invalid type for the dhp field.
    """
    payload = {
        "no_emp": 12345,
        "adresse": "123 Rue Exemple",
        "essence_latin": "Quercus robur",
        "essence_fr": "Chêne pédonculé",
        "essence_ang": "English Oak",
        "dhp": "dix",  # Type incorrect
        "date_plantation": "2020-01-01",
        "date_releve": "2024-10-01",
        "latitude": 45.123456,
        "longitude": 12.123456
    }

    response = test_client.post('/api/add_tree', json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert 'dhp' in data.get('description', '') or 'dhp' in data.get('message', '')

