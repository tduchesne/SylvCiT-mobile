import pytest
from app import app

@pytest.fixture
def client():
    """Fixture pour créer un client de test"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client
        