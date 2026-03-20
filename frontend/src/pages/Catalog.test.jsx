import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Catalog from './Catalog';
import { productApi } from '../services/api';
import * as CartContextModule from '../context/CartContext';

// Mocking productApi
vi.mock('../services/api', () => ({
  productApi: {
    getProducts: vi.fn(),
  }
}));

// Mocking the context
vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(() => ({ addToCart: vi.fn() })),
}));

describe('Catalog Page', () => {
  const mockProducts = [
    { id: 1, name: 'Produto 1', price: 100, category: 'roupas', stock: 10, image_url: '' },
    { id: 2, name: 'Produto 2', price: 200, category: 'calçados', stock: 5, image_url: '' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Return an unresolved promise to keep it in loading state
    productApi.getProducts.mockReturnValue(new Promise(() => {}));
    
    const { container } = render(<Catalog />);
    
    expect(screen.getByText('Catálogo de Produtos')).toBeInTheDocument();
    // Check for skeletons instead of products
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders products after successful fetch', async () => {
    productApi.getProducts.mockResolvedValue({ data: mockProducts });
    
    render(<Catalog />);
    
    await waitFor(() => {
      expect(screen.getByText('Produto 1')).toBeInTheDocument();
      expect(screen.getByText('Produto 2')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    productApi.getProducts.mockRejectedValue(new Error('API Error'));
    
    render(<Catalog />);
    
    await waitFor(() => {
      expect(screen.getByText('Falha ao carregar produtos. Verifique se o servidor está rodando.')).toBeInTheDocument();
    });
  });

  it('renders empty state when no products match', async () => {
    productApi.getProducts.mockResolvedValue({ data: [] });
    
    render(<Catalog />);
    
    await waitFor(() => {
      expect(screen.getByText('Nenhum produto encontrado nesta categoria.')).toBeInTheDocument();
    });
  });
});
