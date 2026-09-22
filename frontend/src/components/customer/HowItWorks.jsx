import React from 'react';
import { Search, ShoppingCart, Cpu, Navigation, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      desc: 'Explore certified medical supplies with guaranteed clinical specifications and transparent pricing.',
      icon: Search,
      tag: 'Product Catalog'
    },
    {
      num: '02',
      title: 'Order',
      desc: 'Select required quantities, add to cart, and checkout seamlessly with hospital delivery preferences.',
      icon: ShoppingCart,
      tag: 'Secure Checkout'
    },
    {
      num: '03',
      title: 'Smart Fulfillment',
      desc: 'Our intelligent processing system evaluates inventory and order conditions for automated zero-overselling.',
      icon: Cpu,
      tag: 'Intelligent System'
    },
    {
      num: '04',
      title: 'Track',
      desc: 'Follow your order from placement to completion with transparent, real-time milestone updates.',
      icon: Navigation,
      tag: 'Live Telemetry'
    }
  ];

  return (
    <section id="how-it-works" style={{ padding: '5.5rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#167733',
          marginBottom: '0.5rem'
        }}>
          Simple & Reliable
        </div>
        <h2 style={{
          fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#0F172A'
        }}>
          How Shakthi-Acentra Works
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '540px', margin: '0.5rem auto 0', lineHeight: 1.5 }}>
          Four streamlined steps designed to take the friction out of essential healthcare procurement.
        </p>
      </div>

      {/* Steps Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2rem',
        position: 'relative'
      }}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="interactive-card"
              style={{
                padding: '2rem 1.75rem',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                position: 'relative',
                background: '#FFFFFF'
              }}
            >
              {/* Step Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  backgroundColor: '#ECFDF5',
                  color: '#167733',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={26} strokeWidth={2.2} />
                </div>
                <span style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#E2E8F0'
                }}>
                  {step.num}
                </span>
              </div>

              {/* Title & Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#167733', letterSpacing: '0.04em' }}>
                  {step.tag}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>

              {/* Arrow Indicator */}
              {idx < steps.length - 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#94A3B8'
                }}>
                  <span>Next Step</span>
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action */}
      <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
        <Link to="/products" className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
          <span>Get Started Today</span>
          <ArrowRight size={18} />
        </Link>
      </div>

    </section>
  );
}
