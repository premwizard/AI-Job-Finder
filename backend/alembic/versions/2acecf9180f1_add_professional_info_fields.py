"""Add professional info fields

Revision ID: 2acecf9180f1
Revises: eb52dda06d2e
Create Date: 2026-07-17 22:04:22.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2acecf9180f1'
down_revision: Union[str, Sequence[str], None] = 'eb52dda06d2e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add columns to user_profiles
    with op.batch_alter_table('user_profiles', schema=None) as batch_op:
        batch_op.add_column(sa.Column('total_months_of_experience', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('current_annual_salary', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('current_salary_currency', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('salary_type', sa.String(), nullable=True))

    # Add columns to career_preferences
    with op.batch_alter_table('career_preferences', schema=None) as batch_op:
        batch_op.add_column(sa.Column('visa_status', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('relocation_countries', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('preferred_time_zone', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('negotiable_salary', sa.Boolean(), default=False, nullable=True))
        batch_op.add_column(sa.Column('expected_joining_bonus', sa.String(), nullable=True))


def downgrade() -> None:
    # Remove columns from career_preferences
    with op.batch_alter_table('career_preferences', schema=None) as batch_op:
        batch_op.drop_column('expected_joining_bonus')
        batch_op.drop_column('negotiable_salary')
        batch_op.drop_column('preferred_time_zone')
        batch_op.drop_column('relocation_countries')
        batch_op.drop_column('visa_status')

    # Remove columns from user_profiles
    with op.batch_alter_table('user_profiles', schema=None) as batch_op:
        batch_op.drop_column('salary_type')
        batch_op.drop_column('current_salary_currency')
        batch_op.drop_column('current_annual_salary')
        batch_op.drop_column('total_months_of_experience')
