import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  ShieldAlert 
} from 'lucide-react';

export function CommandSummary({ stats, dlqCount, inventoryRisks }) {
  const processingCount = stats?.ordersByStatus?.PROCESSING || 0;
  const completedCount = stats?.ordersByStatus?.COMPLETED || 0;
  const awaitingCount = stats?.ordersByStatus?.CREATED || 0;
  const activeRetries = stats?.eventsByType?.ORDER_RETRIED || 0;
  const dlqMessages = dlqCount !== undefined ? dlqCount : (stats?.dlqCount || 0);

  const metrics = [
    {
      id: 'processing',
      label: 'Orders in Processing',
      value: processingCount,
      subtext: 'Active in RabbitMQ worker pool',
      icon: Activity,
      color: 'var(--trust-blue)',
      topBorder: 'var(--trust-blue)',
      badge: processingCount > 0 ? 'ACTIVE WORKERS' : 'IDLE',
      badgeClass: processingCount > 0 ? 'badge-info' : 'badge-neutral',
    },
    {
      id: 'completed',
      label: 'Verified & Completed',
      value: completedCount,
      subtext: 'Fulfillment & stock locked',
      icon: CheckCircle2,
      color: 'var(--status-success-text)',
      topBorder: 'var(--status-success-text)',
      badge: 'STABLE',
      badgeClass: 'badge-success',
    },
    {
      id: 'awaiting',
      label: 'Awaiting Pipeline',
      value: awaitingCount,
      subtext: 'Queued in intake buffer',
      icon: Clock,
      color: 'var(--text-secondary)',
      topBorder: 'var(--border-medium)',
      badge: 'ENQUEUED',
      badgeClass: 'badge-neutral',
    },
    {
      id: 'inventory-risks',
      label: 'Supply Chain Risks',
      value: inventoryRisks || 0,
      subtext: 'Items below safety threshold',
      icon: AlertTriangle,
      color: inventoryRisks > 0 ? 'var(--status-warning-text)' : 'var(--text-muted)',
      topBorder: inventoryRisks > 0 ? 'var(--status-warning-text)' : 'var(--border-subtle)',
      badge: inventoryRisks > 0 ? 'ATTENTION' : 'HEALTHY',
      badgeClass: inventoryRisks > 0 ? 'badge-warning' : 'badge-success',
    },
    {
      id: 'retries',
      label: 'Active Retry Cycles',
      value: activeRetries,
      subtext: '5s exponential backoff buffer',
      icon: RotateCcw,
      color: activeRetries > 0 ? 'var(--status-warning-text)' : 'var(--text-muted)',
      topBorder: activeRetries > 0 ? 'var(--status-warning-text)' : 'var(--border-subtle)',
      badge: activeRetries > 0 ? 'BACKOFF' : 'NONE',
      badgeClass: activeRetries > 0 ? 'badge-warning' : 'badge-neutral',
    },
    {
      id: 'dlq',
      label: 'Quarantined Orders (DLQ)',
      value: dlqMessages,
      subtext: 'Actionable clinical exceptions',
      icon: ShieldAlert,
      color: dlqMessages > 0 ? 'var(--status-danger-text)' : 'var(--text-muted)',
      topBorder: dlqMessages > 0 ? 'var(--status-danger-text)' : 'var(--border-subtle)',
      badge: dlqMessages > 0 ? 'ACTION REQUIRED' : 'CLEAR',
      badgeClass: dlqMessages > 0 ? 'badge-danger' : 'badge-success',
    },
  ];

  return (
    <div className="summary-grid">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div 
            key={metric.id}
            className="summary-card"
            style={{ borderTop: `3px solid ${metric.topBorder}` }}
          >
            <div className="card-top-row">
              <span className="card-title-text">{metric.label}</span>
              <span className={`badge badge-sm ${metric.badgeClass}`}>
                {metric.badge}
              </span>
            </div>

            <div className="card-value-wrap">
              <span className="card-numeric-val font-mono" style={{ color: metric.color }}>
                {metric.value}
              </span>
              <div className="card-icon-bubble" style={{ color: metric.color }}>
                <Icon size={18} />
              </div>
            </div>

            <div className="card-subtext">{metric.subtext}</div>
          </div>
        );
      })}

      <style>{`
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 1.25rem;
        }

        .summary-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.25rem 1.35rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          box-shadow: var(--shadow-sm);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .summary-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-medium);
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .card-title-text {
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--text-secondary);
          letter-spacing: -0.01em;
        }

        .card-value-wrap {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-top: 0.25rem;
        }

        .card-numeric-val {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
        }

        .card-icon-bubble {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-subtext {
          font-size: 0.725rem;
          color: var(--text-muted);
          line-height: 1.3;
        }
      `}</style>
    </div>
  );
}

export default CommandSummary;

