import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, Star, Filter, Check, ArrowRight, Box } from 'lucide-react';
import Navbar from '../components/customer/Navbar';
import Footer from '../components/customer/Footer';
import { PRODUCTS, MEDICAL_CATEGORIES } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/common/ProductImage';
import Product3DModal from '../components/3d/Product3DModal';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [active3DProduct, setActive3DProduct] = useState(null);
  const { addToCart, items } = useCart();

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [activeCategory, searchQuery, sortBy]);

  const handleCategoryChange = (catId) => {
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar />

      {/* 3D Quick Modal */}
      <Product3DModal
        product={active3DProduct}
        isOpen={!!active3DProduct}
        onClose={() => setActive3DProduct(null)}
      />

      <main style={{ flexGrow: 1, padding: '3rem 1.5rem 6rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#167733', marginBottom: '0.4rem' }}>
            Clinical Catalog
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            Medical Equipment & Supplies
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '600px', marginTop: '0.4rem' }}>
            Verified hospital essentials with automated inventory reservation and real-time fulfillment.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
        }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: '#F1F5F9',
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            flexGrow: 1,
            maxWidth: '360px'
          }}>
            <Search size={18} color="#64748B" />
            <input
              type="text"
              placeholder="Search by product, SKU, or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.9rem',
                color: '#0F172A',
                width: '100%'
              }}
            />
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0.55rem 0.9rem',
                fontSize: '0.88rem',
                color: '#0F172A',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '2.5rem'
        }}>
          {MEDICAL_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              style={{
                border: '1px solid',
                borderColor: activeCategory === cat.id ? '#167733' : '#E2E8F0',
                backgroundColor: activeCategory === cat.id ? '#167733' : '#FFFFFF',
                color: activeCategory === cat.id ? '#FFFFFF' : '#475569',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
              No products found
            </div>
            <p style={{ color: '#64748B', maxWidth: '400px', fontSize: '0.92rem' }}>
              We couldn't find any products matching your search criteria. Try selecting another category or clearing your query.
            </p>
            <button
              onClick={() => { setSearchQuery(''); handleCategoryChange('all'); }}
              className="btn-primary"
              style={{ marginTop: '0.5rem' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {filteredProducts.map(product => {
              const inCart = items.some(item => item.sku === product.sku);

              return (
                <div
                  key={product.id}
                  className="interactive-card"
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#FFFFFF'
                  }}
                >
                  {/* Visual Header */}
                  <div style={{
                    height: '190px',
                    background: 'linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 100%)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.25rem'
                  }}>
                    {/* Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: '#FFFFFF',
                      color: '#167733',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.55rem',
                      borderRadius: '9999px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
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
                        top: '12px',
                        right: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#0284C7',
                        backgroundColor: '#E0F2FE',
                        border: '1px solid #BAE6FD',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        zIndex: 2
                      }}
                      title="Inspect in 3D"
                    >
                      <Box size={12} />
                      <span>3D View</span>
                    </button>

                    {/* Real Product Image */}
                    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        aspectRatio="1 / 1"
                        style={{ maxHeight: '150px', background: 'transparent' }}
                      />
                    </Link>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748B' }}>
                        {product.categoryName}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                        {product.name}
                      </h3>
                    </Link>

                    <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.4, flexGrow: 1 }}>
                      {product.shortDescription}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid #F1F5F9',
                      marginTop: 'auto'
                    }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                        ₹{product.price.toFixed(2)}
                      </div>

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="btn-primary"
                        style={{
                          padding: '0.55rem 1rem',
                          fontSize: '0.85rem',
                          backgroundColor: inCart ? '#0D5B25' : '#167733'
                        }}
                      >
                        {inCart ? (
                          <>
                            <Check size={14} />
                            <span>In Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={14} />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
