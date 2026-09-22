import React from 'react';
import { ShieldCheck, Eye, Cpu, Navigation } from 'lucide-react';

export default function TrustSection() {
  const benefits = [
    {
      title: 'Reliable Products',
      desc: 'Quality-focused medical essentials tested for clinical longevity and performance.',
      icon: ShieldCheck,
      color: '#167733',
      bg: '#DCFCE7'
    },
    {
      title: 'Live Availability',
      desc: 'Know exactly what is physically in stock before ordering with zero surprise backorders.',
      icon: Eye,
      color: '#0284C7',
      bg: '#E0F2FE'
    },
    {
      title: 'Intelligent Processing',
      desc: 'Orders are dynamically evaluated and fulfilled with automated allocation precision.',
      icon: Cpu,
      color: '#0D9488',
      bg: '#CCFBF1'
    },
    {
      title: 'Transparent Tracking',
      desc: 'Track your medical supplies at every milestone from confirmation to sterile receipt.',
      icon: Navigation,
      color: '#D97706',
      bg: '#FEF3C7'
    }
  ];

  return (
    <section style={{ padding: '5.5rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#167733',
          marginBottom: '0.5rem'
        }}>
          Why Shakthi-Acentra
        </div>
        <h2 style={{
          fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#0F172A'
        }}>
          Built for Healthcare Trust
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '520px', margin: '0.5rem auto 0', lineHeight: 1.5 }}>
          Designed specifically to give clinical providers confidence in their supply chain.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2rem'
      }}>
        {benefits.map(b => {
          const Icon = b.icon;
          return (
            <div
              key={b.title}
              className="interactive-card"
              style={{
                padding: '2.25rem 1.75rem',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                background: '#FFFFFF'
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: b.bg,
                color: b.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={26} strokeWidth={2.2} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
