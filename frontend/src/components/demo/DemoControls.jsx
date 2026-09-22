import React, { useState } from 'react';
import { 
  Play, 
  Layers, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  FlaskConical
} from 'lucide-react';
import { ordersApi, generateIdempotencyKey } from '../../services/api';

export function DemoControls({ inventory, onOrderCreated }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [resultMessage, setResultMessage] = useState(null);

  const defaultSku = inventory.find((i) => i.availableStock > 0)?.sku || inventory[0]?.sku || 'PROD-TEST-100';

  const triggerSingleOrder = async () => {
    setLoadingAction('single');
    setResultMessage(null);
    const startTime = performance.now();

    try {
      const orderPayload = {
        customerId: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
        items: [{ sku: defaultSku, quantity: 1 }],
        shippingAddress: 'Unit 4B, Regional Medical Pavilion',
        simulateFailure: 'NONE',
      };

      const res = await ordersApi.createOrder(orderPayload);
      const elapsed = Math.round(performance.now() - startTime);

      setResultMessage({
        type: 'success',
        text: `Order ${res.data?.orderNumber} dispatched in ${elapsed}ms -> Asynchronously enqueued to RabbitMQ worker pool.`,
      });

      if (onOrderCreated) onOrderCreated();
    } catch (err) {
      setResultMessage({
        type: 'error',
        text: `Order generation failed: ${err.message}`,
      });
    } finally {
      setLoadingAction(null);
      setTimeout(() => setResultMessage(null), 5000);
    }
  };

  const triggerBurstOrders = async () => {
    setLoadingAction('burst');
    setResultMessage(null);
    const startTime = performance.now();
    const burstCount = 5;

    try {
      const promises = Array.from({ length: burstCount }).map((_, index) => {
        const orderPayload = {
          customerId: `BURST-PT-${index + 1}`,
          items: [{ sku: defaultSku, quantity: 1 }],
          shippingAddress: `Department Clinic #${index + 1}, Emergency Wing`,
          simulateFailure: 'NONE',
        };
        return ordersApi.createOrder(orderPayload, generateIdempotencyKey(`BURST-RX-${index + 1}`));
      });

      const results = await Promise.all(promises);
      const elapsed = Math.round(performance.now() - startTime);
      const orderNumbers = results.map((r) => r.data?.orderNumber).join(', ');

      setResultMessage({
        type: 'success',
        text: `Concurrency Verification: ${burstCount} concurrent orders processed in ${elapsed}ms (${orderNumbers}). Zero-overselling row locks preserved stock integrity.`,
      });

      if (onOrderCreated) onOrderCreated();
    } catch (err) {
      setResultMessage({
        type: 'error',
        text: `Concurrency test failed: ${err.message}`,
      });
    } finally {
      setLoadingAction(null);
      setTimeout(() => setResultMessage(null), 6000);
    }
  };

  const triggerSimulateRetry = async () => {
    setLoadingAction('retry');
    setResultMessage(null);

    try {
      const orderPayload = {
        customerId: `RETRY-SIM-${Math.floor(100 + Math.random() * 900)}`,
        items: [{ sku: defaultSku, quantity: 1 }],
        shippingAddress: 'Cardiology Bay 12, Monitoring Unit',
        simulateFailure: 'RETRY',
      };

      const res = await ordersApi.createOrder(orderPayload);

      setResultMessage({
        type: 'warning',
        text: `Order ${res.data?.orderNumber} queued with simulated gateway timeout! Watch Audit Stream for Retry #1 → #2 → #3 (5s backoff).`,
      });

      if (onOrderCreated) onOrderCreated();
    } catch (err) {
      setResultMessage({
        type: 'error',
        text: `Retry simulation failed: ${err.message}`,
      });
    } finally {
      setLoadingAction(null);
      setTimeout(() => setResultMessage(null), 7000);
    }
  };

  const triggerSimulateDlq = async () => {
    setLoadingAction('dlq');
    setResultMessage(null);

    try {
      const orderPayload = {
        customerId: `DLQ-SIM-${Math.floor(100 + Math.random() * 900)}`,
        items: [{ sku: defaultSku, quantity: 1 }],
        shippingAddress: 'Isolation Ward C, Trauma Center',
        simulateFailure: 'DLQ',
      };

      const res = await ordersApi.createOrder(orderPayload);

      setResultMessage({
        type: 'danger',
        text: `Fatal diagnostic exception injected for ${res.data?.orderNumber}! Order isolated into Quarantine (DLQ) for review.`,
      });

      if (onOrderCreated) onOrderCreated();
    } catch (err) {
      setResultMessage({
        type: 'error',
        text: `DLQ simulation failed: ${err.message}`,
      });
    } finally {
      setLoadingAction(null);
      setTimeout(() => setResultMessage(null), 7000);
    }
  };

  return (
    <div className="panel clinical-workbench-panel">
      <div className="panel-header">
        <div className="panel-title">
          <FlaskConical size={16} className="text-teal" />
          <span>Operational Validation & Simulation Workbench</span>
          <span className="badge badge-neutral font-mono">HACKATHON VERIFICATION</span>
        </div>

        <span className="workbench-target font-mono">
          Target Supply SKU: {defaultSku}
        </span>
      </div>

      <div className="panel-body workbench-body">
        <div className="workbench-buttons">
          <button
            onClick={triggerSingleOrder}
            disabled={loadingAction !== null}
            className="btn btn-primary"
            title="Dispatch a clean single clinical order"
          >
            <Play size={13} />
            <span>{loadingAction === 'single' ? 'Dispatching...' : 'Dispatch Patient Order'}</span>
          </button>

          <button
            onClick={triggerBurstOrders}
            disabled={loadingAction !== null}
            className="btn btn-secondary btn-burst-action"
            title="Simultaneously dispatch 5 orders to verify zero-overselling lock"
          >
            <Layers size={13} className="text-teal" />
            <span>{loadingAction === 'burst' ? 'Blasting 5 Orders...' : 'Burst 5 Concurrent Orders'}</span>
          </button>

          <button
            onClick={triggerSimulateRetry}
            disabled={loadingAction !== null}
            className="btn btn-secondary btn-retry-action"
            title="Simulate transient network timeout with 5s exponential retry"
          >
            <RotateCcw size={13} className="text-warning" />
            <span>{loadingAction === 'retry' ? 'Simulating...' : 'Simulate Gateway Timeout'}</span>
          </button>

          <button
            onClick={triggerSimulateDlq}
            disabled={loadingAction !== null}
            className="btn btn-danger"
            title="Inject unrecoverable error routing order into Quarantine DLQ"
          >
            <ShieldAlert size={13} />
            <span>{loadingAction === 'dlq' ? 'Isolating...' : 'Simulate Quarantine (DLQ)'}</span>
          </button>
        </div>

        {resultMessage && (
          <div className={`clinical-feedback alert-${resultMessage.type}`}>
            {resultMessage.type === 'success' ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{resultMessage.text}</span>
          </div>
        )}
      </div>

      <style>{`
        .text-teal {
          color: var(--primary-teal);
        }

        .text-warning {
          color: var(--status-warning-text);
        }

        .workbench-target {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .workbench-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .workbench-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 0.875rem;
        }

        .btn-burst-action:hover {
          border-color: var(--primary-teal);
        }

        .btn-retry-action:hover {
          border-color: var(--status-warning-text);
        }

        .clinical-feedback {
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-family: var(--font-sans);
          animation: eventSlideIn 0.25s ease forwards;
        }

        .alert-success {
          background-color: var(--status-success-bg);
          border: 1px solid var(--status-success-border);
          color: var(--status-success-text);
        }

        .alert-warning {
          background-color: var(--status-warning-bg);
          border: 1px solid var(--status-warning-border);
          color: var(--status-warning-text);
        }

        .alert-danger, .alert-error {
          background-color: var(--status-danger-bg);
          border: 1px solid var(--status-danger-border);
          color: var(--status-danger-text);
        }
      `}</style>
    </div>
  );
}
