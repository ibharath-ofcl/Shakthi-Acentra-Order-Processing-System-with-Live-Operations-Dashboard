import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import Navbar from '../components/customer/Navbar';
import Footer from '../components/customer/Footer';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/common/ProductImage';
import { PRODUCTS } from '../data/products';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, shipping, tax, total, itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '3rem 1.5rem 6rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            Clinical Shopping Cart
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748B', marginTop: '0.4rem' }}>
            Review your medical supplies before proceeding to automated allocation & dispatch.
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            padding: '5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              backgroundColor: '#F1F5F9',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingBag size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
              Your cart is empty
            </h2>
            <p style={{ color: '#64748B', maxWidth: '420px', fontSize: '0.95rem' }}>
              Explore our clinical catalog for verified medical diagnostics, surgical PPE, and emergency care supplies.
            </p>
            <Link to="/products" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.85rem 2rem' }}>
              <span>Explore Products</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          /* Active Cart Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}>
            
            {/* Left Items Table */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '20px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
                Cart Items ({itemCount})
              </div>

              {items.map(item => (
                <div
                  key={item.sku}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid #F1F5F9'
                  }}
                >
                  {/* Item Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px'
                    }}>
                      <ProductImage
                        src={item.image || PRODUCTS.find(p => p.sku === item.sku)?.image}
                        alt={item.name}
                        aspectRatio={null}
                        style={{ width: '100%', height: '100%' }}
                        fallbackText={item.name.slice(0, 2)}
                      />
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                        {item.name}
                      </h3>
                      <div style={{ fontSize: '0.78rem', fontFamily: 'JetBrains Mono', color: '#64748B' }}>
                        SKU: {item.sku}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#167733', marginTop: '2px' }}>
                        ₹{item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                      style={{ border: 'none', background: '#F8FAFC', padding: '0.4rem 0.65rem', cursor: 'pointer' }}
                      aria-label="Decrease"
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0.4rem 0.9rem', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                      style={{ border: 'none', background: '#F8FAFC', padding: '0.4rem 0.65rem', cursor: 'pointer' }}
                      aria-label="Increase"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Item Subtotal & Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', minWidth: '70px', textAlign: 'right' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.sku)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: '0.4rem',
                        transition: 'color 0.15s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#BE123C'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Order Summary Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '20px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>₹{subtotal.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Express Medical Freight</span>
                  <span style={{ fontWeight: 600, color: shipping === 0 ? '#167733' : '#0F172A' }}>
                    {shipping === 0 ? 'FREE (Over ₹2,000)' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Logistics & Handling (5%)</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>₹{tax.toFixed(2)}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  paddingTop: '1rem',
                  borderTop: '1px solid #E2E8F0'
                }}>
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: '#64748B',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={16} color="#167733" />
                <span>Zero-Overselling Inventory Guarantee</span>
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
