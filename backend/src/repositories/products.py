from typing import Optional
from src.config import get_db_connection

def _map_product_row(row):
    return {
        "id": row[0],
        "name": row[1],
        "category": row[2],
        "price": float(row[3]),
        "stock": row[4],
        "image_url": row[5]
    }

def find_all(category: Optional[str] = None):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            if category:
                cursor.execute(
                    "SELECT id, name, category, price, stock, image_url FROM products WHERE category = %s ORDER BY id;",
                    (category,)
                )
            else:
                cursor.execute(
                    "SELECT id, name, category, price, stock, image_url FROM products ORDER BY id;"
                )
            rows = cursor.fetchall()
            return [_map_product_row(row) for row in rows]

def find_by_id(product_id: int):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, category, price, stock, image_url FROM products WHERE id = %s;",
                (product_id,)
            )
            row = cursor.fetchone()
            if row:
                return _map_product_row(row)
            return None
