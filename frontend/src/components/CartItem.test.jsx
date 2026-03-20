import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CartItem from './CartItem';
import * as CartContextModule from '../context/CartContext';

vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(),
}));

describe('CartItem Component', () => {
  const mockItem = {
    id: 1,
    product_name: 'Produto Teste Carrinho',
    unit_price: 50.5,
    quantity: 2,
    subtotal: 101.0,
    stock: 10,
    image_url: 'http://example.com/image.jpg'
  };

  const mockUpdateQuantity = vi.fn();
  const mockRemoveItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    CartContextModule.useCart.mockReturnValue({
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem
    });
  });

  it('renders cart item details correctly', () => {
    render(<CartItem item={mockItem} />);
    
    expect(screen.getByText('Produto Teste Carrinho')).toBeInTheDocument();
    expect(screen.getByText('R$ 50,50 / un')).toBeInTheDocument();
    expect(screen.getByText('R$ 101,00')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('handles quantity increment', async () => {
    mockUpdateQuantity.mockResolvedValue({ success: true });
    
    const { container } = render(<CartItem item={mockItem} />);
    
    // As lucide icons might be hard to query by text, we can use the class, or title.
    // The Plus button has "Plus" element next to it but easier is to query by role in real app.
    // Let's get the button that contains Plus. 
    // They don't have aria-label, but only one has disabled={item.quantity >= item.stock}
    // Alternatively, we use generic querySelector
    const buttons = container.querySelectorAll('button');
    const plusButton = buttons[1]; // The second button is the plus usually based on our dom.
    
    fireEvent.click(plusButton);
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);
  });

  it('handles quantity decrement', async () => {
    mockUpdateQuantity.mockResolvedValue({ success: true });
    const { container } = render(<CartItem item={mockItem} />);
    
    const buttons = container.querySelectorAll('button');
    const minusButton = buttons[0]; 
    
    fireEvent.click(minusButton);
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 1);
  });

  it('handles remove item click', async () => {
    mockRemoveItem.mockResolvedValue(true);
    const { container } = render(<CartItem item={mockItem} />);
    
    const buttons = container.querySelectorAll('button');
    const removeButton = buttons[2]; 
    
    fireEvent.click(removeButton);
    expect(mockRemoveItem).toHaveBeenCalledWith(1);
  });
});
