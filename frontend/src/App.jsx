import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OperationsPage from './pages/OperationsPage';
import { CheckCircle2 } from 'lucide-react';

function ToastContainer() {
  const { toastMessage } = useCart();
  if (!toastMessage) return null;

  return (
    <div className="toast-banner">
      <CheckCircle2 size={18} color="#4ADE80" />
      <span>{toastMessage}</span>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Experience Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:id" element={<OrderTrackingPage />} />
          
          {/* Separated Operations Center Routes */}
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/operations/*" element={<OperationsPage />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </CartProvider>
  );
}
