import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { cart } = useCart();

  const totalItems = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  return (
    <header className="bg-white text-[#40a543] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold hover:opacity-90 transition-colors">
          <img src="https://wisesales.com.br/wp-content/uploads/2025/08/logo-wise-sales.webp" alt="Wise Sales Logo" />
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/" className="hover:opacity-90 font-medium transition-opacity">
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/cart" className="flex items-center space-x-1 hover:opacity-90 font-medium relative transition-opacity">
                <ShoppingCart className="w-5 h-5" />
                <span>Carrinho</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
