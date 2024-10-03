from app import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class AddTree(db.Model):
    __tablename__ = 'add_tree'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    latitude = db.Column(db.Numeric(9,6), nullable=False)
    longitude = db.Column(db.Numeric(9,6), nullable=False)

    date_releve = db.Column(db.Date, nullable=False)

    # flask_app_history