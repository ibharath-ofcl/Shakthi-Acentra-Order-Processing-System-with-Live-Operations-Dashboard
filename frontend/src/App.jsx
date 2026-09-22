import React, { useState, useEffect } from 'react';
import { useLiveTelemetry } from './services/liveSync';
import { ComplianceBanner } from './components/layout/ComplianceBanner';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { CommandSummary } from './components/summary/CommandSummary';
import { DemoControls } from './components/demo/DemoControls';
import { ArchitecturalPipeline3D } from './components/pipeline/ArchitecturalPipeline3D';
import { OperationsFeed } from './components/feed/OperationsFeed';
import { InventoryPressure } from './components/inventory/InventoryPressure';
import { QueueMonitor } from './components/queues/QueueMonitor';
import { FailureDLQCenter } from './components/dlq/FailureDLQCenter';
import { SystemHealth } from './components/health/SystemHealth';
import { OrdersTable } from './components/orders/OrdersTable';
import { OrderInspector } from './components/inspector/OrderInspector';
import { AlertCircle } from 'lucide-react';

export function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('acentra-theme') || 'light';
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrderNumber, setSelectedOrderNumber] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('acentra-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const {
    statistics,
    events,
    orders,
    inventory,
    dlqItems,
    health,
    isLive,
    toggleLive,
    refreshNow,
    lastSyncTime,
    isLoading,
    error,
  } = useLiveTelemetry(2000);

  const lowStockItems = inventory.filter((item) => (item.availableStock || 0) < 10);
  const pendingDlqItems = dlqItems.filter((item) => item.status === 'PENDING_REVIEW');
  const dlqCount = pendingDlqItems.length;

  return (
    <div className="app-container" data-theme={theme}>
      {/* Prominent Trust & Compliance Signals */}
      <ComplianceBanner
        totalAuditEvents={events.length}
        isHealthy={health?.status === 'UP'}
      />

      {/* Institutional Clinical Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        isLive={isLive}
        toggleLive={toggleLive}
        refreshNow={refreshNow}
        lastSyncTime={lastSyncTime}
        health={health}
        dlqCount={dlqCount}
      />

      {/* Sub-navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={statistics}
        dlqCount={dlqCount}
        lowStockCount={lowStockItems.length}
      />

      {/* Main Clinical Operations Workspace */}
      <main className="main-content">
        {error && (
          <div className="clinical-error-banner">
            <AlertCircle size={16} />
            <span>Telemetry link degraded: {error}. Automatic re-establishment in progress...</span>
          </div>
        )}

        {/* Global Operational Metrics Summary */}
        <CommandSummary
          stats={statistics}
          dlqCount={dlqCount}
          inventoryRisks={lowStockItems.length}
        />

        {/* Operational Validation & Simulation Workbench */}
        <DemoControls
          inventory={inventory}
          onOrderCreated={refreshNow}
        />

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="tab-stack-generous">
            {/* Hero 3D Architectural Pipeline Element */}
            <ArchitecturalPipeline3D
              orders={orders}
              events={events}
              onSelectOrder={(ord) => setSelectedOrderNumber(ord)}
              theme={theme}
            />

            <div className="clinical-columns-grid">
              <div className="column-primary">
                <InventoryPressure
                  inventory={inventory}
                  onRefresh={refreshNow}
                />
                <QueueMonitor
                  stats={statistics}
                  dlqCount={dlqCount}
                />
              </div>

              <div className="column-secondary">
                <OperationsFeed
                  events={events}
                  onSelectOrder={(ord) => setSelectedOrderNumber(ord)}
                />
                {dlqCount > 0 && (
                  <FailureDLQCenter
                    dlqItems={dlqItems}
                    onRefresh={refreshNow}
                    onSelectOrder={(ord) => setSelectedOrderNumber(ord)}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders & Pipeline */}
        {activeTab === 'orders' && (
          <div className="tab-stack-generous">
            <ArchitecturalPipeline3D
              orders={orders}
              events={events}
              onSelectOrder={(ord) => setSelectedOrderNumber(ord)}
              theme={theme}
            />
            <OrdersTable
              orders={orders}
              onSelectOrder={(ord) => setSelectedOrderNumber(ord)}
            />
          </div>
        )}

        {/* Tab 3: Inventory Pressure */}
        {activeTab === 'inventory' && (
          <div className="tab-stack-generous">
            <InventoryPressure
              inventory={inventory}
              onRefresh={refreshNow}
            />
          </div>
        )}

        {/* Tab 4: Processing & Queues */}
        {activeTab === 'processing' && (
          <div className="tab-stack-generous">
            <QueueMonitor
              stats={statistics}
              dlqCount={dlqCount}
            />
            <OperationsFeed
              events={events}
              onSelectOrder={(ord) => setSelectedOrderNumber(ord)}
            />
          </div>
        )}

        {/* Tab 5: Quarantine & DLQ Center */}
        {activeTab === 'dlq' && (
          <div className="tab-stack-generous">
            <FailureDLQCenter
              dlqItems={dlqItems}
              onRefresh={refreshNow}
              onSelectOrder={(ord) => setSelectedOrderNumber(ord)}
            />
          </div>
        )}

        {/* Tab 6: Cluster Diagnostics */}
        {activeTab === 'health' && (
          <div className="tab-stack-generous">
            <SystemHealth health={health} />
          </div>
        )}
      </main>

      {/* Clinical Order Verification Dossier Modal */}
      {selectedOrderNumber && (
        <OrderInspector
          orderNumber={selectedOrderNumber}
          events={events}
          onClose={() => setSelectedOrderNumber(null)}
        />
      )}

      <style>{`
        .clinical-error-banner {
          background-color: var(--status-danger-bg);
          border: 1px solid var(--status-danger-border);
          color: var(--status-danger-text);
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .tab-stack-generous {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .clinical-columns-grid {
          display: grid;
          grid-template-columns: 1.65fr 1fr;
          gap: 1.75rem;
          align-items: start;
        }

        .column-primary, .column-secondary {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        @media (max-width: 1200px) {
          .clinical-columns-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
