# backend/tests/test_delete_tree.py

import pytest
from app import db
from models import Tree, ListDelete

def test_demande_suppression_arbre(client):
    
    # send a request to delete a tree with no_emp 31709
    response = client.post('/api/demande_suppression/31709')
    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == "Demande envoyée"
    
    
    # verify that the request is saved in the database
    request_delete = ListDelete.query.filter_by(no_emp=31709).first()
    assert request_delete is not None

    # send a request to delete the same tree (should return a conflict)
    response = client.post('/api/demande_suppression/31709')
    assert response.status_code == 409
    data = response.get_json()
    assert data['message'] == "Demande déja envoyée"

    # Test a deletion request for a non-existent tree
    response = client.post('/api/demande_suppression/99999')
    assert response.status_code == 404
    data = response.get_json()
    assert data['message'] == "Arbre non-trouvable"


def test_delete_tree(client):
  
    # be sure that the tree exists before deletion
    tree = Tree.query.filter_by(no_emp=31709).first()
    assert tree is not None

    # delete the tree with no_emp 31709
    response = client.post('/api/delete_tree/31709')
    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == "Arbre supprimé"

   
    # check if the tree is deleted from the database
    tree = Tree.query.filter_by(no_emp=31709).first()
    assert tree is None

    # check that the associated deletion request is also deleted
    request_delete = ListDelete.query.filter_by(no_emp=31709).first()
    assert request_delete is None

    # test the deletion of a non existent tree
    response = client.post('/api/delete_tree/99999')
    assert response.status_code == 404
    data = response.get_json()
    assert data['message'] == "Arbre non-trouvable"
