import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';
import * as CartContextModule from '../context/CartContext';

// Mock useCart hook
vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(),
}));

describe('Navbar', () => {
  it('renders the store name', () => {
    CartContextModule.useCart.mockReturnValue({ cart: { items: [] } });
    
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByAltText('Wise Sales Logo')).toBeInTheDocument();
  });

  it('displays the correct number of items in the cart', () => {
    CartContextModule.useCart.mockReturnValue({
      cart: {
        items: [
          { quantity: 2 },
          { quantity: 3 }
        ]
      }
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Should display 5 items in total
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
