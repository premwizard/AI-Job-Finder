"""add skills fields

Revision ID: daeff2953928
Revises: 2acecf9180f1
Create Date: 2026-07-18 00:15:22.992656

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'daeff2953928'
down_revision: Union[str, Sequence[str], None] = '2acecf9180f1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('skills', schema=None) as batch_op:
        batch_op.add_column(sa.Column('last_used', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('currently_using', sa.Boolean(), default=False, nullable=True))
        batch_op.add_column(sa.Column('featured_skill', sa.Boolean(), default=False, nullable=True))
        batch_op.add_column(sa.Column('verified', sa.Boolean(), default=False, nullable=True))
        batch_op.add_column(sa.Column('ai_skill_confidence', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('resume_extracted', sa.Boolean(), default=False, nullable=True))
        batch_op.add_column(sa.Column('job_required', sa.Boolean(), default=False, nullable=True))
        batch_op.add_column(sa.Column('skill_gap', sa.Boolean(), default=False, nullable=True))
        batch_op.add_column(sa.Column('learning_priority', sa.String(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table('skills', schema=None) as batch_op:
        batch_op.drop_column('learning_priority')
        batch_op.drop_column('skill_gap')
        batch_op.drop_column('job_required')
        batch_op.drop_column('resume_extracted')
        batch_op.drop_column('ai_skill_confidence')
        batch_op.drop_column('verified')
        batch_op.drop_column('featured_skill')
        batch_op.drop_column('currently_using')
        batch_op.drop_column('last_used')
