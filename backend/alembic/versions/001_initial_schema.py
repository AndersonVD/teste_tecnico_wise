"""initial_schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2024-03-16 00:00:00

"""
from typing import Sequence, Union
from alembic import op

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(50) NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0,
            image_url VARCHAR(500),
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS coupons (
            id SERIAL PRIMARY KEY,
            code VARCHAR(50) UNIQUE NOT NULL,
            discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
            discount_value NUMERIC(10, 2) NOT NULL,
            active BOOLEAN DEFAULT TRUE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS cart_items (
            id SERIAL PRIMARY KEY,
            product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
            quantity INTEGER NOT NULL CHECK (quantity > 0),
            created_at TIMESTAMP DEFAULT NOW()
        );
    """)

def downgrade() -> None:
    op.execute("""
        DROP TABLE IF EXISTS cart_items CASCADE;
        DROP TABLE IF EXISTS coupons CASCADE;
        DROP TABLE IF EXISTS products CASCADE;
    """)
