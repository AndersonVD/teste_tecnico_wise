import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
    discount: 0,
    final_total: 0,
    applied_coupon: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      setCart(res.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product_id, quantity) => {
    try {
      await cartApi.addItem(product_id, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Error adding to cart' };
    }
  };

  const updateQuantity = async (item_id, quantity) => {
    try {
      await cartApi.updateItem(item_id, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Error updating quantity' };
    }
  };

  const removeItem = async (item_id) => {
    try {
      await cartApi.removeItem(item_id);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Error removing item' };
    }
  };

  const applyCoupon = async (code) => {
    try {
      await cartApi.applyCoupon(code);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Invalid coupon' };
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
