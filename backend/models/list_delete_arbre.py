from app import db


class ListDelete(db.Model):
    __tablename__ = 'list_delete'
    no_emp = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
