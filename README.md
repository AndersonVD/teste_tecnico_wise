# Wise Sales - Mini E-commerce Fullstack

Este é o projeto de teste técnico para a vaga de Desenvolvedor Fullstack Python + React na Wise Sales.

## Tecnologias Utilizadas

### Backend (Python)
- **FastAPI**: Framework rápido e assíncrono, ideal para APIs modernas.
- **psycopg2**: Comunicação direta com o PostgreSQL, utilizando raw SQL queries.
- **Alembic**: Ferramenta para gerenciar migrações de banco de dados.
- **Pytest**: Para testes unitários da camada de serviço.
- **Ruff**: Para linting e formatação do código Python.

### Frontend (React)
- **React 18 + Vite**: Para um build e desenvolvimento extremamente rápido.
- **Tailwind CSS v4**: Para estilização utility-first, entregando uma interface responsiva e moderna.
- **Context API**: Para gerenciamento do estado global do carrinho de compras.
- **Lucide React**: Ícones elegantes e consistentes.
- **Vitest & React Testing Library**: Para testes dos componentes UI.

## Arquitetura

O backend segue uma arquitetura N-Layered clássica:
1. **Routes (`routes/`)**: Declaração dos endpoints e validação de payload via Pydantic.
2. **Services (`services/`)**: Regras de negócio importantes (ex: validação de estoque, aplicação de cupom).
3. **Repositories (`repositories/`)**: Consultas SQL em si, separando a persistência da lógica de negócio.

O frontend é uma Single Page Application:
1. **Context (`context/`)**: Onde a `CartContext` vive, comunicando-se com a API.
2. **Pages (`pages/`)**: Páginas isoladas (`Catalog` e `Cart`).
3. **Components (`components/`)**: Elementos visuais reutilizáveis.

## Como rodar localmente

### Pré-requisitos
Ter o [Docker](https://www.docker.com/) e o `docker-compose` instalados.

1. Clone o repositório e crie o seu arquivo `.env`:
   ```bash
   cp .env.example .env
   ```

2. Suba todos os containers orquestrados com o docker-compose:
   ```bash
   docker compose up --build -d
   ```

### Rodando localmente (Sem Docker)

Se preferir rodar sem os containers Docker (requer PostgreSQL rodando na máquina):

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn src.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

3. Acesse a aplicação:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000
   - O banco de dados vai escutar na porta `5432` da sua máquina e rodar as tabelas e seeds de `seed.sql` automaticamente.

*(Nota: a migração pelo alembic também é rodada na inicialização do backend pelo Dockerfile)*

## 🧪 Testes e Qualidade

Foram implementados testes automatizados.
- **Para testar o Backend**:
  Dentro do container backend ou do ambiente virtual python local rodando na raiz do backend:
  ```bash
  pytest tests/ -v
  ```

- **Para testar o Frontend**:
  Dentro da pasta frontend, após instalar os pacotes:
  ```bash
  npm run test
  ```

## 🧠 Soluções e Decisões Técnicas
- **Raw SQL**: Como demandado pelo desafio, ORMs (`SQLAlchemy`) não foram utilizados para operações, apenas connection pooling simples gerido no aplicativo com `psycopg2`. Toda instrução foi isolada no Repository layer.
- **Alembic**: A primeira revisão inicial (`001_initial_schema`) garante a estrutura correta caso não seja usado o `seed.sql`.
- **In-Memory Coupon**: O cupom esta estático no serviço em memória temporária, mas poderia ser armazenado na sessão do PostgreSQL.

---
### O que eu faria com mais tempo?
- Autenticação e Autorização com JWT e sessões individualizadas no backend para separar carrinhos entre clientes.
- Pipeline de testes e deploy automatizado com o Github Actions


## Links auxiliares

- https://youtu.be/yQtqkq9UkDA
- https://alembic.sqlalchemy.org/en/latest/
