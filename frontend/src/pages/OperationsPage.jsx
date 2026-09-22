import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Layers,
  ShoppingBag,
  Package,
  AlertOctagon,
  Sparkles,
  Server,
  ArrowLeft,
  RefreshCw,
  Pause,
  Play,
  ShieldCheck
} from 'lucide-react';
import { useLiveTelemetry } from '../services/liveSync';
import { CommandSummary } from '../components/summary/CommandSummary';
import { ArchitecturalPipeline3D } from '../components/pipeline/ArchitecturalPipeline3D';
import { OperationsFeed } from '../components/feed/OperationsFeed';
import { InventoryPressure } from '../components/inventory/InventoryPressure';
import { QueueMonitor } from '../components/queues/QueueMonitor';
import { FailureDLQCenter } from '../components/dlq/FailureDLQCenter';
import { DemoControls } from '../components/demo/DemoControls';
import { SystemHealth } from '../components/health/SystemHealth';
import { OrdersTable } from '../components/orders/OrdersTable';
import { OrderInspector } from '../components/inspector/OrderInspector';
import OperationsIntelligence from '../components/operations/OperationsIntelligence';


export default function OperationsPage() {
  const { data, loading, error, isLive, toggleLive, syncNow, lastSyncTime } = useLiveTelemetry();
  const [activeTab, setActiveTab] = useState('overview');
  const [inspectedOrder, setInspectedOrder] = useState(null);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'orders', label: 'Order Ledger', icon: ShoppingBag },
    { id: 'processing', label: 'AMQP Processing', icon: Layers },
    { id: 'inventory', label: 'Supply & Locks', icon: Package },
    { id: 'dlq', label: 'Quarantine (DLQ)', icon: AlertOctagon },
    { id: 'intelligence', label: 'Intelligence Hub', icon: Sparkles },
    { id: 'health', label: 'System Health', icon: Server }
  ];

  return (
    <div data-theme="operations" style={{ minHeight: '100vh', backgroundColor: '#0B1320', color: '#F8FAFC' }}>
      
      {/* Operations Header */}
      <header style={{
        background: '#111C2E',
        borderBottom: '1px solid #273D5E',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {/* Left: Brand & Return */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94A3B8',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '0.4rem 0.75rem',
              backgroundColor: '#152238',
              borderRadius: '8px',
              border: '1px solid #273D5E'
            }}
          >
            <ArrowLeft size={14} />
            <span>Storefront</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#167733',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
                Shakthi-Acentra <span style={{ color: '#4ADE80', fontWeight: 600, fontSize: '0.8rem' }}>OPERATIONS</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: 'JetBrains Mono' }}>
                AMQP 0-9-1 Live Telemetry Console
              </div>
            </div>
          </div>
        </div>

        {/* Right: Telemetry Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#152238',
            border: '1px solid #273D5E',
            padding: '0.35rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.78rem',
            color: '#94A3B8'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isLive ? '#22C55E' : '#F59E0B',
              boxShadow: isLive ? '0 0 8px #22C55E' : 'none'
            }} />
            <span>{isLive ? 'Live Sync Active' : 'Polling Paused'}</span>
          </div>

          <button
            onClick={toggleLive}
            style={{
              background: '#152238',
              border: '1px solid #273D5E',
              color: '#F8FAFC',
              padding: '0.4rem 0.7rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem'
            }}
          >
            {isLive ? <Pause size={14} /> : <Play size={14} />}
            <span>{isLive ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={syncNow}
            style={{
              background: '#167733',
              border: 'none',
              color: '#FFFFFF',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 600
            }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Sync Now</span>
          </button>
        </div>
      </header>

      {/* Main Operations Container with Sidebar Layout */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        
        {/* Left Operations Sidebar */}
        <aside style={{
          width: '240px',
          background: '#111C2E',
          borderRight: '1px solid #273D5E',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em', padding: '0 0.75rem 0.5rem' }}>
            Control Center
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: active ? 'rgba(34, 197, 94, 0.4)' : 'transparent',
                  backgroundColor: active ? 'rgba(34, 197, 94, 0.12)' : 'transparent',
                  color: active ? '#4ADE80' : '#94A3B8',
                  fontSize: '0.88rem',
                  fontWeight: active ? 700 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #273D5E', padding: '1rem 0.5rem 0' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
              Cluster: RabbitMQ 3.13 + MySQL 8.0
            </div>
            <div style={{ fontSize: '0.72rem', color: '#4ADE80', fontWeight: 600, marginTop: '2px' }}>
              Pessimistic Locks Active
            </div>
          </div>
        </aside>

        {/* Right Content View */}
        <main style={{ flexGrow: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <CommandSummary
                stats={data.statistics}
                activeCount={data.orders.filter(o => o.status === 'PROCESSING' || o.status === 'PENDING').length}
                orders={data.orders}
              />

              <ArchitecturalPipeline3D orders={data.orders} queues={data.queues} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '2rem' }}>
                <OperationsFeed
                  events={data.events}
                  onSelectOrder={(ordId) => {
                    const match = data.orders.find(o => o.orderId === ordId || o.id === ordId);
                    if (match) setInspectedOrder(match);
                  }}
                />
                <InventoryPressure inventory={data.inventory} onRestocked={syncNow} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '2rem' }}>
                <QueueMonitor queues={data.queues} />
                <FailureDLQCenter dlqMessages={data.dlq} onReplayed={syncNow} />
              </div>

              <DemoControls onActionTriggered={syncNow} />
            </div>
          )}

          {/* TAB 2: ORDER LEDGER */}
          {activeTab === 'orders' && (
            <div>
              <OrdersTable
                orders={data.orders}
                onSelectOrder={(order) => setInspectedOrder(order)}
              />
            </div>
          )}

          {/* TAB 3: AMQP PROCESSING */}
          {activeTab === 'processing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <QueueMonitor queues={data.queues} />
              <OperationsFeed
                events={data.events}
                onSelectOrder={(ordId) => {
                  const match = data.orders.find(o => o.orderId === ordId || o.id === ordId);
                  if (match) setInspectedOrder(match);
                }}
              />
            </div>
          )}

          {/* TAB 4: INVENTORY & LOCKS */}
          {activeTab === 'inventory' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <InventoryPressure inventory={data.inventory} onRestocked={syncNow} />
            </div>
          )}

          {/* TAB 5: DLQ QUARANTINE */}
          {activeTab === 'dlq' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <FailureDLQCenter dlqMessages={data.dlq} onReplayed={syncNow} />
            </div>
          )}

          {/* TAB 6: INTELLIGENCE HUB */}
          {activeTab === 'intelligence' && (
            <OperationsIntelligence inventory={data.inventory} />
          )}

          {/* TAB 7: HEALTH */}
          {activeTab === 'health' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <SystemHealth healthData={data.health} />
            </div>
          )}

        </main>
      </div>

      {/* Order Inspector Modal */}
      {inspectedOrder && (
        <OrderInspector
          order={inspectedOrder}
          events={data.events}
          onClose={() => setInspectedOrder(null)}
        />
      )}

    </div>
  );
}
