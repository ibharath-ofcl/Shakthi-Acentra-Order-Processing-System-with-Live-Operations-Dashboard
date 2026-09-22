import React from 'react';
import { 
  LayoutDashboard, 
  GitCommitVertical, 
  Layers, 
  Server, 
  AlertTriangle, 
  Package
} from 'lucide-react';

export function Navigation({ activeTab, setActiveTab, stats, dlqCount, lowStockCount }) {
  const tabs = [
    { id: 'overview', label: 'Clinical Operations Overview', icon: LayoutDashboard },
    { 
      id: 'orders', 
      label: 'Patient Orders & Pipeline', 
      icon: GitCommitVertical,
      badge: stats?.totalOrders || null,
      badgeType: 'neutral'
    },
    { 
      id: 'inventory', 
      label: 'Sterile & Medical Inventory', 
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} LOW` : null,
      badgeType: lowStockCount > 0 ? 'warning' : null
    },
    { 
      id: 'processing', 
      label: 'RabbitMQ Routing Engine', 
      icon: Layers,
      badge: stats?.eventsByType?.ORDER_PROCESSING ? `${stats.eventsByType.ORDER_PROCESSING} ACTIVE` : null,
      badgeType: 'info'
    },
    { 
      id: 'dlq', 
      label: 'Quarantine & Exceptions (DLQ)', 
      icon: AlertTriangle,
      badge: dlqCount > 0 ? dlqCount : null,
      badgeType: dlqCount > 0 ? 'danger' : null
    },
    { id: 'health', label: 'Cluster Diagnostics', icon: Server },
  ];

  return (
    <nav className="clinical-nav">
      <div className="nav-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-button ${isActive ? 'nav-button-active' : ''}`}
            >
              <Icon size={16} className="nav-icon" />
              <span className="nav-text">{tab.label}</span>
              {tab.badge && (
                <span className={`badge badge-${tab.badgeType || 'neutral'} nav-badge font-mono`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        .clinical-nav {
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
          padding: 0 2rem;
          overflow-x: auto;
        }

        .nav-container {
          display: flex;
          gap: 0.5rem;
          max-width: 1720px;
          margin: 0 auto;
        }

        .nav-button {
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--text-muted);
          padding: 0.875rem 1rem;
          font-size: 0.8125rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
          font-family: var(--font-sans);
        }

        .nav-button:hover {
          color: var(--text-primary);
          background-color: var(--bg-subtle);
        }

        .nav-button-active {
          color: var(--primary-teal);
          border-bottom-color: var(--primary-teal);
          background-color: var(--primary-teal-light);
        }

        .nav-text {
          letter-spacing: -0.01em;
        }

        .nav-badge {
          font-size: 0.675rem;
          padding: 0.125rem 0.45rem;
          border-radius: 10px;
        }
      `}</style>
    </nav>
  );
}
