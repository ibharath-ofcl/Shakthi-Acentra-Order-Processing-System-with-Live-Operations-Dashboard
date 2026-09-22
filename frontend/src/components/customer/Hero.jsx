import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import Hero3D from './Hero3D';

export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      padding: '4rem 1.5rem 5rem',
      maxWidth: '1280px',
      margin: '0 auto',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3.5rem',
        alignItems: 'center'
      }}>
        
        {/* Left Editorial Copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Tag Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--shakthi-green-subtle)',
            border: '1px solid var(--shakthi-green-border)',
            padding: '0.4rem 0.9rem',
            borderRadius: '9999px',
            width: 'fit-content',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: 'var(--shakthi-green)',
            textTransform: 'uppercase'
          }}>
            <Sparkles size={14} />
            <span>SMART MEDICAL COMMERCE</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#0F172A'
          }}>
            Healthcare essentials, <br />
            <span style={{
              background: 'linear-gradient(135deg, #167733 0%, #0D9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              delivered intelligently.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.12rem',
            lineHeight: 1.6,
            color: '#475569',
            maxWidth: '520px'
          }}>
            Discover reliable medical products with intelligent inventory and seamless order fulfillment. Built for clinics, emergency providers, and healthcare facilities.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '0.5rem'
          }}>
            <Link to="/products" className="btn-primary" style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}>
              <span>Shop Medical Products</span>
              <ArrowRight size={18} />
            </Link>

            <a href="#smart-commerce" className="btn-secondary" style={{ padding: '0.85rem 1.6rem', fontSize: '1rem' }}>
              <span>Explore Our Platform</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #E2E8F0',
            marginTop: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
              <CheckCircle2 size={16} color="#167733" />
              <span>Verified Products</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
              <CheckCircle2 size={16} color="#167733" />
              <span>Live Availability</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
              <CheckCircle2 size={16} color="#167733" />
              <span>Intelligent Fulfillment</span>
            </div>
          </div>

        </div>

        {/* Right 3D Scene */}
        <div style={{ position: 'relative' }}>
          <Hero3D />
          
          {/* Subtle Floating Feature Badge */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '0.75rem 1.1rem',
            borderRadius: '14px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#22C55E',
              boxShadow: '0 0 10px #22C55E'
            }} />
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
                Automated Allocation Active
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                Zero-overselling fulfillment engine
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
