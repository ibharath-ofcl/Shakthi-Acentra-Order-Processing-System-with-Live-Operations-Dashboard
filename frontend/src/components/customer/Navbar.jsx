import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`customer-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #167733 0%, #0D5B25 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 10px rgba(22, 119, 51, 0.2)'
          }}>
            <ShieldCheck size={22} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
              SHAKTHI<span style={{ color: '#167733' }}>-ACENTRA</span>
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#64748B' }}>
              Intelligent Medical Commerce
            </div>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <div style={{ display: 'none', md: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav-links">
          <Link to="/" style={{
            textDecoration: 'none',
            fontSize: '0.92rem',
            fontWeight: 500,
            color: location.pathname === '/' ? '#167733' : '#334155',
            transition: 'color 0.15s'
          }}>
            Home
          </Link>
          <Link to="/products" style={{
            textDecoration: 'none',
            fontSize: '0.92rem',
            fontWeight: 500,
            color: location.pathname.startsWith('/products') ? '#167733' : '#334155',
            transition: 'color 0.15s'
          }}>
            Products
          </Link>
          <a href="/#categories" style={{
            textDecoration: 'none',
            fontSize: '0.92rem',
            fontWeight: 500,
            color: '#334155',
            transition: 'color 0.15s'
          }}>
            Categories
          </a>
          <a href="/#smart-commerce" style={{
            textDecoration: 'none',
            fontSize: '0.92rem',
            fontWeight: 500,
            color: '#334155',
            transition: 'color 0.15s'
          }}>
            Platform
          </a>
          <a href="/#how-it-works" style={{
            textDecoration: 'none',
            fontSize: '0.92rem',
            fontWeight: 500,
            color: '#334155',
            transition: 'color 0.15s'
          }}>
            How It Works
          </a>
        </div>

        {/* Right CTA and Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Search Icon */}
          <Link to="/products" style={{
            color: '#475569',
            padding: '0.5rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            transition: 'background 0.15s'
          }} title="Search products">
            <Search size={20} />
          </Link>

          {/* Cart Icon with badge */}
          <Link to="/cart" style={{
            position: 'relative',
            color: '#0F172A',
            padding: '0.5rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none'
          }} title="Shopping Cart">
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                backgroundColor: '#167733',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(22, 119, 51, 0.4)'
              }}>
                {itemCount}
              </span>
            )}
          </Link>

          {/* Primary CTA */}
          <Link to="/products" className="btn-primary" style={{ padding: '0.55rem 1.15rem', fontSize: '0.88rem' }}>
            <span>Shop Now</span>
            <ArrowRight size={16} />
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#0F172A',
              padding: '0.25rem'
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav-links { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
