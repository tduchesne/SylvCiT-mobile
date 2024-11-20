# backend/tests/test_api_routes.py

import pytest
from datetime import datetime
from models import Tree, Genre, Family, FunctionalGroup, Type, Location

@pytest.fixture(scope='function')
def setup_data(db_fixture):
    # Création des données nécessaires
    functional_group1 = FunctionalGroup(
        group='1A',
        description='Conifères tolérants à l’ombre.'
    )
    functional_group2 = FunctionalGroup(
        group='1B',
        description='Conifères héliophiles.'
    )
    family1 = Family(name='Sapindaceae')
    family2 = Family(name='Juglandaceae')
    genre1 = Genre(name='Catalpa')
    genre2 = Genre(name='Acer')
    type1 = Type(name_fr='Catalpa de lOuest', name_en='Western Catalpa', name_la='Catalpa speciosa')
    type2 = Type(name_fr='Phellodendron de lAmour Maelio', name_en='Maelio Amur Cork Tree', name_la='Phellodendron amurensis Maelio')
    location1 = Location(latitude='45.72587', longitude='-73.45703')
    location2 = Location(latitude='45.77804', longitude='-73.40377')
    
    db_fixture.session.add_all([
        functional_group1, functional_group2,
        family1, family2,
        genre1, genre2,
        type1, type2,
        location1, location2
    ])
    db_fixture.session.commit()
    
    # Création des arbres pour les tests
    tree1 = Tree(
        date_plantation=datetime.strptime('2022-05-10', '%Y-%m-%d').date(),
        date_measure=datetime.strptime('2023-10-01', '%Y-%m-%d').date(),
        approbation_status="pending",
        location=location1,
        details_url='http://example.com/details1',
        image_url='http://example.com/image1.jpg',
        type=type1,
        genre=genre1,
        family=family1,
        functional_group=functional_group1,
        dhp=10
    )
    
    tree2 = Tree(
        date_plantation=datetime.strptime('2021-04-15', '%Y-%m-%d').date(),
        date_measure=datetime.strptime('2023-09-10', '%Y-%m-%d').date(),
        approbation_status="approved",
        location=location2,
        details_url='http://example.com/details2',
        image_url='http://example.com/image2.jpg',
        type=type2,
        genre=genre2,
        family=family2,
        functional_group=functional_group2,
        dhp=15
    )
    
    tree3 = Tree(
        date_plantation=datetime.strptime('2020-03-20', '%Y-%m-%d').date(),
        date_measure=datetime.strptime('2022-08-25', '%Y-%m-%d').date(),
        approbation_status="rejected",
        location=location1,
        details_url='http://example.com/details3',
        image_url='http://example.com/image3.jpg',
        type=type1,
        genre=genre1,
        family=family1,
        functional_group=functional_group1,
        dhp=12
    )
    
    db_fixture.session.add_all([tree1, tree2, tree3])
    db_fixture.session.commit()
    
    yield
    
    # Nettoyage après les tests
    db_fixture.session.query(Tree).delete()
    db_fixture.session.query(Location).delete()
    db_fixture.session.commit()



def test_fetch_type_details_success(client, db_fixture, setup_data):
    """
    Test réussi de la route GET /api/fetch_type avec un type_fr valide.
    """

    payload = {'type': 'Catalpa de lOuest'}
    response = client.get('/api/fetch_type', json=payload)
    assert response.status_code == 200, f"Statut attendu 200, obtenu {response.status_code}"
    
    data = response.get_json()
    assert 'name_en' in data, "La réponse doit contenir 'name_en'."
    assert 'name_la' in data, "La réponse doit contenir 'name_la'."
    assert data['name_en'] == 'Western Catalpa', f"Expected 'Western Catalpa', got {data['name_en']}"
    assert data['name_la'] == 'Catalpa speciosa', f"Expected 'Catalpa speciosa', got {data['name_la']}"


def test_get_arbre_rejet(client, db_fixture, setup_data):
    """
    Test de la route GET /api/arbre_rejet
    """
    response = client.get('/api/arbre_rejet')
    assert response.status_code == 200, f"Statut attendu 200, obtenu {response.status_code}"
    
    data = response.get_json()
    assert isinstance(data, list), "La réponse doit être une liste."
    assert len(data) == 1, f"Nombre d'arbres rejetés attendu 1, obtenu {len(data)}"
    
    assert data[0]['approbation_status'] == 'rejected', "L'arbre retourné doit avoir le statut 'rejected'."


def test_coord_tree_missing_coordinates(client, db_fixture, setup_data):
    """
    Test de la route GET /api/coord_tree/ sans fournir les coordonnées.
    """
    payload = {}
    response = client.get('/api/coord_tree/', json=payload)
    assert response.status_code == 400, f"Statut attendu 400, obtenu {response.status_code}"
    
    data = response.get_json()
    assert data['description'] == "Latitude ou longitude manquante", f"Message d'erreur inattendu: {data['description']}"

def test_coord_tree_invalid_latitude(client, db_fixture, setup_data):
    """
    Test de la route GET /api/coord_tree/ avec une latitude invalide.
    """
    payload = {
        'latitude': '100.0',  # Latitude invalide
        'longitude': '-73.40000'
    }
    response = client.get('/api/coord_tree/', json=payload)
    assert response.status_code == 400, f"Statut attendu 400, obtenu {response.status_code}"
    
    data = response.get_json()
    assert data['description'] == "Latitude invalide.", f"Message d'erreur inattendu: {data['description']}"

def test_coord_tree_invalid_longitude(client, db_fixture, setup_data):
    """
    Test de la route GET /api/coord_tree/ avec une longitude invalide.
    """
    payload = {
        'latitude': '45.70000',
        'longitude': '-200.0'  # Longitude invalide
    }
    response = client.get('/api/coord_tree/', json=payload)
    assert response.status_code == 400, f"Statut attendu 400, obtenu {response.status_code}"
    
    data = response.get_json()
    assert data['description'] == "Longitude invalide.", f"Message d'erreur inattendu: {data['description']}"
