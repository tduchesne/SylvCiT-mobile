# backend/tests/test_delete_tree.py

import pytest
from app import create_app, db
from models import Tree, Location, Type, Genre, Family, FunctionalGroup
from datetime import datetime

@pytest.fixture(scope='function')
def setup_data(db_fixture):
    """
    Fixture to set up initial data needed for the tests.
    """
    functional_group1 = FunctionalGroup(
        group='1A',
        description='Shade-tolerant conifers.'
    )
    functional_group2 = FunctionalGroup(
        group='1B',
        description='Sun-loving conifers.'
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

    db_fixture.session.query(Tree).delete()
    db_fixture.session.query(Location).delete()
    db_fixture.session.commit()


def test_modifier_arbre_success(client, db_fixture, setup_data):
    """
    Test successful modification of a tree.
    """
    tree = Tree.query.first()
    assert tree is not None, "No tree found in the database."

    tree_id = tree.id_tree
    payload = {
        "dhp": 20,
        "details_url": "http://example.com/new_details",
        "image_url": "http://example.com/new_image.jpg",
        "date_measure": "2023-11-01",
        "date_plantation": "2022-06-15",
        "location": {
            "latitude": "45.80000",
            "longitude": "-73.40000"
        },
        "type": {
            "name_fr": "Nouvelle Espèce",
            "name_en": "New Species",
            "name_la": "Species nova"
        },
        "family": {
            "name": "NewFamily"
        },
        "genre": {
            "name": "NewGenre"
        },
        "functional_group": {
            "group": "2A",
            "description": "New functional group description."
        }
    }

    response = client.post(f'/api/modifier_arbre/{tree_id}', json=payload)
    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"

    data = response.get_json()
    assert data['message'] == "Arbre modifié avec succès", f"Unexpected message: {data['message']}"

    updated_tree = Tree.query.get(tree_id)
    assert updated_tree.dhp == 20, f"DHP not updated correctly, expected 20, got {updated_tree.dhp}"
    assert updated_tree.details_url == payload['details_url'], "Details URL not updated correctly."
    assert updated_tree.image_url == payload['image_url'], "Image URL not updated correctly."
    assert str(updated_tree.date_measure) == payload['date_measure'], "Date measure not updated correctly."
    assert str(updated_tree.date_plantation) == payload['date_plantation'], "Date plantation not updated correctly."

    assert float(updated_tree.location.latitude) == pytest.approx(float(payload['location']['latitude'])), "Latitude not updated correctly."
    assert float(updated_tree.location.longitude) == pytest.approx(float(payload['location']['longitude'])), "Longitude not updated correctly."

    assert updated_tree.type.name_fr == payload['type']['name_fr'], "Type not updated correctly."
    assert updated_tree.family.name == payload['family']['name'], "Family not updated correctly."
    assert updated_tree.genre.name == payload['genre']['name'], "Genre not updated correctly."
    assert updated_tree.functional_group.group == payload['functional_group']['group'], "Functional group not updated correctly."

def test_modifier_arbre_not_found(client, db_fixture, setup_data):
    """
    Test modifying a non-existent tree.
    """
    non_existent_id = 9999
    payload = {
        "dhp": 20
    }

    response = client.post(f'/api/modifier_arbre/{non_existent_id}', json=payload)
    assert response.status_code == 404, f"Expected status 404, got {response.status_code}"

    data = response.get_json()
    assert data['message'] == "Arbre introuvable", f"Unexpected message: {data['message']}"

def test_modifier_arbre_invalid_dhp(client, db_fixture, setup_data):
    """
    Test modifying a tree with invalid 'dhp' value (non-integer).
    """
    tree = Tree.query.first()
    assert tree is not None, "No tree found in the database."

    tree_id = tree.id_tree

    payload = {
        "dhp": "invalid_dhp"
    }

    response = client.post(f'/api/modifier_arbre/{tree_id}', json=payload)
    assert response.status_code == 400, f"Expected status 400, got {response.status_code}"

    data = response.get_json()
    expected_error = "Le champ 'dhp' doit être un entier."
    assert data['message'] == expected_error, f"Unexpected message: {data['message']}"

def test_modifier_arbre_invalid_date_measure(client, db_fixture, setup_data):
    """
    Test modifying a tree with invalid 'date_measure' format.
    """
    tree = Tree.query.first()
    assert tree is not None, "No tree found in the database."

    tree_id = tree.id_tree

    payload = {
        "date_measure": "invalid_date"
    }

    response = client.post(f'/api/modifier_arbre/{tree_id}', json=payload)
    assert response.status_code == 400, f"Expected status 400, got {response.status_code}"

    data = response.get_json()
    expected_error = "Le format de la date relevé est invalide. Utilisez YYYY-MM-DD."
    assert data['message'] == expected_error, f"Unexpected message: {data['message']}"

def test_modifier_arbre_invalid_date_plantation(client, db_fixture, setup_data):
    """
    Test modifying a tree with invalid 'date_plantation' format.
    """
    tree = Tree.query.first()
    assert tree is not None, "No tree found in the database."

    tree_id = tree.id_tree

    payload = {
        "date_plantation": "invalid_date"
    }

    response = client.post(f'/api/modifier_arbre/{tree_id}', json=payload)
    assert response.status_code == 400, f"Expected status 400, got {response.status_code}"

    data = response.get_json()
    expected_error = "Le format de la date de plantation est invalide. Utilisez YYYY-MM-DD."
    assert data['message'] == expected_error, f"Unexpected message: {data['message']}"

def test_modifier_arbre_invalid_location(client, db_fixture, setup_data):
    """
    Test modifying a tree with invalid location data (missing latitude or longitude).
    """
    tree = Tree.query.first()
    assert tree is not None, "No tree found in the database."

    tree_id = tree.id_tree

    payload = {
        "location": {
            "latitude": "45.80000"
        }
    }

    response = client.post(f'/api/modifier_arbre/{tree_id}', json=payload)
    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"

    updated_tree = Tree.query.get(tree_id)
    assert updated_tree.location.latitude == tree.location.latitude, "Latitude should not have changed."
    assert updated_tree.location.longitude == tree.location.longitude, "Longitude should not have changed."

def test_modifier_arbre_partial_update(client, db_fixture, setup_data):
    """
    Test modifying a tree with partial data (only updating some fields).
    """
    tree = Tree.query.first()
    assert tree is not None, "No tree found in the database."

    tree_id = tree.id_tree
    payload = {
        "dhp": 25,
        "details_url": "http://example.com/updated_details"
    }

    response = client.post(f'/api/modifier_arbre/{tree_id}', json=payload)
    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"

    updated_tree = Tree.query.get(tree_id)
    assert updated_tree.dhp == 25, f"DHP not updated correctly, expected 25, got {updated_tree.dhp}"
    assert updated_tree.details_url == payload['details_url'], "Details URL not updated correctly."
    assert updated_tree.image_url == tree.image_url, "Image URL should not have changed."
    assert updated_tree.date_measure == tree.date_measure, "Date measure should not have changed."

def test_modifier_arbre_invalid_type(client, db_fixture, setup_data):
    """
    Test modifying a tree with invalid type data (missing 'name_fr').
    """
    tree = Tree.query.first()
    assert tree is not None, "No tree found in the database."

    tree_id = tree.id_tree

    payload = {
        "type": {
            "name_en": "New Species",
            "name_la": "Species nova"
            # Missing 'name_fr'
        }
    }

    response = client.post(f'/api/modifier_arbre/{tree_id}', json=payload)
    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"

    updated_tree = Tree.query.get(tree_id)
    assert updated_tree.type.name_fr == tree.type.name_fr, "Type should not have changed."

def test_modifier_arbre_exception_handling(client, db_fixture, setup_data, mocker):
    """
    Test that an internal server error is handled properly.
    """
    tree = Tree.query.first()
    assert tree is not None, "No tree found in the database."
    tree_id = tree.id_tree

    mocker.patch('app.db.session.commit', side_effect=Exception('Database error'))

    payload = {
        "dhp": 30
    }

    response = client.post(f'/api/modifier_arbre/{tree_id}', json=payload)
    assert response.status_code == 500, f"Expected status 500, got {response.status_code}"

    data = response.get_json()
    assert data['message'] == "Erreur interne du serveur", f"Unexpected message: {data['message']}"
