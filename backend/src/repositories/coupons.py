from src.config import get_db_connection

def get_active_coupon_by_code(code: str):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT id, code, discount_type, discount_value 
                FROM coupons 
                WHERE code = %s AND active = TRUE AND expires_at > NOW();
            """, (code,))
            row = cursor.fetchone()
            if row:
                return {
                    "id": row[0],
                    "code": row[1],
                    "discount_type": row[2],
                    "discount_value": float(row[3])
                }
            return None
