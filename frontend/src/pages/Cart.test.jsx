import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Cart from './Cart';
import * as CartContextModule from '../context/CartContext';

vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(),
}));

describe('Cart Page', () => {
  const mockApplyCoupon = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty cart state', () => {
    CartContextModule.useCart.mockReturnValue({
      cart: { items: [], total: 0, discount: 0, final_total: 0 },
      loading: false,
      applyCoupon: mockApplyCoupon
    });
    
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();
  });

  it('renders cart with items', () => {
    const mockCart = {
      items: [
        { id: 1, product_name: 'Produto Teste', unit_price: 50, quantity: 2, subtotal: 100, stock: 5 }
      ],
      total: 100,
      discount: 10,
      final_total: 90,
      applied_coupon: 'TEST10'
    };

    CartContextModule.useCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      applyCoupon: mockApplyCoupon
    });
    
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Itens do Pedido (2)')).toBeInTheDocument();
    expect(screen.getByText('Produto Teste')).toBeInTheDocument();
    expect(screen.getAllByText('R$ 100,00').length).toBeGreaterThan(0); // total line and subtotal
    expect(screen.getByText('R$ 90,00')).toBeInTheDocument(); // final_total line
    expect(screen.getByText('- R$ 10,00')).toBeInTheDocument(); // discount line
  });

  it('handles coupon application', async () => {
    const mockCart = {
      items: [
        { id: 1, product_name: 'Produto Teste', unit_price: 50, quantity: 2, subtotal: 100, stock: 5 }
      ],
      total: 100,
      discount: 0,
      final_total: 100,
      applied_coupon: null
    };

    CartContextModule.useCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      applyCoupon: mockApplyCoupon
    });
    
    mockApplyCoupon.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
    
    const input = screen.getByPlaceholderText('Digite seu cupom');
    const button = screen.getByRole('button', { name: 'Aplicar' });

    fireEvent.change(input, { target: { value: 'DESC10' } });
    fireEvent.click(button);

    expect(mockApplyCoupon).toHaveBeenCalledWith('DESC10');

    await waitFor(() => {
      expect(screen.getByText('Cupom aplicado com sucesso!')).toBeInTheDocument();
    });
  });
});
