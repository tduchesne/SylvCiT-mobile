import pytest
from datetime import datetime


def test_search_tree_by_sigle(client):
    """
    Test the search_tree endpoint with a valid sigle.
    """
    response = client.get('/api/search_tree', query_string={'recherche': 'ULWIPR'})
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1

    # Vérifier la présence de 'essence' et 'sigle' dans la réponse
    assert 'essence' in data[0], "La clé 'essence' est manquante dans la réponse."
    assert 'sigle' in data[0]['essence'], "La clé 'sigle' est manquante dans 'essence'."
    assert data[0]['essence']['sigle'] == 'ULWIPR'

def test_search_tree_by_no_emp(client):
    """
   Test the search_tree endpoint with a valid no_emp.
    """
    response = client.get('/api/search_tree', query_string={'recherche': '31709'})
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['no_emp'] == 31709

def test_search_tree_no_recherche(client):
    """
   Test the search_tree endpoint with no query string.
    """
    response = client.get('/api/search_tree')
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

def test_search_tree_no_results(client):
    """
   Test the search_tree endpoint with a term that does not exist.
    """
    response = client.get('/api/search_tree', query_string={'recherche': 'TermeInexistant'})
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 0



