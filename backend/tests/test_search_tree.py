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
    assert data[0]['sigle'] == 'ULWIPR'

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



