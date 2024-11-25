import pytest
from app import app

@pytest.fixture
def client():
    """Fixture pour créer un client de test"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client
        # backend/tests/conftest.py

import pytest
from app import create_app, db
from sqlalchemy import event
from sqlalchemy.engine import Engine
from models import Tree, Location, Type, Genre, Family, FunctionalGroup

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

@pytest.fixture(scope='session')
def app():
    app = create_app('testing')
    with app.app_context():
        yield app

@pytest.fixture(scope='session')
def client(app):
    return app.test_client()

@pytest.fixture(scope='session')
def db_fixture(app):
    db.create_all()
    yield db
    db.drop_all()

@pytest.fixture(scope='function')
def init_database(db_fixture):
    from models import Type, Genre, Family, FunctionalGroup
    functional_group = FunctionalGroup(
        group='1A',
        description='Conifères généralement tolérants à l’ombre, mais pas à la sécheresse ou l’inondation.'
    )
    family = Family(name='Sapindaceae')
    genre = Genre(name='Catalpa')
    type_tree = Type(name_fr='Catalpa de lOuest', name_en='Western Catalpa', name_la='Catalpa speciosa')

    db_fixture.session.add_all([functional_group, family, genre, type_tree])
    db_fixture.session.commit()

    yield db_fixture  

    db_fixture.session.query(Tree).delete()
    db_fixture.session.query(Location).delete()
    db_fixture.session.commit()
