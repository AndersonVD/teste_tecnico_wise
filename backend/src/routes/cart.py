from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from src.services import cart as cart_service

router = APIRouter()

class AddCartItem(BaseModel):
    product_id: int
    quantity: int

class UpdateCartItem(BaseModel):
    quantity: int

class ApplyCoupon(BaseModel):
    code: str

@router.get("", tags=["cart"])
def get_cart():
    return cart_service.get_cart_summary()

@router.post("/items", tags=["cart"])
def add_to_cart(item: AddCartItem):
    try:
        cart_service.add_item(item.product_id, item.quantity)
        return {"message": "Item adicionado com sucesso!"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/items/{item_id}", tags=["cart"])
def update_cart_item(item_id: int, item: UpdateCartItem):
    try:
        cart_service.update_item(item_id, item.quantity)
        return {"message": "Item atualizado com sucesso!"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/items/{item_id}", tags=["cart"])
def delete_cart_item(item_id: int):
    cart_service.remove_item(item_id)
    return {"message": "Item removido com sucesso!"}

@router.post("/coupon", tags=["coupon"])
def apply_coupon(coupon: ApplyCoupon):
    try:
        cart_service.apply_coupon(coupon.code)
        return {"message": "Cupom aplicado com sucesso!"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
