"""add personal info fields

Revision ID: a25dad7a1d99
Revises: daeff2953928
Create Date: 2026-07-18 00:25:54.935686

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a25dad7a1d99'
down_revision: Union[str, Sequence[str], None] = 'daeff2953928'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('user_profiles', schema=None) as batch_op:
        batch_op.add_column(sa.Column('middle_name', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('preferred_name', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('alternate_phone_number', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('date_of_birth', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('gender', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('postal_code', sa.String(), nullable=True))

def downgrade() -> None:
    with op.batch_alter_table('user_profiles', schema=None) as batch_op:
        batch_op.drop_column('postal_code')
        batch_op.drop_column('gender')
        batch_op.drop_column('date_of_birth')
        batch_op.drop_column('alternate_phone_number')
        batch_op.drop_column('preferred_name')
        batch_op.drop_column('middle_name')
