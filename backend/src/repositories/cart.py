from src.config import get_db_connection

def get_all_cart_items():
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    c.id, c.product_id, c.quantity, 
                    p.name, p.price, p.image_url, p.stock
                FROM cart_items c
                JOIN products p ON c.product_id = p.id
                ORDER BY c.id;
            """)
            rows = cursor.fetchall()
            return [
                {
                    "id": row[0],
                    "product_id": row[1],
                    "quantity": row[2],
                    "product_name": row[3],
                    "unit_price": float(row[4]),
                    "image_url": row[5],
                    "stock": row[6],
                    "subtotal": float(row[4]) * row[2]
                }
                for row in rows
            ]

def find_item_by_product_id(product_id: int):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, product_id, quantity FROM cart_items WHERE product_id = %s;",
                (product_id,)
            )
            row = cursor.fetchone()
            if row:
                return {
                    "id": row[0],
                    "product_id": row[1],
                    "quantity": row[2]
                }
            return None

def find_item_by_id(item_id: int):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, product_id, quantity FROM cart_items WHERE id = %s;",
                (item_id,)
            )
            row = cursor.fetchone()
            if row:
                return {
                    "id": row[0],
                    "product_id": row[1],
                    "quantity": row[2]
                }
            return None

def add_item(product_id: int, quantity: int):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO cart_items (product_id, quantity) VALUES (%s, %s);",
                (product_id, quantity)
            )
        conn.commit()

def update_quantity(item_id: int, quantity: int):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE cart_items SET quantity = %s WHERE id = %s;",
                (quantity, item_id)
            )
        conn.commit()

def delete_item(item_id: int):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "DELETE FROM cart_items WHERE id = %s;",
                (item_id,)
            )
        conn.commit()

def clear_cart():
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM cart_items;")
        conn.commit()
