import React, { useState, useMemo } from 'react';
import { 
  Inbox, 
  Cpu, 
  CheckSquare, 
  CheckCircle2, 
  RotateCcw, 
  AlertOctagon, 
  ShieldAlert, 
  Search,
  ShieldCheck,
  FileText
} from 'lucide-react';

export function OperationsFeed({ events, onSelectOrder }) {
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const getEventMeta = (type) => {
    switch (type) {
      case 'ORDER_RECEIVED':
        return {
          label: 'INTAKE RECEIVED',
          icon: Inbox,
          badgeClass: 'badge-neutral',
          color: 'var(--text-secondary)'
        };
      case 'ORDER_PROCESSING':
        return {
          label: 'PROCESSING ACTIVE',
          icon: Cpu,
          badgeClass: 'badge-info',
          color: 'var(--trust-blue)'
        };
      case 'INVENTORY_RESERVED':
        return {
          label: 'STOCK RESERVED',
          icon: CheckSquare,
          badgeClass: 'badge-success',
          color: 'var(--primary-teal)'
        };
      case 'ORDER_COMPLETED':
        return {
          label: 'VERIFIED & COMPLETED',
          icon: CheckCircle2,
          badgeClass: 'badge-success',
          color: 'var(--status-success-text)'
        };
      case 'ORDER_RETRIED':
        return {
          label: 'RETRY DELAY (5s)',
          icon: RotateCcw,
          badgeClass: 'badge-warning',
          color: 'var(--status-warning-text)'
        };
      case 'ORDER_FAILED':
        return {
          label: 'PROCESSING EXCEPTION',
          icon: AlertOctagon,
          badgeClass: 'badge-danger',
          color: 'var(--status-danger-text)'
        };
      case 'ORDER_SENT_TO_DLQ':
        return {
          label: 'ROUTED TO QUARANTINE (DLQ)',
          icon: ShieldAlert,
          badgeClass: 'badge-danger',
          color: 'var(--status-danger-text)'
        };
      default:
        return {
          label: type,
          icon: Inbox,
          badgeClass: 'badge-neutral',
          color: 'var(--text-muted)'
        };
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (filterType === 'RETRIES' && e.eventType !== 'ORDER_RETRIED') return false;
      if (filterType === 'DLQ' && e.eventType !== 'ORDER_SENT_TO_DLQ') return false;
      if (filterType === 'INVENTORY' && e.eventType !== 'INVENTORY_RESERVED') return false;
      if (filterType === 'COMPLETED' && e.eventType !== 'ORDER_COMPLETED') return false;

      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesOrder = e.orderNumber?.toLowerCase().includes(query);
        const matchesCustomer = e.customerId?.toLowerCase().includes(query);
        const matchesDetails = e.details?.toLowerCase().includes(query);
        if (!matchesOrder && !matchesCustomer && !matchesDetails) return false;
      }

      return true;
    });
  }, [events, filterType, searchTerm]);

  return (
    <div className="panel clinical-feed-panel">
      <div className="panel-header">
        <div className="panel-title">
          <FileText size={16} className="text-teal" />
          <span>Live Operations Audit Stream</span>
          <span className="badge badge-success font-mono">
            {events.length} VERIFIED AUDIT RECORDS
          </span>
        </div>

        <div className="feed-filter-bar">
          <div className="search-input-wrap">
            <Search size={14} className="search-icon-pos" />
            <input
              type="text"
              placeholder="Filter by order or patient ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="clinical-search-input"
            />
          </div>

          <div className="filter-pill-group">
            <button
              onClick={() => setFilterType('ALL')}
              className={`filter-pill ${filterType === 'ALL' ? 'filter-pill-active' : ''}`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilterType('RETRIES')}
              className={`filter-pill ${filterType === 'RETRIES' ? 'filter-pill-active' : ''}`}
            >
              Retries
            </button>
            <button
              onClick={() => setFilterType('DLQ')}
              className={`filter-pill ${filterType === 'DLQ' ? 'filter-pill-active' : ''}`}
            >
              Quarantine
            </button>
            <button
              onClick={() => setFilterType('INVENTORY')}
              className={`filter-pill ${filterType === 'INVENTORY' ? 'filter-pill-active' : ''}`}
            >
              Stock Locks
            </button>
          </div>
        </div>
      </div>

      <div className="feed-body-scroll">
        {filteredEvents.length === 0 ? (
          <div className="feed-empty-state">
            <span>No operational events recorded for the selected criteria</span>
          </div>
        ) : (
          <div className="event-stream-container">
            {filteredEvents.map((event, index) => {
              const meta = getEventMeta(event.eventType);
              const Icon = meta.icon;

              return (
                <div
                  key={event.id || `${event.orderNumber}-${index}`}
                  onClick={() => onSelectOrder(event.orderNumber)}
                  className="event-row-animated"
                  title="Click to view full order verification dossier"
                >
                  <div className="event-icon-column" style={{ color: meta.color }}>
                    <Icon size={16} />
                  </div>

                  <div className="event-content-column">
                    <div className="event-meta-line">
                      <span className={`badge badge-sm ${meta.badgeClass}`}>
                        {meta.label}
                      </span>
                      <span className="event-order-code font-mono">
                        {event.orderNumber}
                      </span>
                      {event.customerId && (
                        <span className="event-cust-code font-mono">
                          {event.customerId}
                        </span>
                      )}
                      {event.retryCount > 0 && (
                        <span className="badge badge-sm badge-warning font-mono">
                          CYCLE #{event.retryCount}
                        </span>
                      )}
                    </div>
                    <div className="event-details-text">{event.details}</div>
                  </div>

                  <div className="event-timestamp font-mono">
                    {new Date(event.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit' 
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .clinical-feed-panel {
          height: 100%;
        }

        .text-teal {
          color: var(--primary-teal);
        }

        .feed-filter-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .search-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon-pos {
          position: absolute;
          left: 0.625rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .clinical-search-input {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-medium);
          color: var(--text-primary);
          padding: 0.4rem 0.625rem 0.4rem 2rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          width: 190px;
          outline: none;
          font-family: var(--font-sans);
          transition: border-color 0.15s ease;
        }

        .clinical-search-input:focus {
          border-color: var(--primary-teal);
        }

        .filter-pill-group {
          display: flex;
          gap: 0.35rem;
        }

        .filter-pill {
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          padding: 0.3rem 0.6rem;
          font-size: 0.725rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: var(--font-sans);
        }

        .filter-pill:hover {
          color: var(--text-primary);
          background-color: var(--bg-surface-elevated);
        }

        .filter-pill-active {
          background-color: var(--primary-teal-light);
          border-color: var(--primary-teal);
          color: var(--primary-teal-dark);
        }

        .feed-body-scroll {
          max-height: 420px;
          overflow-y: auto;
        }

        .feed-empty-state {
          padding: 3rem 1rem;
          text-align: center;
          color: var(--text-disabled);
          font-style: italic;
          font-size: 0.8125rem;
        }

        .event-stream-container {
          display: flex;
          flex-direction: column;
        }

        .event-row-animated {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: background-color 0.12s ease;
          animation: eventSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .event-row-animated:hover {
          background-color: var(--bg-surface-elevated);
        }

        .event-icon-column {
          margin-top: 0.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .event-content-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .event-meta-line {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          flex-wrap: wrap;
        }

        .event-order-code {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .event-cust-code {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .event-details-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.35;
        }

        .event-timestamp {
          font-size: 0.7rem;
          color: var(--text-muted);
          white-space: nowrap;
          padding-top: 0.15rem;
        }
      `}</style>
    </div>
  );
}
