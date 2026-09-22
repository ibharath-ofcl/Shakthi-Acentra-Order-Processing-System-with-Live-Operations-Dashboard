import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowRight, Check, Box } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import ProductImage from '../common/ProductImage';
import Product3DModal from '../3d/Product3DModal';

export default function FeaturedProducts() {
  const { addToCart, items } = useCart();
  const [active3DProduct, setActive3DProduct] = useState(null);
  const featured = PRODUCTS.filter(p => p.featured).slice(0, 6);

  return (
    <section style={{ padding: '5rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* 3D Quick Modal */}
      <Product3DModal
        product={active3DProduct}
        isOpen={!!active3DProduct}
        onClose={() => setActive3DProduct(null)}
      />

      {/* Section Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#167733',
            marginBottom: '0.5rem'
          }}>
            Clinician Approved
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#0F172A'
          }}>
            Featured Diagnostics & Critical Equipment
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '540px', marginTop: '0.5rem' }}>
            High-demand clinical devices, diagnostics, and protective equipment ready for immediate automated dispatch.
          </p>
        </div>

        <Link
          to="/products"
          className="btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.92rem'
          }}
        >
          <span>View All Requisitions</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {featured.map((product) => {
          const inCart = items.some(item => item.sku === product.sku);

          return (
            <div
              key={product.id}
              className="interactive-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                background: '#FFFFFF'
              }}
            >
              {/* Card Media Header */}
              <div style={{
                position: 'relative',
                height: '240px',
                width: '100%',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                borderBottom: '1px solid #F1F5F9'
              }}>
                {/* Badge */}
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#167733',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  border: '1px solid #E2E8F0'
                }}>
                  {product.badge}
                </div>

                {/* 3D Quick View Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActive3DProduct(product);
                  }}
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#0284C7',
                    backgroundColor: '#E0F2FE',
                    border: '1px solid #BAE6FD',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    zIndex: 2
                  }}
                  title="Inspect in 3D"
                >
                  <Box size={13} />
                  <span>3D View</span>
                </button>

                {/* Real Commercial Product Photography */}
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    aspectRatio="1 / 1"
                    style={{ maxHeight: '170px', background: 'transparent' }}
                  />
                </Link>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '1rem' }}>
                
                {/* Category & Rating */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#64748B'
                  }}>
                    {product.categoryName}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 600, color: '#0F172A' }}>
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    <span>{product.rating}</span>
                    <span style={{ color: '#94A3B8', fontWeight: 400 }}>({product.reviewsCount})</span>
                  </div>
                </div>

                {/* Title */}
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    lineHeight: 1.3,
                    transition: 'color 0.15s'
                  }}>
                    {product.name}
                  </h3>
                </Link>

                {/* Short Description */}
                <p style={{
                  fontSize: '0.88rem',
                  color: '#64748B',
                  lineHeight: 1.5,
                  flexGrow: 1
                }}>
                  {product.shortDescription}
                </p>

                {/* Pricing & Add to Cart Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid #F1F5F9',
                  marginTop: 'auto'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                      Unit Price
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                      ₹{product.price.toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="btn-primary"
                    style={{
                      padding: '0.65rem 1.15rem',
                      fontSize: '0.88rem',
                      backgroundColor: inCart ? '#0D5B25' : '#167733'
                    }}
                  >
                    {inCart ? (
                      <>
                        <Check size={16} />
                        <span>In Cart</span>
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
          );
        })}
      </div>

      <style>{`
        .interactive-card:hover .product-avatar {
          transform: rotate(0deg) scale(1.06);
        }
      `}</style>
    </section>
  );
}
