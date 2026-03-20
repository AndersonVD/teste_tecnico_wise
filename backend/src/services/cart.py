from src.repositories import cart as cart_repo
from src.repositories import products as product_repo
from src.repositories import coupons as coupon_repo


_active_coupon_code = None

def get_cart_summary():
    items = cart_repo.get_all_cart_items()
    
    total = sum(item["subtotal"] for item in items)
    discount = 0.0
    
    global _active_coupon_code
    if _active_coupon_code:
        coupon = coupon_repo.get_active_coupon_by_code(_active_coupon_code)
        if not coupon:
            _active_coupon_code = None # clear no cupom inválido
        else:
            if coupon["discount_type"] == "percentage":
                discount = total * (coupon["discount_value"] / 100.0)
            else:
                discount = coupon["discount_value"]
    
    final_total = max(0.0, total - discount)
    
    return {
        "items": items,
        "total": total,
        "discount": discount,
        "final_total": final_total,
        "applied_coupon": _active_coupon_code
    }

def add_item(product_id: int, quantity: int):
    if quantity <= 0:
        raise ValueError("Quantidade inválida")
        
    product = product_repo.find_by_id(product_id)
    if not product:
        raise ValueError("Produto não encontrado")
        
    existing_item = cart_repo.find_item_by_product_id(product_id)
    
    if existing_item:
        new_quantity = existing_item["quantity"] + quantity
        if new_quantity > product["stock"]:
            raise ValueError("Sem estoque")
        cart_repo.update_quantity(existing_item["id"], new_quantity)
    else:
        if quantity > product["stock"]:
            raise ValueError("Sem estoque")
        cart_repo.add_item(product_id, quantity)

def update_item(item_id: int, quantity: int):
    if quantity < 0:
        raise ValueError("Quantidade inválida")
        
    if quantity == 0:
        remove_item(item_id)
        return
        
    item = cart_repo.find_item_by_id(item_id)
    if not item:
        raise ValueError("Item do carrinho não encontrado")
        
    product = product_repo.find_by_id(item["product_id"])
    if quantity > product["stock"]:
        raise ValueError("Sem estoque")
        
    cart_repo.update_quantity(item_id, quantity)

def remove_item(item_id: int):
    cart_repo.delete_item(item_id)

def apply_coupon(code: str):
    coupon = coupon_repo.get_active_coupon_by_code(code)
    if not coupon:
        raise ValueError("Cupom inválido ou expirado")
        
    global _active_coupon_code
    _active_coupon_code = code

def reset_coupon():
    global _active_coupon_code
    _active_coupon_code = None
