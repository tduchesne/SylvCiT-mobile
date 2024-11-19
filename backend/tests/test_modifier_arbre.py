# backend/tests/test_modifier_arbre.py

from datetime import datetime
from app import db, create_app
from models import Tree, TreeRue, TreeHorsRue, Essence, Arrondissement
import pytest

"""
    TODO: verify the response content (is not working well beccause of the table Essence and Arrondissement)
"""

@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_modifier_arbre_success(client):
    with client.application.app_context():
        essence = Essence(
            sigle="TESTSIGLE",
            la="Testus Latinus",
            en="Test English",
            fr="Test Français"
        )
        arrondissement = Arrondissement(
            no_arrondissement=1,
            nom_arrondissement="Exemple"
        )
        db.session.add(essence)
        db.session.add(arrondissement)
        db.session.commit()

        # add an initial tree to modify
        tree = TreeHorsRue(
            no_emp=12345,
            no_arrondissement=1,
            emplacement="parterre gazonné",
            # sigle="TESTSIGLE",
            dhp=10,
            date_measure=datetime.strptime("2024-10-01", "%Y-%m-%d").date(),
            date_plantation=datetime.strptime("2020-01-01", "%Y-%m-%d").date(),
            latitude=47.123456,
            longitude=12.123456,
            inv_type="H",
            is_valid=True
        )
        db.session.add(tree)
        db.session.commit()

    # data to modify the tree
    modified_data = {
        "no_emp": 12345,
        "no_arrondissement": 1,
        "emplacement": "banquette gazonnée",
        # "sigle": "TESTSIGLE",
        "dhp": 15,
        "date_releve": "2024-10-01",
        "date_plantation": "2021-01-01",
        "latitude": 48.123456,
        "longitude": 13.123456,
        "inv_type": "H",
        "is_valid": False
    }

   
    response = client.post('/api/modifier_arbre/12345', json=modified_data)
    assert response.status_code == 200

    
    # verify the response content
    data = response.get_json()
    

    expected_output = {
        "arrondissement": {
            "name": "Exemple",
            "no_arrondissement": 1
        },
        "code_parc": None,
        "code_secteur": None,
        "date_releve": "2024-10-01",
        "date_plantation": "2021-01-01",
        "dhp": 15,
        "emplacement": "banquette gazonnée",
        "inv_type": "H",
        "is_valid": False,
        "latitude": "48.12345599999999735",
        "longitude": "13.12345599999999912",
        "no_emp": 12345,
        # "sigle": "TESTSIGLE"
    }

    # comapre the response data with the expected data
    for key, value in expected_output.items():
        assert key in data, f"Le champ '{key}' est manquant dans la réponse."
        if key == "arrondissement":
            if isinstance(data[key], dict):
                assert data[key]["name"] == value["name"], f"Mismatch pour 'name': attendu '{value['name']}', obtenu '{data[key]['name']}'"
                assert data[key]["no_arrondissement"] == value["no_arrondissement"], f"Mismatch pour 'no_arrondissement': attendu '{value['no_arrondissement']}', obtenu '{data[key]['no_arrondissement']}'"
            elif data[key] is None:
                assert value is None, f"Mismatch pour 'arrondissement': attendu '{value}', obtenu '{data[key]}'"
            else:
                raise AssertionError(f"Type inattendu pour 'arrondissement': {type(data[key])}")
        else:
            assert data[key] == value, f"Mismatch pour '{key}': attendu '{value}', obtenu '{data[key]}'"

    # verify the data in the database is updated
    with client.application.app_context():
        modified_tree = Tree.query.filter_by(no_emp=12345).first()
        assert modified_tree is not None
        assert isinstance(modified_tree, TreeHorsRue) 
        assert modified_tree.emplacement == modified_data["emplacement"]
        assert modified_tree.dhp == modified_data["dhp"]
        assert modified_tree.date_measure.isoformat() == modified_data["date_releve"]
        assert modified_tree.date_plantation.isoformat() == modified_data["date_plantation"]
        assert float(modified_tree.latitude) == modified_data["latitude"]
        assert float(modified_tree.longitude) == modified_data["longitude"]
        assert modified_tree.inv_type == modified_data["inv_type"]
        assert modified_tree.is_valid == modified_data["is_valid"]
        assert modified_tree.code_parc is None
        assert modified_tree.code_secteur is None

