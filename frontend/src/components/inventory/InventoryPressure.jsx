import React, { useState } from 'react';
import { Package, PlusCircle, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { inventoryApi } from '../../services/api';

export function InventoryPressure({ inventory, onRefresh }) {
  const [restockingSku, setRestockingSku] = useState(null);
  const [restockAmount, setRestockAmount] = useState(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const getStockStatus = (available) => {
    if (available === 0) {
      return {
        label: 'STOCKOUT',
        badgeClass: 'badge-danger',
        barColor: 'var(--status-danger-text)',
      };
    }
    if (available < 10) {
      return {
        label: 'CRITICAL',
        badgeClass: 'badge-danger',
        barColor: 'var(--status-danger-text)',
      };
    }
    if (available <= 20) {
      return {
        label: 'RUNNING LOW',
        badgeClass: 'badge-warning',
        barColor: 'var(--status-warning-text)',
      };
    }
    return {
      label: 'HEALTHY',
      badgeClass: 'badge-success',
      barColor: 'var(--status-success-text)',
    };
  };

  const handleRestock = async (sku) => {
    try {
      setIsSubmitting(true);
      await inventoryApi.restock(sku, restockAmount);
      setFeedback({ type: 'success', text: `Successfully replenished +${restockAmount} units for ${sku}` });
      setRestockingSku(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Restock operation failed' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const totalAvailable = inventory.reduce((sum, item) => sum + (item.availableStock || 0), 0);
  const totalReserved = inventory.reduce((sum, item) => sum + (item.reservedStock || 0), 0);
  const criticalCount = inventory.filter((item) => (item.availableStock || 0) < 10).length;

  return (
    <div className="panel clinical-inventory-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Package size={16} className="text-teal" />
          <span>Clinical Supply Chain & Inventory Reserves</span>
          <span className="badge badge-neutral font-mono">{inventory.length} SKUS TRACKED</span>
        </div>

        <div className="inv-chips-bar">
          <span className="inv-metric-tag font-mono">AVAILABLE: <strong>{totalAvailable}</strong></span>
          <span className="inv-metric-tag font-mono">IN TRANSIT: <strong>{totalReserved}</strong></span>
          {criticalCount > 0 && (
            <span className="badge badge-warning font-mono">
              <AlertTriangle size={13} /> {criticalCount} BELOW SAFETY THRESHOLD
            </span>
          )}
        </div>
      </div>

      {feedback && (
        <div className={`clinical-feedback alert-${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      <div className="panel-body">
        {inventory.length === 0 ? (
          <div className="inv-empty-note">No inventory records discovered in clinical registry</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item / Clinical SKU</th>
                  <th>Unit Valuation</th>
                  <th>Available Units</th>
                  <th>Reserved (Locked)</th>
                  <th>Safety Level</th>
                  <th>Status</th>
                  <th>Replenishment</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const status = getStockStatus(item.availableStock);
                  const isRestocking = restockingSku === item.sku;
                  const capacityPercent = Math.min(100, Math.round((item.availableStock / 50) * 100));

                  return (
                    <tr key={item.sku}>
                      <td>
                        <div className="product-id-wrap">
                          <span className="prod-title">{item.productName}</span>
                          <span className="prod-sku font-mono">{item.sku}</span>
                        </div>
                      </td>
                      <td className="font-mono">
                        ${item.price?.toFixed(2)}
                      </td>
                      <td>
                        <span className="font-mono avail-stock-bold">{item.availableStock}</span>
                      </td>
                      <td>
                        <span className="font-mono reserved-stock-muted">{item.reservedStock}</span>
                      </td>
                      <td>
                        <div className="capacity-track">
                          <div 
                            className="capacity-fill" 
                            style={{ 
                              width: `${capacityPercent}%`, 
                              backgroundColor: status.barColor 
                            }} 
                          />
                        </div>
                        <span className="capacity-percentage font-mono">{capacityPercent}%</span>
                      </td>
                      <td>
                        <span className={`badge ${status.badgeClass}`}>
                          {status.label}
                        </span>
                      </td>
                      <td>
                        {isRestocking ? (
                          <div className="restock-form">
                            <input
                              type="number"
                              min="1"
                              max="500"
                              value={restockAmount}
                              onChange={(e) => setRestockAmount(parseInt(e.target.value, 10) || 0)}
                              className="restock-qty-input font-mono"
                            />
                            <button
                              onClick={() => handleRestock(item.sku)}
                              disabled={isSubmitting || restockAmount <= 0}
                              className="btn btn-primary btn-sm"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => setRestockingSku(null)}
                              className="btn btn-secondary btn-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setRestockingSku(item.sku);
                              setRestockAmount(20);
                            }}
                            className="btn btn-secondary btn-sm"
                            title="Replenish stock via atomic lock"
                          >
                            <PlusCircle size={13} />
                            <span>Restock</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .text-teal {
          color: var(--primary-teal);
        }

        .inv-chips-bar {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          flex-wrap: wrap;
        }

        .inv-metric-tag {
          font-size: 0.725rem;
          color: var(--text-muted);
          background-color: var(--bg-surface-elevated);
          padding: 0.25rem 0.625rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }

        .inv-metric-tag strong {
          color: var(--text-primary);
        }

        .product-id-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .prod-title {
          font-weight: 600;
          color: var(--text-primary);
        }

        .prod-sku {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .avail-stock-bold {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .reserved-stock-muted {
          color: var(--text-muted);
        }

        .capacity-track {
          width: 80px;
          height: 6px;
          background-color: var(--border-subtle);
          border-radius: 3px;
          overflow: hidden;
          display: inline-block;
          vertical-align: middle;
          margin-right: 0.5rem;
        }

        .capacity-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .capacity-percentage {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .restock-form {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .restock-qty-input {
          width: 54px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-medium);
          color: var(--text-primary);
          padding: 0.3rem 0.4rem;
          font-size: 0.75rem;
          border-radius: var(--radius-sm);
          outline: none;
        }

        .restock-qty-input:focus {
          border-color: var(--primary-teal);
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

        .inv-empty-note {
          padding: 2.5rem;
          text-align: center;
          color: var(--text-disabled);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
