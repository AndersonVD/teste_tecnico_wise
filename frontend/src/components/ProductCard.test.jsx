import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ProductCard from './ProductCard';
import * as CartContextModule from '../context/CartContext';

// Mocking the context
vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(),
}));

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Produto Teste',
    price: 99.9,
    category: 'Eletrônicos',
    stock: 3,
    image_url: 'http://example.com/image.jpg'
  };

  const mockAddToCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    CartContextModule.useCart.mockReturnValue({
      addToCart: mockAddToCart,
    });
  });

  it('renders product details correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Produto Teste')).toBeInTheDocument();
    expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
    expect(screen.getByText('R$ 99,90')).toBeInTheDocument();
    expect(screen.getByText('Restam 3')).toBeInTheDocument();
  });

  it('handles Add To Cart click', async () => {
    mockAddToCart.mockResolvedValue({ success: true });
    
    render(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /Adicionar/i });
    fireEvent.click(addButton);
    
    expect(mockAddToCart).toHaveBeenCalledWith(1, 1);
    
    await waitFor(() => {
      expect(screen.getByText('Adicionado!')).toBeInTheDocument();
    });
  });

  it('displays out of stock state', () => {
    render(<ProductCard product={{ ...mockProduct, stock: 0 }} />);
    
    expect(screen.getByText('Esgotado')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /Indisponível/i });
    expect(button).toBeDisabled();
  });
});
