import React from 'react';
import { ShoppingBag, FileCheck, Cpu, Truck, CheckCircle, ShieldCheck } from 'lucide-react';

export default function SmartCommerce() {
  const steps = [
    {
      num: '01',
      title: 'Shop & Verify',
      subtitle: 'Browse clinical grade products with real-time stock guaranteed before you submit.',
      icon: ShoppingBag,
      color: '#167733',
      bg: '#DCFCE7'
    },
    {
      num: '02',
      title: 'Intelligent Order',
      subtitle: 'Instant non-blocking order confirmation with automated allocation protection.',
      icon: FileCheck,
      color: '#0284C7',
      bg: '#E0F2FE'
    },
    {
      num: '03',
      title: 'Smart Fulfillment',
      subtitle: 'Autonomous inventory reservation ensures zero overselling and clinical accuracy.',
      icon: Cpu,
      color: '#0D9488',
      bg: '#CCFBF1'
    },
    {
      num: '04',
      title: 'Rapid Delivery',
      subtitle: 'Continuous transparency and live milestone tracking all the way to your clinic.',
      icon: Truck,
      color: '#167733',
      bg: '#DCFCE7'
    }
  ];

  return (
    <section id="smart-commerce" style={{
      padding: '5.5rem 1.5rem',
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Subtle Gradient Glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(22, 119, 51, 0.25) 0%, rgba(15, 23, 42, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.35rem 0.9rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#4ADE80',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1rem'
          }}>
            <ShieldCheck size={14} />
            <span>Intelligent Architecture</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            lineHeight: 1.15
          }}>
            More than a medical marketplace.
          </h2>
          <p style={{
            fontSize: '1.15rem',
            color: '#94A3B8',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Every order is intelligently orchestrated behind the scenes. From multi-item inventory reservation to emergency hospital dispatch, your supply chain never sleeps.
          </p>
        </div>

        {/* Animated Flow Stepper */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          position: 'relative'
        }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(51, 65, 85, 0.8)',
                  borderRadius: '20px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  position: 'relative',
                  transition: 'transform 0.3s ease, border-color 0.3s ease'
                }}
                className="smart-step-card"
              >
                {/* Step Number */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: step.bg,
                    color: step.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={24} strokeWidth={2.2} />
                  </div>
                  <span style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#64748B'
                  }}>
                    {step.num}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.4rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.5 }}>
                    {step.subtitle}
                  </p>
                </div>

                {/* Status Indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#4ADE80',
                  marginTop: 'auto',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(51, 65, 85, 0.6)'
                }}>
                  <CheckCircle size={14} />
                  <span>Autonomous Check Verified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Pulse Conduit Graphic */}
        <div style={{
          marginTop: '3.5rem',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(51, 65, 85, 0.8)',
          borderRadius: '18px',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              boxShadow: '0 0 12px #22C55E'
            }} />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC' }}>
                Zero-Overselling Concurrency Engine Active
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                Automated stock verification runs concurrently with sub-millisecond precision.
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            fontSize: '0.85rem',
            fontFamily: 'JetBrains Mono',
            color: '#A7F3D0'
          }}>
            <span>SHOP</span>
            <span>➔</span>
            <span>ALLOCATE</span>
            <span>➔</span>
            <span>DISPATCH</span>
          </div>
        </div>

      </div>

      <style>{`
        .smart-step-card:hover {
          transform: translateY(-4px);
          border-color: #22C55E;
        }
      `}</style>
    </section>
  );
}
