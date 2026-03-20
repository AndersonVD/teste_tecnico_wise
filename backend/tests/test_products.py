import pytest
from unittest.mock import patch, MagicMock
from src.services import products as product_service

@patch('src.repositories.products.get_db_connection')
def test_get_all_products(mock_get_db_connection):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_get_db_connection.return_value.__enter__.return_value = mock_conn
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

    mock_cursor.fetchall.return_value = [
        (1, "Camiseta", "roupas", 49.90, 15, None),
        (2, "Calca", "roupas", 99.90, 5, None)
    ]

    products = product_service.get_all_products()

    assert len(products) == 2
    assert products[0]["id"] == 1
    assert products[0]["name"] == "Camiseta"
    assert products[0]["price"] == 49.90

@patch('src.repositories.products.get_db_connection')
def test_get_all_products_by_category(mock_get_db_connection):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_get_db_connection.return_value.__enter__.return_value = mock_conn
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

    mock_cursor.fetchall.return_value = [
        (1, "Camiseta", "roupas", 49.90, 15, None)
    ]

    products = product_service.get_all_products("roupas")

    assert len(products) == 1
    mock_cursor.execute.assert_called_with(
        "SELECT id, name, category, price, stock, image_url FROM products WHERE category = %s ORDER BY id;",
        ("roupas",)
    )

@patch('src.repositories.products.get_db_connection')
def test_get_product_by_id(mock_get_db_connection):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_get_db_connection.return_value.__enter__.return_value = mock_conn
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

    mock_cursor.fetchone.return_value = (1, "Camiseta", "roupas", 49.90, 15, None)

    product = product_service.get_product_by_id(1)

    assert product["id"] == 1
    assert product["name"] == "Camiseta"

@patch('src.repositories.products.get_db_connection')
def test_get_product_by_id_not_found(mock_get_db_connection):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_get_db_connection.return_value.__enter__.return_value = mock_conn
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

    mock_cursor.fetchone.return_value = None

    product = product_service.get_product_by_id(999)

    assert product is None
