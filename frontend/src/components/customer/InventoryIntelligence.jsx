import React from 'react';
import { CheckCircle, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InventoryIntelligence() {
  const stockItems = [
    {
      name: 'Pulse Oximeter Pro',
      sku: 'MED-OX-201',
      category: 'Diagnostics',
      percent: 85,
      status: 'Available',
      statusType: 'available',
      note: 'Optimal clinical reserve'
    },
    {
      name: 'Sterile Nitrile Surgical Gloves',
      sku: 'MED-GL-403',
      category: 'PPE',
      percent: 92,
      status: 'Available',
      statusType: 'available',
      note: 'Bulk hospital cartons ready'
    },
    {
      name: 'Digital Blood Pressure Monitor',
      sku: 'MED-BP-302',
      category: 'Monitoring',
      percent: 45,
      status: 'Limited Stock',
      statusType: 'limited',
      note: 'High demand from regional ICUs'
    },
    {
      name: 'Ultrasonic Mesh Nebulizer',
      sku: 'MED-NEB-504',
      category: 'Consumables',
      percent: 35,
      status: 'Limited Stock',
      statusType: 'limited',
      note: 'Order soon to secure batch allocation'
    },
    {
      name: 'Sterile Luer-Lock IV Sets',
      sku: 'MED-IV-706',
      category: 'Surgical Supplies',
      percent: 78,
      status: 'Available',
      statusType: 'available',
      note: 'Guaranteed dispatch within 24h'
    }
  ];

  return (
    <section style={{ padding: '5.5rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '4rem',
        alignItems: 'center'
      }}>
        
        {/* Left Editorial Copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#167733'
          }}>
            Real-Time Precision
          </div>

          <h2 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#0F172A',
            lineHeight: 1.15
          }}>
            Always know what's available.
          </h2>

          <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6 }}>
            Real-time inventory intelligence helps keep availability accurate while reducing fulfillment surprises. When you place an order on Shakthi-Acentra, stock is immediately allocated to your facility.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
                <CheckCircle size={14} />
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>Guaranteed Zero Overselling:</strong>
                <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>Every item shown as available is physically verified in our climate-controlled warehouse.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
                <ShieldCheck size={14} />
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>Batch & Lot Traceability:</strong>
                <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>Sterile products are dispatched with complete lot and expiration transparency.</p>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '0.5rem' }}>
            <Link to="/products" className="btn-primary" style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}>
              <span>Browse In-Stock Catalog</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Right Live Stock Meter Cards */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 12px 30px -8px rgba(15, 23, 42, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.04em' }}>
              Live Warehouse Availability
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#167733' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
              <span>Live Synchronized</span>
            </div>
          </div>

          {stockItems.map(item => (
            <div key={item.sku} style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginLeft: '6px' }}>
                    ({item.category})
                  </span>
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  backgroundColor: item.statusType === 'available' ? '#DCFCE7' : '#FEF3C7',
                  color: item.statusType === 'available' ? '#15803D' : '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {item.statusType === 'available' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                  <span>{item.status}</span>
                </span>
              </div>

              {/* Visual Stock Bar */}
              <div style={{
                height: '8px',
                width: '100%',
                backgroundColor: '#F1F5F9',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${item.percent}%`,
                  backgroundColor: item.statusType === 'available' ? '#167733' : '#D97706',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease-out'
                }} />
              </div>

              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {item.note}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
