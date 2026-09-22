import React from 'react';
import { X, Sparkles, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Product3DViewer from './Product3DViewer';
import { useCart } from '../../context/CartContext';

export default function Product3DModal({ product, isOpen, onClose }) {
  const { addToCart, items } = useCart();
  if (!isOpen || !product) return null;

  const inCart = items.some(item => item.sku === product.sku);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: '850px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          position: 'relative',
          padding: '2rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}>
          {/* 3D Canvas Area */}
          <div style={{ width: '100%', height: '380px' }}>
            <Product3DViewer product={product} height="380px" autoRotate={true} />
          </div>

          {/* Product Dossier & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              width: 'fit-content'
            }}>
              <Sparkles size={12} />
              <span>3D CAD Verified Model</span>
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
              {product.name}
            </h3>

            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: '#64748B' }}>
              SKU: {product.sku} • {product.categoryName}
            </div>

            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5 }}>
              {product.shortDescription || product.description}
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid #F1F5F9'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                  Price
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
                  ₹{product.price.toFixed(2)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => addToCart(product, 1)}
                  className="btn-primary"
                  style={{
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.88rem',
                    backgroundColor: inCart ? '#0D5B25' : '#167733'
                  }}
                >
                  {inCart ? 'In Cart' : 'Add to Cart'}
                </button>

                <Link
                  to={`/products/${product.id}`}
                  onClick={onClose}
                  className="btn-secondary"
                  style={{ padding: '0.65rem 1rem', fontSize: '0.88rem' }}
                >
                  <span>Details</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
