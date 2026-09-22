import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shakthi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('shakthi_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.sku === product.sku);
      if (existing) {
        return prev.map(item =>
          item.sku === product.sku
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
    showToast(`Added ${quantity}x ${product.name} to cart`);
  };

  const removeFromCart = (sku) => {
    setItems(prev => prev.filter(item => item.sku !== sku));
    showToast('Item removed from cart');
  };

  const updateQuantity = (sku, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.sku === sku ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 2000 || items.length === 0 ? 0 : 99.00;
  const tax = subtotal * 0.05; // 5% healthcare logistics duty
  const total = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shipping,
        tax,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
