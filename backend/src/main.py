from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config import init_db_pool, close_db_pool

from src.routes.products import router as products_router
from src.routes.cart import router as cart_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db_pool()
    yield
    # Shutdown
    close_db_pool()


app = FastAPI(title="Wise Sales E-commerce API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router, prefix="/products")
app.include_router(cart_router, prefix="/cart")
