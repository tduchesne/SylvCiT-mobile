from flask import url_for
import pytest

def test_health_check(client):
    """Test basic de santé de l'application"""
    response = client.get('/health')
    assert response.status_code == 200

def test_backend_running():
    """Test simple pour vérifier que les tests fonctionnent"""
    assert True
    