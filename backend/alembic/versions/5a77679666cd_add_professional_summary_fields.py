"""add professional summary fields

Revision ID: 5a77679666cd
Revises: a25dad7a1d99
Create Date: 2026-07-18 00:34:18.105077

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5a77679666cd'
down_revision: Union[str, Sequence[str], None] = 'a25dad7a1d99'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('user_profiles', schema=None) as batch_op:
        batch_op.add_column(sa.Column('career_objective', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('years_of_experience_summary', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('key_achievements', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('career_highlights', sa.Text(), nullable=True))

def downgrade() -> None:
    with op.batch_alter_table('user_profiles', schema=None) as batch_op:
        batch_op.drop_column('career_highlights')
        batch_op.drop_column('key_achievements')
        batch_op.drop_column('years_of_experience_summary')
        batch_op.drop_column('career_objective')
