import os
import contextlib
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("DB_USER", "wisesales")
DB_PASSWORD = os.getenv("DB_PASSWORD", "wisesales123")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "wisesales")

# Connection pool
connection_pool = None

def init_db_pool():
    global connection_pool
    if not connection_pool:
        connection_pool = psycopg2.pool.ThreadedConnectionPool(
            minconn=1,
            maxconn=10,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
        )

def close_db_pool():
    global connection_pool
    if connection_pool:
        connection_pool.closeall()


@contextlib.contextmanager
def get_db_connection():
    if not connection_pool:
        init_db_pool()
    conn = connection_pool.getconn()
    try:
        yield conn
    finally:
        connection_pool.putconn(conn)
