import pytest
from unittest.mock import patch
from src.services import cart as cart_service

@pytest.fixture(autouse=True)
def reset_coupon():
    cart_service.reset_coupon()
    yield

@patch('src.repositories.cart.get_db_connection')
@patch('src.repositories.coupons.get_db_connection')
def test_get_cart_summary(mock_coupon_db, mock_cart_db):
    mock_cart_conn = mock_cart_db.return_value.__enter__.return_value
    mock_cart_cursor = mock_cart_conn.cursor.return_value.__enter__.return_value
    
    # 2 items in cart: 2 unit of P1($50), 1 unit of P2($100) -> subtotal $200
    mock_cart_cursor.fetchall.return_value = [
        (1, 1, 2, "Camiseta", 50.0, None, 10),
        (2, 2, 1, "Calca",   100.0, None, 5)
    ]
    
    summary = cart_service.get_cart_summary()
    assert len(summary["items"]) == 2
    assert summary["total"] == 200.0
    assert summary["discount"] == 0.0
    assert summary["final_total"] == 200.0

@patch('src.repositories.products.find_by_id')
@patch('src.repositories.cart.find_item_by_product_id')
@patch('src.repositories.cart.add_item')
def test_add_item_new(mock_add_item, mock_find_cart, mock_find_product):
    mock_find_product.return_value = {"id": 1, "stock": 5}
    mock_find_cart.return_value = None
    
    cart_service.add_item(1, 2)
    mock_add_item.assert_called_once_with(1, 2)

@patch('src.repositories.products.find_by_id')
@patch('src.repositories.cart.find_item_by_product_id')
def test_add_item_insufficient_stock(mock_find_cart, mock_find_product):
    mock_find_product.return_value = {"id": 1, "stock": 2}
    mock_find_cart.return_value = None
    
    with pytest.raises(ValueError, match="Sem estoque"):
        cart_service.add_item(1, 5)

@patch('src.repositories.products.find_by_id')
@patch('src.repositories.cart.find_item_by_id')
@patch('src.repositories.cart.update_quantity')
def test_update_item(mock_update, mock_find_item, mock_find_product):
    mock_find_item.return_value = {"id": 1, "product_id": 1, "quantity": 1}
    mock_find_product.return_value = {"id": 1, "stock": 5}
    
    cart_service.update_item(1, 3)
    mock_update.assert_called_once_with(1, 3)

@patch('src.repositories.cart.find_item_by_id')
@patch('src.repositories.cart.delete_item')
def test_update_item_zero_quantity(mock_delete, mock_find_item):
    cart_service.update_item(1, 0)
    mock_delete.assert_called_once_with(1)

@patch('src.repositories.coupons.get_active_coupon_by_code')
def test_apply_coupon_success(mock_get_coupon):
    mock_get_coupon.return_value = {"id": 1, "code": "DESCONTO10", "discount_type": "percentage", "discount_value": 10}
    cart_service.apply_coupon("DESCONTO10")
    assert cart_service._active_coupon_code == "DESCONTO10"

@patch('src.repositories.coupons.get_active_coupon_by_code')
def test_apply_coupon_invalid(mock_get_coupon):
    mock_get_coupon.return_value = None
    with pytest.raises(ValueError, match="Cupom inválido ou expirado"):
        cart_service.apply_coupon("INVALID")
