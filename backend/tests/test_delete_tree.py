# backend/tests/test_delete_tree.py

import pytest
from app import create_app, db
from models import Tree, Location, Type, Genre, Family, FunctionalGroup
from datetime import datetime

@pytest.fixture(scope='function')
def setup_data(db_fixture):
    """
    Fixture pour configurer des données initiales nécessaires aux tests.
    """
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

def test_demande_suppression_arbre_success(client, db_fixture, setup_data):
    tree = Tree.query.filter(Tree.approbation_status != "rejected").first()
    assert tree is not None, "Aucun arbre trouvé avec approbation_status différent de 'rejected'."
    tree_id = tree.id_tree
    response = client.post(f'/api/demande_suppression/{tree_id}')
    assert response.status_code == 200, f"Statut attendu 200, obtenu {response.status_code}"
    data = response.get_json()
    assert data['message'] == "Demande envoyée", f"Message inattendu: {data['message']}"
    
    # Vérifier que l'arbre a bien été mis à jour dans la base de données
    updated_tree = Tree.query.get(tree_id)
    assert updated_tree.approbation_status == "rejected", "L'arbre n'a pas été mis à jour correctement."

def test_demande_suppression_arbre_not_found(client, db_fixture, setup_data):
    non_existent_id = 9999
    response = client.post(f'/api/demande_suppression/{non_existent_id}')
    assert response.status_code == 400, f"Statut attendu 400, obtenu {response.status_code}"
    
    data = response.get_json()
    assert data['description'] == "message: Arbre non-trouvable", f"Message inattendu: {data['description']}"

def test_demande_suppression_arbre_already_rejected(client, db_fixture, setup_data):
    tree = Tree.query.filter_by(approbation_status="rejected").first()
    assert tree is not None, "Aucun arbre trouvé avec approbation_status 'rejected'."
    
    tree_id = tree.id_tree
    
    response = client.post(f'/api/demande_suppression/{tree_id}')
    assert response.status_code == 400, f"Statut attendu 400, obtenu {response.status_code}"
    
    data = response.get_json()
    assert data['description'] == "message : Demande déja envoyée", f"Message inattendu: {data['description']}"
