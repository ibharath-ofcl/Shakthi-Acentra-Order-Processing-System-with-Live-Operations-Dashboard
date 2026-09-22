import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section style={{
      padding: '6rem 1.5rem',
      maxWidth: '1280px',
      margin: '0 auto'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #167733 0%, #0D5B25 100%)',
        borderRadius: '32px',
        padding: '4.5rem 2rem',
        color: '#FFFFFF',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(22, 119, 51, 0.35)'
      }}>
        
        {/* Background Decorative Rings */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          bottom: '-50%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91, 203, 85, 0.15) 0%, rgba(91, 203, 85, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            padding: '0.4rem 0.95rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            <Sparkles size={14} />
            <span>Modern Healthcare Logistics</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2.3rem, 4.5vw, 3.4rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.15
          }}>
            Ready to simplify medical ordering?
          </h2>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.6,
            color: '#E0F2FE',
            opacity: 0.95
          }}>
            Discover essential medical products through a smarter commerce experience. Fast inventory reservation, live tracking, and guaranteed zero overselling.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            <Link
              to="/products"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#167733',
                fontWeight: 700,
                fontSize: '1.05rem',
                padding: '0.95rem 2.25rem',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span>Start Shopping</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#A7F3D0',
            marginTop: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={16} />
              <span>Certified Products</span>
            </div>
            <span>•</span>
            <span>Zero Backorders</span>
            <span>•</span>
            <span>Priority Delivery</span>
          </div>

        </div>

      </div>
    </section>
  );
}
