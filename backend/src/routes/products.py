from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from src.services import products as product_service

router = APIRouter()

class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    price: float
    stock: int
    image_url: Optional[str]

@router.get("", response_model=list[ProductResponse], tags=["products"])
def get_products(category: Optional[str] = None):
    products = product_service.get_all_products(category)
    return products

@router.get("/{product_id}", response_model=ProductResponse, tags=["products"])
def get_product(product_id: int):
    product = product_service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return product
