-- Seed SQL — Mini E-commerce Wise Sales
-- Este script roda automaticamente ao subir o PostgreSQL via docker-compose.

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Produtos
-- Estoque variado de propósito: 0 (não pode adicionar), 1-2 (limite baixo), 3+ (normal)
INSERT INTO products (name, category, price, stock, image_url) VALUES
    ('Camiseta Básica Preta',  'roupas',     49.90,  15, 'https://images.tcdn.com.br/img/editor/up/1337243/Basica_Oversized__Preto_02.png'),
    ('Calça Jeans Slim',       'roupas',    129.90,   8, 'https://images.tcdn.com.br/img/img_prod/769517/calca_jeans_hering_slim_31473_1_9af3b631720519dd6813a46ab314ebbe_20250514102115.jpg'),
    ('Tênis Corrida Pro',      'calçados',  299.90,   3, 'https://assets.adidas.com/images/w_600,f_auto,q_auto/fb4c28cdca314d488ef5013fed683e16_9366/Tenis_Corrida_Runfalcon_5_Preto_JJ7823_01_00_standard.jpg'),
    ('Mochila Notebook 15"',   'acessórios', 89.90,   0, 'https://mirei.com.br/cdn/shop/products/Mochila-Escolar-Faculdade_6.jpg?v=1748367777'),
    ('Boné Esportivo',         'acessórios', 39.90,   2, 'https://m.media-amazon.com/images/I/21YVNPVXGqS._AC_SY350_.jpg'),
    ('Jaqueta Corta-Vento',    'roupas',    179.90,   1, 'https://cdn.sistemawbuy.com.br/arquivos/f0853c897b6ec0b9ff1e212e78ca35d6/produtos/664df06b12e19/jaqueta-corta-vento-preta-basica-4mud-casual-1-frente-664df06b856ca.jpg');

-- Cupons
-- EXPIRADO20 tem active=true mas expires_at no passado (pegadinha intencional)
INSERT INTO coupons (code, discount_type, discount_value, active, expires_at) VALUES
    ('DESCONTO10',  'percentage', 10.00, TRUE,  '2099-12-31 23:59:59'),
    ('VALE15',      'fixed',     15.00, TRUE,  '2099-12-31 23:59:59'),
    ('EXPIRADO20',  'percentage', 20.00, TRUE,  '2024-01-01 00:00:00');
