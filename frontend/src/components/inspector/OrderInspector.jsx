import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Package, 
  RotateCcw, 
  ShieldAlert, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { ordersApi } from '../../services/api';

export function OrderInspector({ orderNumber, events, onClose }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderNumber) return;

    let isMounted = true;
    setLoading(true);

    ordersApi.getOrderByNumber(orderNumber)
      .then((res) => {
        if (isMounted) {
          setOrderDetails(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [orderNumber]);

  const orderEvents = events
    .filter((e) => e.orderNumber === orderNumber)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  if (!orderNumber) return null;

  return (
    <div className="inspector-overlay" onClick={onClose}>
      <div className="inspector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inspector-header">
          <div className="header-meta">
            <FileText size={18} className="text-teal" />
            <div>
              <div className="inspector-title">Clinical Order Verification Dossier</div>
              <div className="inspector-order-id font-mono">{orderNumber}</div>
            </div>
          </div>
          <button onClick={onClose} className="close-btn" title="Close dossier">
            <X size={18} />
          </button>
        </div>

        <div className="inspector-body">
          {loading ? (
            <div className="inspector-loading font-mono">Retrieving encrypted audit trail...</div>
          ) : error ? (
            <div className="inspector-error font-mono">{error}</div>
          ) : orderDetails ? (
            <div className="inspector-content">
              {/* Clinical Verification Summary Cards */}
              <div className="meta-grid">
                <div className="meta-card">
                  <span className="meta-label">Patient / Customer Ref</span>
                  <span className="meta-val font-mono">{orderDetails.customerId}</span>
                </div>
                <div className="meta-card">
                  <span className="meta-label">Priority Tier</span>
                  <span className="meta-val font-mono">{orderDetails.customerTier}</span>
                </div>
                <div className="meta-card">
                  <span className="meta-label">Valuation</span>
                  <span className="meta-val font-mono text-green">₹{orderDetails.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="meta-card">
                  <span className="meta-label">Fulfillment State</span>
                  <span className={`badge ${orderDetails.status === 'COMPLETED' ? 'badge-success' : orderDetails.status === 'CREATED' ? 'badge-info' : 'badge-danger'}`}>
                    {orderDetails.status}
                  </span>
                </div>
              </div>

              {orderDetails.failureReason && (
                <div className="clinical-alert-box">
                  <AlertTriangle size={16} className="text-danger flex-shrink-0" />
                  <div className="alert-content">
                    <span className="alert-heading">DIAGNOSTIC EXCEPTION RECORD:</span>
                    <span className="alert-msg">{orderDetails.failureReason}</span>
                  </div>
                </div>
              )}

              {/* Verified Order Items Table */}
              <div className="section-title">
                <Package size={15} className="text-teal" />
                <span>Reserved Pharmaceutical & Clinical Items</span>
              </div>
              <div className="items-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>SKU Code</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.items?.map((item) => (
                      <tr key={item.id || item.sku}>
                        <td className="font-mono">{item.sku}</td>
                        <td>{item.productName}</td>
                        <td className="font-mono">{item.quantity}</td>
                        <td className="font-mono">₹{item.unitPrice?.toFixed(2)}</td>
                        <td className="font-mono">₹{item.subtotal?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Chronological Audit Timeline */}
              <div className="section-title">
                <Clock size={15} className="text-teal" />
                <span>Cryptographic Event Sequence (21 CFR Part 11 Compliant)</span>
              </div>

              <div className="clinical-timeline">
                {orderEvents.length === 0 ? (
                  <div className="timeline-empty-note font-mono">
                    Initial state: Created at {new Date(orderDetails.createdAt).toLocaleTimeString()}
                  </div>
                ) : (
                  orderEvents.map((evt, idx) => {
                    const isLast = idx === orderEvents.length - 1;
                    const isCompleted = evt.eventType === 'ORDER_COMPLETED';
                    const isRetry = evt.eventType === 'ORDER_RETRIED';
                    const isDlq = evt.eventType === 'ORDER_SENT_TO_DLQ';

                    return (
                      <div key={evt.id} className="timeline-node">
                        <div className="node-indicator-col">
                          <div className={`node-circle ${isCompleted ? 'node-success' : isDlq ? 'node-danger' : isRetry ? 'node-warning' : 'node-info'}`}>
                            {isCompleted ? (
                              <CheckCircle2 size={13} />
                            ) : isDlq ? (
                              <ShieldAlert size={13} />
                            ) : isRetry ? (
                              <RotateCcw size={13} />
                            ) : (
                              <div className="node-center-dot" />
                            )}
                          </div>
                          {!isLast && <div className="node-vertical-line" />}
                        </div>

                        <div className="node-body">
                          <div className="node-header">
                            <span className={`badge badge-sm ${isCompleted ? 'badge-success' : isDlq ? 'badge-danger' : isRetry ? 'badge-warning' : 'badge-info'}`}>
                              {evt.eventType.replace(/_/g, ' ')}
                            </span>
                            <span className="node-timestamp font-mono">
                              {new Date(evt.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                second: '2-digit', 
                                fractionalSecondDigits: 3 
                              })}
                            </span>
                          </div>
                          <div className="node-text">{evt.details}</div>
                          {evt.retryCount > 0 && (
                            <div className="retry-audit-tag font-mono">
                              [Retry Attempt: #{evt.retryCount} - 5000ms TTL Exponential Backoff]
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="audit-footer font-mono">
                <span>Idempotency Hash: {orderDetails.idempotencyKey || 'UNSET'}</span>
                <span>Audit Ref: {orderDetails.orderNumber}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <style>{`
        .inspector-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1.5rem;
        }

        .inspector-modal {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 760px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .inspector-header {
          padding: 1.25rem 1.75rem;
          background-color: var(--bg-subtle);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-meta {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .inspector-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .inspector-order-id {
          font-size: 0.8125rem;
          color: var(--primary-teal);
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.35rem;
          border-radius: var(--radius-sm);
        }

        .close-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-surface-elevated);
        }

        .inspector-body {
          padding: 1.75rem;
          overflow-y: auto;
        }

        .inspector-loading, .inspector-error {
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
        }

        .meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .meta-card {
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .meta-label {
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: var(--text-muted);
        }

        .meta-val {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .text-green {
          color: var(--status-success-text);
        }

        .text-teal {
          color: var(--primary-teal);
        }

        .text-danger {
          color: var(--status-danger-text);
        }

        .clinical-alert-box {
          background-color: var(--status-danger-bg);
          border: 1px solid var(--status-danger-border);
          border-radius: var(--radius-sm);
          padding: 0.875rem 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .alert-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.75rem;
        }

        .alert-heading {
          font-weight: 700;
          color: var(--status-danger-text);
          font-family: var(--font-mono);
        }

        .alert-msg {
          color: var(--text-primary);
        }

        .section-title {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 1.5rem 0 0.625rem;
        }

        .items-table-wrap {
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          overflow: hidden;
          margin-bottom: 1.25rem;
        }

        .clinical-timeline {
          display: flex;
          flex-direction: column;
          margin-top: 0.75rem;
          padding-left: 0.5rem;
        }

        .timeline-node {
          display: flex;
          gap: 1rem;
        }

        .node-indicator-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 24px;
        }

        .node-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-surface);
          border: 2px solid var(--border-subtle);
          z-index: 2;
        }

        .node-success {
          border-color: var(--status-success-border);
          color: var(--status-success-text);
        }

        .node-warning {
          border-color: var(--status-warning-border);
          color: var(--status-warning-text);
        }

        .node-danger {
          border-color: var(--status-danger-border);
          color: var(--status-danger-text);
        }

        .node-info {
          border-color: var(--trust-blue);
          color: var(--trust-blue);
        }

        .node-center-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--trust-blue);
        }

        .node-vertical-line {
          width: 2px;
          flex: 1;
          background-color: var(--border-subtle);
          margin: 0.25rem 0;
          min-height: 28px;
        }

        .node-body {
          flex: 1;
          padding-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .node-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .node-timestamp {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .node-text {
          font-size: 0.775rem;
          color: var(--text-secondary);
        }

        .retry-audit-tag {
          font-size: 0.7rem;
          color: var(--status-warning-text);
        }

        .audit-footer {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.725rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
