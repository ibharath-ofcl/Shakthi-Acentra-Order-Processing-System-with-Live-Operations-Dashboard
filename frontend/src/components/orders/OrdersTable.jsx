import React, { useState, useMemo } from 'react';
import { Search, Eye, FileText, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export function OrdersTable({ orders, onSelectOrder }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false;
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchNum = order.orderNumber?.toLowerCase().includes(term);
        const matchCust = order.customerId?.toLowerCase().includes(term);
        if (!matchNum && !matchCust) return false;
      }

      return true;
    });
  }, [orders, statusFilter, searchTerm]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'badge-success';
      case 'PROCESSING':
      case 'PENDING_PAYMENT':
        return 'badge-info';
      case 'CREATED':
        return 'badge-neutral';
      case 'PENDING_RETRY':
        return 'badge-warning';
      case 'FAILED':
      case 'INSUFFICIENT_STOCK':
      case 'PAYMENT_FAILED':
        return 'badge-danger';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div className="panel clinical-orders-table-panel">
      <div className="panel-header">
        <div className="panel-title">
          <FileText size={16} className="text-teal" />
          <span>Patient Orders Registry & Verification Ledger</span>
          <span className="badge badge-neutral font-mono">{orders.length} TOTAL INTAKES</span>
        </div>

        <div className="table-filter-bar">
          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search by order or patient ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="table-search-input"
            />
          </div>

          <div className="status-select-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-select font-mono"
            >
              <option value="ALL">All Statuses</option>
              <option value="CREATED">CREATED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="PENDING_RETRY">PENDING_RETRY</option>
              <option value="FAILED">FAILED</option>
              <option value="INSUFFICIENT_STOCK">INSUFFICIENT_STOCK</option>
            </select>
          </div>
        </div>
      </div>

      <div className="panel-body table-body-padded">
        {filteredOrders.length === 0 ? (
          <div className="orders-empty-state">No clinical orders matching search criteria</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Patient / Customer</th>
                  <th>Priority Tier</th>
                  <th>Prescribed Items</th>
                  <th>Total Valuation</th>
                  <th>Status</th>
                  <th>Intake Timestamp</th>
                  <th>Dossier Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.orderNumber}
                    onClick={() => onSelectOrder(order.orderNumber)}
                    className="order-row-clickable"
                  >
                    <td>
                      <span className="font-mono order-bold-text">{order.orderNumber}</span>
                    </td>
                    <td className="font-mono">{order.customerId}</td>
                    <td>
                      <span className="tier-pill">{order.customerTier}</span>
                    </td>
                    <td>{order.items?.length || 0} units</td>
                    <td className="font-mono text-green">₹{order.totalAmount?.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="font-mono">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order.orderNumber);
                        }}
                        className="btn btn-secondary btn-sm"
                        title="View clinical audit trail"
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .text-teal {
          color: var(--primary-teal);
        }

        .table-filter-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 0.625rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .table-search-input {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-medium);
          color: var(--text-primary);
          padding: 0.4rem 0.625rem 0.4rem 2rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          width: 210px;
          outline: none;
          font-family: var(--font-sans);
        }

        .table-search-input:focus {
          border-color: var(--primary-teal);
        }

        .status-select {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-medium);
          color: var(--text-secondary);
          padding: 0.4rem 0.625rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          outline: none;
        }

        .order-row-clickable {
          cursor: pointer;
        }

        .order-bold-text {
          font-weight: 700;
          color: var(--text-primary);
        }

        .tier-pill {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          background-color: var(--bg-subtle);
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }

        .text-green {
          color: var(--status-success-text);
          font-weight: 600;
        }

        .orders-empty-state {
          padding: 3rem;
          text-align: center;
          color: var(--text-disabled);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
