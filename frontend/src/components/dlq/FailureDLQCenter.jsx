import React, { useState } from 'react';
import { 
  ShieldAlert, 
  RotateCcw, 
  Trash2, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Terminal,
  FileWarning
} from 'lucide-react';
import { operationsApi } from '../../services/api';

export function FailureDLQCenter({ dlqItems, onRefresh, onSelectOrder }) {
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleRetry = async (id, orderNumber) => {
    try {
      setActionLoadingId(id);
      await operationsApi.retryDlqMessage(id);
      setFeedback({ 
        type: 'success', 
        text: `Order ${orderNumber} re-authorized and returned to active processing queue.` 
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to re-enqueue order' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDiscard = async (id, orderNumber) => {
    try {
      setActionLoadingId(id);
      await operationsApi.discardDlqMessage(id);
      setFeedback({ 
        type: 'success', 
        text: `Exception for order ${orderNumber} archived as discarded.` 
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to discard exception' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const parseOrderNumber = (payload) => {
    try {
      const data = JSON.parse(payload);
      return data.orderNumber || 'N/A';
    } catch (e) {
      return 'N/A';
    }
  };

  const pendingCount = dlqItems.filter((i) => i.status === 'PENDING_REVIEW').length;

  return (
    <div className="panel clinical-dlq-panel">
      <div className="panel-header">
        <div className="panel-title">
          <FileWarning size={16} className="text-danger" />
          <span>Clinical Exception & Quarantine Management (DLQ)</span>
          <span className={`badge ${pendingCount > 0 ? 'badge-danger' : 'badge-success'} font-mono`}>
            {pendingCount} EXCEPTIONS PENDING
          </span>
        </div>

        <div className="dlq-legend-text">
          <span>Failed orders with exhausted retries isolated for review</span>
        </div>
      </div>

      {feedback && (
        <div className={`clinical-feedback alert-${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      <div className="panel-body">
        {dlqItems.length === 0 ? (
          <div className="dlq-clear-state">
            <CheckCircle size={32} className="text-success" />
            <div className="clear-message">
              <strong>All Quarantine Queues Clear</strong>
              <span>No clinical processing exceptions requiring operator intervention.</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Clinical Exception Diagnostic</th>
                  <th>Retry Attempts</th>
                  <th>Quarantine Time</th>
                  <th>Status</th>
                  <th>Clinical Action</th>
                </tr>
              </thead>
              <tbody>
                {dlqItems.map((item) => {
                  const orderNumber = parseOrderNumber(item.payload);
                  const isExpanded = expandedId === item.id;
                  const isPending = item.status === 'PENDING_REVIEW';
                  const isReplayed = item.status === 'REPLAYED';
                  const isLoading = actionLoadingId === item.id;

                  return (
                    <React.Fragment key={item.id}>
                      <tr className={isPending ? 'row-quarantine-pending' : ''}>
                        <td>
                          <div className="order-id-block">
                            <span 
                              className="order-ref-link font-mono"
                              onClick={() => orderNumber !== 'N/A' && onSelectOrder(orderNumber)}
                            >
                              {orderNumber}
                            </span>
                            <span className="msg-uuid font-mono">ID: {item.messageId?.substring(0, 10)}...</span>
                          </div>
                        </td>
                        <td>
                          <div className="exception-block">
                            <span className="exception-summary">{item.exceptionMessage}</span>
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="view-trace-btn"
                            >
                              <Terminal size={12} />
                              <span>{isExpanded ? 'Hide Trace' : 'View Exception Diagnostics'}</span>
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-warning font-mono">
                            {item.retryCount} EXHAUSTED
                          </span>
                        </td>
                        <td className="font-mono">
                          {new Date(item.createdAt).toLocaleTimeString()}
                        </td>
                        <td>
                          <span className={`badge ${isPending ? 'badge-danger' : isReplayed ? 'badge-success' : 'badge-neutral'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div className="recovery-actions-wrap">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleRetry(item.id, orderNumber)}
                                  disabled={isLoading}
                                  className="btn btn-primary btn-sm"
                                  title="Re-enqueue order into order.process.queue with reset failure flag"
                                >
                                  <RotateCcw size={13} />
                                  <span>{isLoading ? 'Replaying...' : 'Replay to Queue'}</span>
                                </button>
                                <button
                                  onClick={() => handleDiscard(item.id, orderNumber)}
                                  disabled={isLoading}
                                  className="btn btn-secondary btn-sm"
                                  title="Archive exception without replay"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                            {isReplayed && (
                              <span className="replayed-text font-mono">
                                Re-authorized {item.replayedAt ? new Date(item.replayedAt).toLocaleTimeString() : ''}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="trace-details-row">
                          <td colSpan={6}>
                            <div className="diagnostics-card">
                              <div className="diagnostics-meta font-mono">
                                <span>ROUTING: {item.originalQueue} → {item.routingKey}</span>
                              </div>
                              <pre className="diagnostics-code font-mono">
                                {item.exceptionStacktrace || item.exceptionMessage}
                              </pre>
                              <div className="diagnostics-payload font-mono">
                                <span>PAYLOAD: {item.payload}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .text-danger {
          color: var(--status-danger-text);
        }

        .text-success {
          color: var(--status-success-text);
        }

        .dlq-legend-text {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .dlq-clear-state {
          padding: 3rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
        }

        .clear-message {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .order-id-block {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .order-ref-link {
          color: var(--primary-teal);
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
        }

        .order-ref-link:hover {
          color: var(--primary-teal-dark);
        }

        .msg-uuid {
          font-size: 0.675rem;
          color: var(--text-muted);
        }

        .exception-block {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          max-width: 340px;
        }

        .exception-summary {
          font-weight: 600;
          color: var(--text-primary);
        }

        .view-trace-btn {
          background: transparent;
          border: none;
          color: var(--trust-blue);
          font-size: 0.725rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0;
          font-family: var(--font-sans);
        }

        .view-trace-btn:hover {
          text-decoration: underline;
        }

        .recovery-actions-wrap {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .replayed-text {
          font-size: 0.725rem;
          color: var(--status-success-text);
        }

        .row-quarantine-pending {
          background-color: rgba(190, 18, 60, 0.03);
        }

        .trace-details-row td {
          padding: 0 !important;
        }

        .diagnostics-card {
          background-color: var(--bg-subtle);
          padding: 1rem 1.5rem;
          border-left: 3px solid var(--status-danger-text);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .diagnostics-meta {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .diagnostics-code {
          background-color: var(--bg-app);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.725rem;
          color: var(--status-danger-text);
          white-space: pre-wrap;
          max-height: 140px;
          overflow-y: auto;
          border: 1px solid var(--border-subtle);
        }

        .diagnostics-payload {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        .clinical-feedback {
          padding: 0.625rem 1.5rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .alert-success {
          background-color: var(--status-success-bg);
          color: var(--status-success-text);
          border-bottom: 1px solid var(--status-success-border);
        }

        .alert-error {
          background-color: var(--status-danger-bg);
          color: var(--status-danger-text);
          border-bottom: 1px solid var(--status-danger-border);
        }
      `}</style>
    </div>
  );
}
