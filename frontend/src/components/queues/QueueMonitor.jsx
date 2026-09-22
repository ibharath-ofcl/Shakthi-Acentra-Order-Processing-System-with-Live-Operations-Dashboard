import React from 'react';
import { Layers, RotateCcw, ShieldAlert, CheckCircle2, AlertOctagon, Radio } from 'lucide-react';

export function QueueMonitor({ stats, dlqCount }) {
  const waitingCount = stats?.ordersByStatus?.CREATED || 0;
  const processingCount = stats?.ordersByStatus?.PROCESSING || 0;
  const completedCount = stats?.eventsByType?.ORDER_COMPLETED || 0;
  const retriedCount = stats?.eventsByType?.ORDER_RETRIED || 0;
  const failedCount = stats?.eventsByType?.ORDER_FAILED || 0;
  const deadLetterCount = dlqCount !== undefined ? dlqCount : (stats?.dlqCount || 0);

  const queues = [
    {
      name: 'order.process.queue',
      exchange: 'acentra.order.exchange',
      exchangeType: 'Topic',
      routingKey: 'order.process',
      totalEvents: waitingCount + processingCount,
      activeLoad: processingCount,
      role: 'Primary Ingestion Buffer',
      status: 'OPERATIONAL',
      icon: Layers,
      color: 'var(--trust-blue)',
      badgeClass: 'badge-info',
    },
    {
      name: 'order.retry.queue',
      exchange: 'acentra.retry.exchange',
      exchangeType: 'Direct',
      routingKey: 'order.retry',
      totalEvents: retriedCount,
      activeLoad: retriedCount,
      role: '5s Exponential Retry Loop',
      status: retriedCount > 0 ? 'DELAY ACTIVE' : 'STANDBY',
      icon: RotateCcw,
      color: 'var(--status-warning-text)',
      badgeClass: retriedCount > 0 ? 'badge-warning' : 'badge-neutral',
    },
    {
      name: 'order.dlq',
      exchange: 'acentra.dlx',
      exchangeType: 'Direct',
      routingKey: 'order.dlq',
      totalEvents: deadLetterCount,
      activeLoad: deadLetterCount,
      role: 'Quarantine & Exception Queue',
      status: deadLetterCount > 0 ? 'EXCEPTIONS FOUND' : 'CLEAR',
      icon: ShieldAlert,
      color: deadLetterCount > 0 ? 'var(--status-danger-text)' : 'var(--status-success-text)',
      badgeClass: deadLetterCount > 0 ? 'badge-danger' : 'badge-success',
    },
    {
      name: 'order.success.queue',
      exchange: 'acentra.order.exchange',
      exchangeType: 'Topic',
      routingKey: 'order.completed',
      totalEvents: completedCount,
      activeLoad: completedCount,
      role: 'Fulfillment Audit Stream',
      status: 'OPERATIONAL',
      icon: CheckCircle2,
      color: 'var(--status-success-text)',
      badgeClass: 'badge-success',
    },
    {
      name: 'order.failed.queue',
      exchange: 'acentra.order.exchange',
      exchangeType: 'Topic',
      routingKey: 'order.failed',
      totalEvents: failedCount,
      activeLoad: failedCount,
      role: 'Fatal Exception Archive',
      status: failedCount > 0 ? 'EXCEPTIONS' : 'CLEAR',
      icon: AlertOctagon,
      color: 'var(--text-muted)',
      badgeClass: 'badge-neutral',
    },
  ];

  return (
    <div className="panel clinical-queue-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Layers size={16} className="text-teal" />
          <span>RabbitMQ Broker Telemetry & Queue Routing</span>
          <span className="badge badge-success font-mono">AMQP 0-9-1 HEALTHY</span>
        </div>

        <div className="queue-connection-badge font-mono">
          <Radio size={12} className="text-teal" />
          <span>Host: rabbitmq:5672 | vhost: / | Protocol: AMQP</span>
        </div>
      </div>

      <div className="panel-body">
        <div className="queue-cards-grid">
          {queues.map((q) => {
            const Icon = q.icon;

            return (
              <div key={q.name} className="clinical-queue-card">
                <div className="q-card-head">
                  <div className="q-title-wrap">
                    <Icon size={16} style={{ color: q.color }} />
                    <span className="q-name font-mono">{q.name}</span>
                  </div>
                  <span className={`badge badge-sm ${q.badgeClass}`}>{q.status}</span>
                </div>

                <div className="q-specs-list">
                  <div className="q-spec-item">
                    <span className="q-lbl">Role:</span>
                    <span className="q-val">{q.role}</span>
                  </div>
                  <div className="q-spec-item">
                    <span className="q-lbl">Exchange:</span>
                    <span className="q-val font-mono">{q.exchange} ({q.exchangeType})</span>
                  </div>
                  <div className="q-spec-item">
                    <span className="q-lbl">Routing Key:</span>
                    <span className="q-val font-mono">{q.routingKey}</span>
                  </div>
                </div>

                <div className="q-stat-row">
                  <div className="q-stat-box">
                    <span className="q-stat-val font-mono" style={{ color: q.color }}>
                      {q.totalEvents}
                    </span>
                    <span className="q-stat-label">Total Messages</span>
                  </div>
                  <div className="q-stat-box">
                    <span className="q-stat-val font-mono">
                      {q.activeLoad}
                    </span>
                    <span className="q-stat-label">In Pipeline</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .text-teal {
          color: var(--primary-teal);
        }

        .queue-connection-badge {
          font-size: 0.725rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .queue-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .clinical-queue-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1.125rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          box-shadow: var(--shadow-xs);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .clinical-queue-card:hover {
          border-color: var(--border-medium);
          box-shadow: var(--shadow-sm);
        }

        .q-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.625rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .q-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .q-name {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .q-specs-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .q-spec-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.725rem;
        }

        .q-lbl {
          color: var(--text-muted);
        }

        .q-val {
          color: var(--text-secondary);
        }

        .q-stat-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-sm);
          padding: 0.625rem 0.75rem;
          border: 1px solid var(--border-subtle);
        }

        .q-stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .q-stat-val {
          font-size: 1.125rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .q-stat-label {
          font-size: 0.675rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
