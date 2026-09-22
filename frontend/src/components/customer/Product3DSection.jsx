import React, { useState } from 'react';
import { ShoppingCart, Star, Check, Sparkles, Box, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { PRODUCTS } from '../../data/products';
import Product3DViewer from '../3d/Product3DViewer';

export default function Product3DSection() {
  const { addToCart, items } = useCart();
  const [selectedSku, setSelectedSku] = useState('MED-OX-201');

  const product = PRODUCTS.find(p => p.sku === selectedSku) || PRODUCTS[0];
  const inCart = items.some(item => item.sku === product.sku);

  return (
    <section style={{ padding: '6rem 1.5rem', backgroundColor: '#F8FAFC' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            padding: '0.35rem 0.9rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem'
          }}>
            <Box size={14} />
            <span>Interactive 3D Product Suite</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.03em',
            lineHeight: 1.15
          }}>
            Inspect Every Medical Device in Full 3D
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '580px', margin: '0.5rem auto 0', lineHeight: 1.5 }}>
            Rotate 360°, inspect clinical CAD geometry, toggle wireframes, and explore hospital-grade engineering for every catalog product.
          </p>
        </div>

        {/* 3D Product Picker Pills */}
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '2rem',
          justifyContent: 'flex-start',
          scrollbarWidth: 'none'
        }}>
          {PRODUCTS.map(p => {
            const isSelected = p.sku === product.sku;
            return (
              <button
                key={p.sku}
                onClick={() => setSelectedSku(p.sku)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #167733' : '1px solid #E2E8F0',
                  backgroundColor: isSelected ? '#FFFFFF' : '#F1F5F9',
                  color: isSelected ? '#167733' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 12px rgba(22, 119, 51, 0.12)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? '#167733' : '#94A3B8'
                }} />
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Two-Column 3D Showcase */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center',
          background: '#FFFFFF',
          borderRadius: '28px',
          border: '1px solid #E2E8F0',
          padding: '2.5rem',
          boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.06)'
        }}>
          
          {/* Left: 3D Interactive WebGL Viewer */}
          <div style={{ width: '100%', height: '440px' }}>
            <Product3DViewer product={product} height="440px" autoRotate={true} />
          </div>

          {/* Right: Product Specifications & Buy Action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                padding: '0.3rem 0.7rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                <Sparkles size={12} />
                <span>{product.badge}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <span>{product.rating}</span>
                <span style={{ color: '#94A3B8' }}>({product.reviewsCount} Clinical Reviews)</span>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {product.name}
              </h3>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>
                SKU: {product.sku} • Category: {product.categoryName}
              </div>
            </div>

            <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
              {product.description}
            </p>

            {/* Key Clinical Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {product.features.slice(0, 3).map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#334155' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={12} />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Pricing & CTA Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1.25rem',
              borderTop: '1px solid #F1F5F9',
              marginTop: '0.25rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                  Unit Price
                </span>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                  ₹{product.price.toFixed(2)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link
                  to={`/products/${product.id}`}
                  className="btn-secondary"
                  style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
                >
                  <span>Full Details</span>
                  <ArrowRight size={15} />
                </Link>

                <button
                  onClick={() => addToCart(product, 1)}
                  className="btn-primary"
                  style={{
                    padding: '0.75rem 1.4rem',
                    fontSize: '0.9rem',
                    backgroundColor: inCart ? '#0D5B25' : '#167733'
                  }}
                >
                  {inCart ? (
                    <>
                      <Check size={16} />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
