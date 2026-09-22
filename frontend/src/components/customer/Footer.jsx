import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0F172A',
      color: '#94A3B8',
      padding: '4.5rem 1.5rem 2.5rem',
      borderTop: '1px solid #1E293B'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>
          
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#167733',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <ShieldCheck size={20} strokeWidth={2.4} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                SHAKTHI<span style={{ color: '#22C55E' }}>-ACENTRA</span>
              </span>
            </Link>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94A3B8', margin: 0 }}>
              Intelligent medical commerce platform engineered for healthcare providers, clinics, and emergency supply chains.
            </p>
          </div>

          {/* Commerce Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#F8FAFC', letterSpacing: '0.05em' }}>
              Store & Catalog
            </div>
            <Link to="/products" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.15s' }}>
              All Medical Products
            </Link>
            <a href="/#categories" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }}>
              Product Categories
            </a>
            <Link to="/products?category=diagnostics" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }}>
              Clinical Diagnostics
            </Link>
            <Link to="/products?category=ppe" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }}>
              PPE & Barrier Protection
            </Link>
            <Link to="/cart" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }}>
              Shopping Cart
            </Link>
          </div>

          {/* Platform Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#F8FAFC', letterSpacing: '0.05em' }}>
              Platform & Orders
            </div>
            <a href="/#smart-commerce" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }}>
              Smart Fulfillment
            </a>
            <a href="/#how-it-works" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }}>
              How It Works
            </a>
            <Link to="/orders/track" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }}>
              Order Tracking
            </Link>
            <span style={{ color: '#64748B', fontSize: '0.9rem' }}>
              Support: 24/7 Clinical Desk
            </span>
          </div>

          {/* Internal Operations Entry (Separated from Customer Navigation) */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(51, 65, 85, 0.7)',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ADE80', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Cpu size={14} />
              <span>Operations Portal</span>
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>
              Operations Center
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
              Access live order queues, inventory locks, DLQ recovery, and intelligence simulations.
            </p>
            <Link
              to="/operations"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#4ADE80',
                textDecoration: 'none',
                marginTop: '0.25rem'
              }}
            >
              <span>Launch Operations Center</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          paddingTop: '2rem',
          borderTop: '1px solid #1E293B',
          fontSize: '0.82rem',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} Shakthi-Acentra Medical Commerce. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Clinical Verification Standard</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
