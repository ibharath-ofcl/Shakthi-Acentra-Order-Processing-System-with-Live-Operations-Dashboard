import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, HeartPulse, Scissors, Package, Cross, ArrowRight } from 'lucide-react';
import ProductImage from '../common/ProductImage';

const CATEGORIES = [
  {
    id: 'ppe',
    name: 'PPE & Protection',
    description: 'Sterile gloves, barrier masks, and protective examination wear.',
    icon: ShieldCheck,
    color: '#0D9488',
    bgLight: '#F0FDFA',
    itemCount: '12 Items',
    image: '/images/products/surgical-gloves.jpg',
    sampleProduct: 'Sterile Surgical Gloves'
  },
  {
    id: 'diagnostics',
    name: 'Diagnostics',
    description: 'Precision pulse oximeters, infrared thermometers, and vital sensors.',
    icon: Activity,
    color: '#167733',
    bgLight: '#F0FDF4',
    itemCount: '18 Items',
    image: '/images/products/pulse-oximeter.jpg',
    sampleProduct: 'Pulse Oximeter Pro'
  },
  {
    id: 'monitoring',
    name: 'Patient Monitoring',
    description: 'Upper-arm blood pressure units and arrhythmia detection systems.',
    icon: HeartPulse,
    color: '#0284C7',
    bgLight: '#F0F9FF',
    itemCount: '9 Items',
    image: '/images/products/blood-pressure-monitor.jpg',
    sampleProduct: 'Digital BP Monitor'
  },
  {
    id: 'surgical',
    name: 'Surgical Supplies',
    description: 'Precision sterile IV administration sets, filtration, and Luer locks.',
    icon: Scissors,
    color: '#6366F1',
    bgLight: '#EEF2FF',
    itemCount: '14 Items',
    image: '/images/products/iv-set.jpg',
    sampleProduct: 'Sterile Luer-Lock IV Set'
  },
  {
    id: 'consumables',
    name: 'Clinical Consumables',
    description: 'Ultrasonic mesh nebulizers, safety syringes, and sterile disposables.',
    icon: Package,
    color: '#D97706',
    bgLight: '#FFFBEB',
    itemCount: '25 Items',
    image: '/images/products/nebulizer.jpg',
    sampleProduct: 'Ultrasonic Nebulizer'
  },
  {
    id: 'emergency',
    name: 'Emergency & Trauma',
    description: 'Rapid response trauma responder kits, tourniquets, and acute packs.',
    icon: Cross,
    color: '#BE123C',
    bgLight: '#FFF1F2',
    itemCount: '8 Items',
    image: '/images/products/trauma-kit.jpg',
    sampleProduct: 'Trauma Responder Kit'
  }
];

export default function CategoryShowcase() {
  return (
    <section id="categories" style={{
      padding: '5rem 1.5rem',
      backgroundColor: '#F8FAFC',
      borderTop: '1px solid #E2E8F0',
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3.5rem', gap: '0.75rem' }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#167733'
          }}>
            Explore Clinical Catalog
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#0F172A'
          }}>
            Medical Supply Categories
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: '#64748B',
            maxWidth: '560px',
            lineHeight: 1.5
          }}>
            Certified medical-grade essentials curated for hospitals, primary care practices, and mobile responder units.
          </p>
        </div>

        {/* Category Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                to={`/products?category=${cat.id}`}
                key={cat.id}
                className="interactive-card category-card"
                style={{
                  textDecoration: 'none',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '18px',
                  background: '#FFFFFF'
                }}
              >
                {/* Top Accent Stripe */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundColor: cat.color,
                  opacity: 0.8
                }} />

                {/* Real Medical Product Image Frame */}
                <div style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #F1F5F9',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ProductImage
                    src={cat.image}
                    alt={cat.sampleProduct}
                    aspectRatio={null}
                    style={{ height: '100%', width: '100%' }}
                    fallbackText={cat.sampleProduct}
                  />
                  {/* Category Badge Icon */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: cat.bgLight,
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.04)',
                    zIndex: 2
                  }} className="category-icon">
                    <Icon size={18} strokeWidth={2.2} />
                  </div>
                  {/* Product label tag */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: '#64748B',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #E2E8F0',
                    zIndex: 2
                  }}>
                    {cat.sampleProduct}
                  </div>
                </div>

                {/* Text Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#0F172A' }}>
                      {cat.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8' }}>
                      {cat.itemCount}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                    {cat.description}
                  </p>
                </div>

                {/* Explore Link */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: cat.color,
                  paddingTop: '0.5rem',
                  borderTop: '1px solid #F1F5F9'
                }}>
                  <span>Explore category</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>

      </div>

      <style>{`
        .category-card:hover .category-icon {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
}
