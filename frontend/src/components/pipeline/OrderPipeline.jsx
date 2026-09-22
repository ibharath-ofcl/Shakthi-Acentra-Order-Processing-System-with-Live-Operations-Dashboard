import React from 'react';
import { 
  Inbox, 
  Cpu, 
  CheckSquare, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Clock
} from 'lucide-react';

export function OrderPipeline({ orders, events, onSelectOrder }) {
  // Map orders into pipeline buckets
  const receivedOrders = orders.filter((o) => o.status === 'CREATED');
  const processingOrders = orders.filter((o) => o.status === 'PROCESSING' || o.status === 'PENDING_PAYMENT');
  
  // Identify orders where inventory was reserved recently
  const inventoryReservedOrderNumbers = new Set(
    events.filter((e) => e.eventType === 'INVENTORY_RESERVED').map((e) => e.orderNumber)
  );

  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const failedOrders = orders.filter((o) => 
    o.status === 'FAILED' || 
    o.status === 'INSUFFICIENT_STOCK' || 
    o.status === 'PAYMENT_FAILED' || 
    o.status === 'CANCELLED'
  );

  const stages = [
    {
      id: 'received',
      name: '1. Received',
      subtext: 'Enqueued in RabbitMQ',
      icon: Inbox,
      orders: receivedOrders,
      badgeClass: 'badge-neutral',
      color: 'var(--text-secondary)',
    },
    {
      id: 'processing',
      name: '2. Processing',
      subtext: 'Worker active',
      icon: Cpu,
      orders: processingOrders,
      badgeClass: 'badge-info',
      color: 'var(--status-info-text)',
    },
    {
      id: 'reserved',
      name: '3. Inventory Reserved',
      subtext: 'Zero-overselling lock',
      icon: CheckSquare,
      // Recent orders with inventory reserved
      orders: orders.filter((o) => inventoryReservedOrderNumbers.has(o.orderNumber) && o.status !== 'CREATED'),
      badgeClass: 'badge-warning',
      color: 'var(--status-warning-text)',
    },
    {
      id: 'final',
      name: '4. Final State',
      subtext: 'Completed / Failed',
      icon: CheckCircle,
      orders: [...completedOrders, ...failedOrders],
      badgeClass: 'badge-success',
      color: 'var(--bright-green)',
    },
  ];

  return (
    <div className="panel pipeline-panel">
      <div className="panel-header">
        <div className="panel-title">
          <span>Live Order Pipeline</span>
          <span className="badge badge-info">EVENT-DRIVEN</span>
        </div>
        <span className="pipeline-legend">
          Click any order card to inspect complete audit lifecycle
        </span>
      </div>

      <div className="pipeline-body">
        <div className="stages-container">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const hasNext = index < stages.length - 1;

            return (
              <React.Fragment key={stage.id}>
                <div className="pipeline-stage">
                  <div className="stage-header">
                    <div className="stage-title-wrap">
                      <Icon size={15} style={{ color: stage.color }} />
                      <span className="stage-name">{stage.name}</span>
                    </div>
                    <span className={`badge ${stage.badgeClass}`}>
                      {stage.orders.length}
                    </span>
                  </div>
                  <div className="stage-subtext">{stage.subtext}</div>

                  <div className="stage-cards-list">
                    {stage.orders.length === 0 ? (
                      <div className="stage-empty">
                        <span>No orders active</span>
                      </div>
                    ) : (
                      stage.orders.slice(0, 6).map((order) => {
                        const isCompleted = order.status === 'COMPLETED';
                        const isFailed = order.status.includes('FAIL') || order.status.includes('STOCK');

                        return (
                          <div
                            key={order.orderNumber}
                            onClick={() => onSelectOrder(order.orderNumber)}
                            className={`pipeline-order-card ${isCompleted ? 'card-completed' : ''} ${isFailed ? 'card-failed' : ''}`}
                          >
                            <div className="card-top">
                              <span className="order-number font-mono">{order.orderNumber}</span>
                              <span className={`badge badge-sm ${isCompleted ? 'badge-success' : isFailed ? 'badge-danger' : 'badge-info'}`}>
                                {order.status}
                              </span>
                            </div>

                            <div className="card-details">
                              <span className="customer-id font-mono">{order.customerId}</span>
                              <span className="order-amount font-mono">${order.totalAmount?.toFixed(2)}</span>
                            </div>

                            <div className="card-footer">
                              <span className="item-count">
                                {order.items?.length || 0} items
                              </span>
                              <span className="timestamp font-mono">
                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {hasNext && (
                  <div className="stage-arrow">
                    <ArrowRight size={18} color="var(--border-strong)" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <style>{`
        .pipeline-panel {
          margin-bottom: 0.5rem;
        }

        .pipeline-legend {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .pipeline-body {
          padding: 1rem;
          overflow-x: auto;
        }

        .stages-container {
          display: flex;
          align-items: stretch;
          gap: 0.75rem;
          min-width: 900px;
        }

        .pipeline-stage {
          flex: 1;
          background-color: rgba(11, 30, 43, 0.5);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.875rem;
          display: flex;
          flex-direction: column;
        }

        .stage-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .stage-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stage-name {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stage-subtext {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }

        .stage-cards-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
          min-height: 140px;
        }

        .stage-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          color: var(--text-disabled);
          font-size: 0.75rem;
          font-style: italic;
          border: 1px dashed var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1.5rem 0.5rem;
        }

        .pipeline-order-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.625rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          cursor: pointer;
          transition: transform 0.1s ease, border-color 0.15s ease, background-color 0.15s ease;
        }

        .pipeline-order-card:hover {
          border-color: var(--border-active);
          background-color: var(--bg-surface-elevated);
          transform: translateY(-1px);
        }

        .card-completed {
          border-left: 3px solid var(--primary-green);
        }

        .card-failed {
          border-left: 3px solid var(--status-danger-border);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .order-number {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--white);
        }

        .card-details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
        }

        .customer-id {
          color: var(--text-secondary);
        }

        .order-amount {
          color: var(--bright-green);
          font-weight: 600;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.7rem;
          color: var(--text-muted);
          border-top: 1px solid rgba(25, 56, 76, 0.4);
          padding-top: 0.35rem;
          margin-top: 0.2rem;
        }

        .stage-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
