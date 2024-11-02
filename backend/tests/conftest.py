# backend/tests/conftest.py

import pytest
from app import create_app, db
from models import Tree, TreeRue, TreeHorsRue, Essence, Arrondissement, Parc, Secteur
from datetime import datetime

# @pytest.fixture(scope='module')
# def test_client():
#     # Create an instance of the application with the test configuration
#     app = create_app('testing')

#     # Create the test client
#     testing_client = app.test_client()

#     # Create the application context
#     ctx = app.app_context()
#     ctx.push()

#      # Create the tables
#     db.create_all()

#     yield testing_client   # Run the tests

#      # Cleanup after the tests
#     db.session.remove()
#     db.drop_all()
#     ctx.pop()

@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        # Ajouter des données de test
        arrondissement = Arrondissement(no_arrondissement=6, nom_arrondissement='Ville-Marie')
        db.session.add(arrondissement)

        essence = Essence(sigle='ULWIPR', la="Ulmus wilsoniana 'Prospector'", en="Prospector's Elm", fr='Orme japonais du prospecteur')
        db.session.add(essence)

        parc = Parc(code_parc='1265-000', nom_parc='PROMENADE DES ARTISTES')
        db.session.add(parc)

        secteur = Secteur(code_secteur='2', nom_secteur='OUEST')
        db.session.add(secteur)

        tree = TreeHorsRue(
            no_emp=31709,
            no_arrondissement=6,
            emplacement='parterre gazonné',
            sigle='ULWIPR',
            dhp=22,
            date_measure=datetime.strptime('2024-04-15', '%Y-%m-%d').date(),
            date_plantation=datetime.strptime('2010-10-12', '%Y-%m-%d').date(),
            latitude=45.508639,
            longitude=-73.568412,
            inv_type='H',
            code_parc='1265-000',
            code_secteur='2',
            is_valid=True
        )
        db.session.add(tree)
        db.session.commit()
    yield app
    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

