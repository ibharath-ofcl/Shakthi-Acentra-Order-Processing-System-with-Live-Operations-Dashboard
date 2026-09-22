import React from 'react';
import { Truck, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function IntelligentFulfillment() {
  const incomingOrders = [
    { id: 'ORD-8821', hospital: 'St. Jude Emergency Center', items: 'Pulse Oximeters (10x)', priority: 'Emergency Triage', tag: 'Fast-Track' },
    { id: 'ORD-8822', hospital: 'Mercy Surgical Institute', items: 'Surgical Nitrile Gloves (50x)', priority: 'High Priority', tag: 'Sterile Reserve' },
    { id: 'ORD-8823', hospital: 'Metro General Pediatrics', items: 'Ultrasonic Nebulizers (5x)', priority: 'Standard Clinic', tag: 'Standard' },
    { id: 'ORD-8824', hospital: 'City Care ICU Ward', items: 'Digital BP Monitors (8x)', priority: 'High Priority', tag: 'Fast-Track' }
  ];

  return (
    <section style={{
      padding: '5rem 1.5rem',
      backgroundColor: '#F8FAFC',
      borderTop: '1px solid #E2E8F0',
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#167733',
            marginBottom: '0.5rem'
          }}>
            Automated Multi-Stream Processing
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#0F172A'
          }}>
            Intelligent Order Fulfillment
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '580px', margin: '0.5rem auto 0', lineHeight: 1.5 }}>
            Simultaneous clinic requests are intelligently evaluated, matched with live inventory reserves, and routed for express fulfillment.
          </p>
        </div>

        {/* Fulfillment Diagram Canvas */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          
          {/* Left Column: Incoming Order Streams */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em' }}>
              Incoming Clinical Requests
            </div>

            {incomingOrders.map((ord, i) => (
              <div
                key={ord.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {ord.id}
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      backgroundColor: ord.tag === 'Fast-Track' ? '#DCFCE7' : '#E0F2FE',
                      color: ord.tag === 'Fast-Track' ? '#15803D' : '#0284C7'
                    }}>
                      {ord.priority}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginTop: '0.2rem' }}>
                    {ord.hospital}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    {ord.items}
                  </div>
                </div>

                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
              </div>
            ))}
          </div>

          {/* Center: Smart Fulfillment Processing Core */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '20px',
            padding: '2rem',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            position: 'relative',
            boxShadow: '0 15px 35px -10px rgba(15, 23, 42, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#167733',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Zap size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  Smart Fulfillment Hub
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  Real-time inventory coordination
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A7F3D0' }}>
                <CheckCircle2 size={16} />
                <span>Zero-Overselling Concurrency Protection</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A7F3D0' }}>
                <CheckCircle2 size={16} />
                <span>Dynamic Hospital Urgency Prioritization</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A7F3D0' }}>
                <CheckCircle2 size={16} />
                <span>Batch Allocation & Automated Packaging</span>
              </div>
            </div>

            {/* Simulated Live Velocity Ticker */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Dispatch Rate:</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem', fontWeight: 700, color: '#4ADE80' }}>
                100% On-Time Allocation
              </span>
            </div>
          </div>

          {/* Right Column: Outbound Clinical Delivery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em' }}>
              Outbound Express Delivery
            </div>

            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#167733',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Truck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                    Express Cold-Chain & Sterile Transit
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600 }}>
                    En Route to Regional Clinics
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                Every dispatched parcel is tracked end-to-end with real-time temperature telemetry and verified custodial handoff.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#167733',
              padding: '0.75rem 1rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E2E8F0'
            }}>
              <ShieldCheck size={18} />
              <span>Full Medical Chain-of-Custody</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
