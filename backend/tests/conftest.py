# backend/tests/conftest.py

import pytest
from app import create_app, db

@pytest.fixture(scope='module')
def test_client():
    # Créer une instance de l'application avec la configuration de test
    app = create_app('testing')

    # Création du client de test
    testing_client = app.test_client()

    # Création du contexte de l'application
    ctx = app.app_context()
    ctx.push()

    # Créer les tables
    db.create_all()

    yield testing_client  # Exécuter les tests

    # Nettoyage après les tests
    db.session.remove()
    db.drop_all()
    ctx.pop()
