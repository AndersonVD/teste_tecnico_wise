from typing import Optional
from src.repositories import products as product_repo

def get_all_products(category: Optional[str] = None):
    return product_repo.find_all(category)

def get_product_by_id(product_id: int):
    return product_repo.find_by_id(product_id)
