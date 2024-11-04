"""Re-create migration

Revision ID: d6d8c2fb96d9
Revises: 2de16e82bd44
Create Date: 2024-11-04 13:39:13.084161

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'd6d8c2fb96d9'
down_revision = '2de16e82bd44'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('add_tree',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('no_emp', sa.Integer(), nullable=True),
    sa.Column('adresse', sa.String(length=45), nullable=True),
    sa.Column('essence_latin', sa.String(length=45), nullable=True),
    sa.Column('essence_ang', sa.String(length=45), nullable=True),
    sa.Column('essence_fr', sa.String(length=45), nullable=True),
    sa.Column('dhp', sa.Integer(), nullable=True),
    sa.Column('date_plantation', sa.Date(), nullable=True),
    sa.Column('date_releve', sa.Date(), nullable=False),
    sa.Column('latitude', sa.Numeric(precision=11, scale=8), nullable=False),
    sa.Column('longitude', sa.Numeric(precision=11, scale=8), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('id'),
    schema='inm5151_db'
    )
    op.create_table('nom_tree',
    sa.Column('essence_latin', sa.String(length=45), nullable=False),
    sa.Column('sigle', sa.String(length=45), nullable=False),
    sa.Column('essence_fr', sa.String(length=45), nullable=False),
    sa.Column('essence_en', sa.String(length=45), nullable=False),
    sa.PrimaryKeyConstraint('essence_latin'),
    schema='inm5151_db'
    )
    op.create_table('tree_search',
    sa.Column('no_emp', sa.Integer(), nullable=False),
    sa.Column('arrondissement', sa.String(length=45), nullable=False),
    sa.Column('emplacement', sa.Enum('Banquette gazonnée', 'Banquette Asphaltée', 'Fond de trottoir', 'Parc', 'Parterre Gazonné', 'Parterre Asphalté', 'Parterre', 'Terre plein', 'Trottoir entre autres', name='emplacement_tree'), nullable=False),
    sa.Column('essence_latin', sa.String(length=45), nullable=False),
    sa.Column('dhp', sa.Integer(), nullable=False),
    sa.Column('date_releve', sa.Date(), nullable=False),
    sa.Column('date_plantation', sa.Date(), nullable=True),
    sa.Column('longitude', sa.Numeric(precision=11, scale=8), nullable=False),
    sa.Column('latitude', sa.Numeric(precision=11, scale=8), nullable=False),
    sa.Column('inv_type', sa.Enum('R', 'H', name='inv_type_tree'), nullable=False),
    sa.ForeignKeyConstraint(['essence_latin'], ['inm5151_db.nom_tree.essence_latin'], ),
    sa.PrimaryKeyConstraint('no_emp'),
    sa.UniqueConstraint('no_emp'),
    schema='inm5151_db'
    )
    with op.batch_alter_table('tree_search', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_inm5151_db_tree_search_essence_latin'), ['essence_latin'], unique=False)

    op.create_table('tree_hors_rue',
    sa.Column('no_emp', sa.Integer(), nullable=False),
    sa.Column('nom_parc', sa.String(length=45), nullable=False),
    sa.Column('nom_secteur', sa.String(length=45), nullable=False),
    sa.ForeignKeyConstraint(['no_emp'], ['inm5151_db.tree_search.no_emp'], ),
    sa.PrimaryKeyConstraint('no_emp'),
    schema='inm5151_db'
    )
    op.create_table('tree_rue',
    sa.Column('no_emp', sa.Integer(), nullable=False),
    sa.Column('no_civique', sa.Integer(), nullable=False),
    sa.Column('nom_rue', sa.String(length=45), nullable=False),
    sa.Column('cote', sa.Enum('N', 'S', 'E', 'O'), nullable=True),
    sa.Column('localisation', sa.String(length=45), nullable=False),
    sa.Column('rue_de', sa.String(length=45), nullable=False),
    sa.Column('rue_a', sa.String(length=45), nullable=False),
    sa.Column('distance_pave', sa.Float(), nullable=False),
    sa.Column('distance_ligne_rue', sa.Float(), nullable=False),
    sa.Column('stationnement_heure', sa.Time(), nullable=False),
    sa.ForeignKeyConstraint(['no_emp'], ['inm5151_db.tree_search.no_emp'], ),
    sa.PrimaryKeyConstraint('no_emp'),
    schema='inm5151_db'
    )
    op.drop_table('functional_group')
    op.drop_table('location')
    op.drop_table('genre')
    op.drop_table('family')
    op.drop_table('type')
    with op.batch_alter_table('tree', schema=None) as batch_op:
        batch_op.drop_index('fk_tree_family_idx')
        batch_op.drop_index('fk_tree_functional_group_idx')
        batch_op.drop_index('fk_tree_genre_idx')
        batch_op.drop_index('fk_tree_id_location_idx')
        batch_op.drop_index('fk_tree_type_idx')

    op.drop_table('tree')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tree',
    sa.Column('id_tree', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('date_plantation', sa.DATE(), nullable=False),
    sa.Column('date_measure', sa.DATE(), nullable=False),
    sa.Column('details_url', mysql.VARCHAR(length=150), nullable=True),
    sa.Column('id_type', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('id_genre', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('id_family', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('id_functional_group', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('id_location', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['id_family'], ['family.id_family'], name='fk_tree_family'),
    sa.ForeignKeyConstraint(['id_functional_group'], ['functional_group.id_functional_group'], name='fk_tree_functional_group'),
    sa.ForeignKeyConstraint(['id_genre'], ['genre.id_genre'], name='fk_tree_genre'),
    sa.ForeignKeyConstraint(['id_location'], ['location.id_location'], name='fk_tree_id_location'),
    sa.ForeignKeyConstraint(['id_type'], ['type.id_type'], name='fk_tree_type'),
    sa.PrimaryKeyConstraint('id_tree'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    with op.batch_alter_table('tree', schema=None) as batch_op:
        batch_op.create_index('fk_tree_type_idx', ['id_type'], unique=False)
        batch_op.create_index('fk_tree_id_location_idx', ['id_location'], unique=False)
        batch_op.create_index('fk_tree_genre_idx', ['id_genre'], unique=False)
        batch_op.create_index('fk_tree_functional_group_idx', ['id_functional_group'], unique=False)
        batch_op.create_index('fk_tree_family_idx', ['id_family'], unique=False)

    op.create_table('type',
    sa.Column('id_type', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name_fr', mysql.VARCHAR(length=100), nullable=True),
    sa.Column('name_en', mysql.VARCHAR(length=100), nullable=True),
    sa.Column('name_la', mysql.VARCHAR(length=100), nullable=True),
    sa.PrimaryKeyConstraint('id_type'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('family',
    sa.Column('id_family', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', mysql.VARCHAR(length=45), nullable=True),
    sa.PrimaryKeyConstraint('id_family'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('genre',
    sa.Column('id_genre', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', mysql.VARCHAR(length=45), nullable=True),
    sa.PrimaryKeyConstraint('id_genre'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('location',
    sa.Column('id_location', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('latitude', mysql.VARCHAR(length=45), nullable=False),
    sa.Column('longitude', mysql.VARCHAR(length=45), nullable=False),
    sa.PrimaryKeyConstraint('id_location'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('functional_group',
    sa.Column('id_functional_group', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('group', mysql.VARCHAR(length=2), nullable=True),
    sa.Column('description', mysql.VARCHAR(length=250), nullable=True),
    sa.PrimaryKeyConstraint('id_functional_group'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.drop_table('tree_rue', schema='inm5151_db')
    op.drop_table('tree_hors_rue', schema='inm5151_db')
    with op.batch_alter_table('tree_search', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_inm5151_db_tree_search_essence_latin'))

    op.drop_table('tree_search', schema='inm5151_db')
    op.drop_table('nom_tree', schema='inm5151_db')
    op.drop_table('add_tree', schema='inm5151_db')
    # ### end Alembic commands ###
