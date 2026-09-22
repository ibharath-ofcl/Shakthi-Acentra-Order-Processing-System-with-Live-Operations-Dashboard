import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Check, ShieldCheck, Truck, ArrowLeft, Plus, Minus, CheckCircle2, Box, Camera, Sparkles } from 'lucide-react';
import Navbar from '../components/customer/Navbar';
import Footer from '../components/customer/Footer';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/common/ProductImage';
import Product3DViewer from '../components/3d/Product3DViewer';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('features');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('3d'); // '3d' | 'photo'

  const product = PRODUCTS.find(p => p.id === parseInt(id, 10)) || PRODUCTS[0];
  const inCart = items.some(item => item.sku === product.sku);
  const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '2.5rem 1.5rem 6rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748B', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: '#64748B', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: '#64748B', textDecoration: 'none' }}>Products</Link>
          <span>/</span>
          <span style={{ color: '#0F172A', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Hero Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'start',
          marginBottom: '4rem'
        }}>
          
          {/* Left Column: Visual Showcase */}
          <div style={{
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '460px',
            position: 'relative'
          }}>
            {/* Top Bar: Badge & View Mode Toggle */}
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}>
              <div style={{
                backgroundColor: '#FFFFFF',
                color: '#167733',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.35rem 0.8rem',
                borderRadius: '9999px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}>
                {product.badge}
              </div>

              {/* View Mode Toggle */}
              <div style={{
                display: 'flex',
                background: '#E2E8F0',
                padding: '3px',
                borderRadius: '10px',
                gap: '2px'
              }}>
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: viewMode === '3d' ? '#167733' : 'transparent',
                    color: viewMode === '3d' ? '#FFFFFF' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Box size={13} />
                  <span>3D Interactive</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('photo')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: viewMode === 'photo' ? '#167733' : 'transparent',
                    color: viewMode === 'photo' ? '#FFFFFF' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Camera size={13} />
                  <span>HD Photo</span>
                </button>
              </div>
            </div>

            {/* Central Media: 3D or Photo */}
            {viewMode === '3d' ? (
              <div style={{ width: '100%', height: '380px' }}>
                <Product3DViewer product={product} height="380px" autoRotate={true} />
              </div>
            ) : (
              <>
                <div style={{ width: '100%', maxWidth: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    aspectRatio="1 / 1"
                    style={{
                      width: '100%',
                      maxHeight: '320px',
                      background: 'transparent',
                      transform: selectedImageIndex === 1 ? 'scale(1.12)' : 'scale(1)',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </div>

                {/* Gallery Thumbnails */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                  {[
                    { label: 'Primary View', scale: 1 },
                    { label: 'Detail Focus', scale: 1.15 }
                  ].map((view, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        border: '2px solid',
                        borderColor: selectedImageIndex === idx ? '#167733' : '#E2E8F0',
                        backgroundColor: '#FFFFFF',
                        padding: '4px',
                        cursor: 'pointer',
                        boxShadow: selectedImageIndex === idx ? '0 0 0 2px rgba(22, 119, 51, 0.2)' : 'none',
                        transition: 'all 0.15s ease',
                        overflow: 'hidden'
                      }}
                      title={view.label}
                    >
                      <img
                        src={product.image}
                        alt={view.label}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          transform: `scale(${view.scale})`
                        }}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}

            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontFamily: 'JetBrains Mono', color: '#64748B' }}>
                SKU: {product.sku}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#167733', fontWeight: 600, marginTop: '4px' }}>
                Batch Verified & Clinical Quality Inspected
              </div>
            </div>
          </div>

          {/* Right Column: Order Actions & Specs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Category & Rating */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#167733', letterSpacing: '0.05em' }}>
                {product.categoryName}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 600 }}>
                <Star size={16} fill="#F59E0B" color="#F59E0B" />
                <span>{product.rating}</span>
                <span style={{ color: '#94A3B8' }}>({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              {product.name}
            </h1>

            {/* Price & Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                ₹{product.price.toFixed(2)}
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700
              }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#15803D' }} />
                <span>In Stock & Ready to Dispatch</span>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6 }}>
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>Quantity:</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    border: 'none',
                    background: '#F8FAFC',
                    padding: '0.6rem 0.9rem',
                    cursor: 'pointer',
                    color: '#0F172A'
                  }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span style={{
                  padding: '0.6rem 1.25rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  fontFamily: 'JetBrains Mono',
                  color: '#0F172A'
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    border: 'none',
                    background: '#F8FAFC',
                    padding: '0.6rem 0.9rem',
                    cursor: 'pointer',
                    color: '#0F172A'
                  }}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem' }}>
              <button
                onClick={() => addToCart(product, quantity)}
                className="btn-primary"
                style={{ flexGrow: 1, padding: '0.9rem 1.5rem', fontSize: '1rem' }}
              >
                <ShoppingCart size={18} />
                <span>Add {quantity} to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="btn-secondary"
                style={{
                  flexGrow: 1,
                  padding: '0.9rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  borderColor: '#0F172A'
                }}
              >
                <span>Buy Now</span>
              </button>
            </div>

            {/* Trust Points */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #F1F5F9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569' }}>
                <ShieldCheck size={18} color="#167733" />
                <span>Zero-Overselling Reserve</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569' }}>
                <Truck size={18} color="#167733" />
                <span>Expedited Clinical Delivery</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Specifications & Features */}
        <div style={{
          borderTop: '1px solid #E2E8F0',
          paddingTop: '3rem',
          marginBottom: '4rem'
        }}>
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #E2E8F0', marginBottom: '2rem' }}>
            <button
              onClick={() => setActiveTab('features')}
              style={{
                border: 'none',
                background: 'none',
                padding: '0.75rem 0.25rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: activeTab === 'features' ? '#167733' : '#64748B',
                borderBottom: activeTab === 'features' ? '3px solid #167733' : '3px solid transparent',
                cursor: 'pointer'
              }}
            >
              Key Features
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              style={{
                border: 'none',
                background: 'none',
                padding: '0.75rem 0.25rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: activeTab === 'specs' ? '#167733' : '#64748B',
                borderBottom: activeTab === 'specs' ? '3px solid #167733' : '3px solid transparent',
                cursor: 'pointer'
              }}
            >
              Clinical Specifications
            </button>
          </div>

          {activeTab === 'features' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {product.features.map((feat, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: '#F8FAFC',
                  padding: '1.25rem',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0'
                }}>
                  <CheckCircle2 size={18} color="#167733" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.5 }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: '#F8FAFC',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              overflow: 'hidden'
            }}>
              {Object.entries(product.specs).map(([label, val], idx) => (
                <div key={label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  borderBottom: idx !== Object.entries(product.specs).length - 1 ? '1px solid #E2E8F0' : 'none',
                  backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
                }}>
                  <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem', fontFamily: 'JetBrains Mono' }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
              Related Medical Supplies
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {related.map(rel => (
                <Link
                  key={rel.id}
                  to={`/products/${rel.id}`}
                  className="interactive-card"
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#167733', textTransform: 'uppercase' }}>
                    {rel.categoryName}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                    {rel.name}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: 'auto' }}>
                    ₹{rel.price.toFixed(2)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
