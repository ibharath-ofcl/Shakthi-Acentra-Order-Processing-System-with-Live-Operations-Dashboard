import React from 'react';
import { ShieldCheck, Lock, CheckCircle, Database, FileCheck } from 'lucide-react';

export function ComplianceBanner({ totalAuditEvents, isHealthy }) {
  return (
    <div className="compliance-banner">
      <div className="compliance-container">
        <div className="compliance-item">
          <ShieldCheck size={16} className="compliance-icon text-teal" />
          <div className="compliance-text">
            <span className="compliance-title">FDA 21 CFR Part 11 / SOC2</span>
            <span className="compliance-subtitle">Immutable Audit Trail Active</span>
          </div>
        </div>

        <div className="compliance-separator" />

        <div className="compliance-item">
          <Lock size={15} className="compliance-icon text-teal" />
          <div className="compliance-text">
            <span className="compliance-title">Zero-Overselling Guard</span>
            <span className="compliance-subtitle">Hardware Atomic Row Locks</span>
          </div>
        </div>

        <div className="compliance-separator" />

        <div className="compliance-item">
          <Database size={15} className="compliance-icon text-blue" />
          <div className="compliance-text">
            <span className="compliance-title">RabbitMQ AMQP 0-9-1</span>
            <span className="compliance-subtitle">Guaranteed Decoupled Delivery</span>
          </div>
        </div>

        <div className="compliance-separator" />

        <div className="compliance-item compliance-audit-counter">
          <FileCheck size={15} className="compliance-icon text-green" />
          <div className="compliance-text">
            <span className="compliance-title font-mono">{totalAuditEvents} Verified Events</span>
            <span className="compliance-subtitle">Cryptographic Event Sequence</span>
          </div>
        </div>
      </div>

      <style>{`
        .compliance-banner {
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
          padding: 0.55rem 2rem;
          font-size: 0.75rem;
        }

        .compliance-container {
          max-width: 1720px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .compliance-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .compliance-icon {
          flex-shrink: 0;
        }

        .compliance-text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }

        .compliance-title {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.75rem;
        }

        .compliance-subtitle {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .compliance-separator {
          width: 1px;
          height: 22px;
          background-color: var(--border-subtle);
        }

        .text-teal {
          color: var(--primary-teal);
        }

        .text-blue {
          color: var(--trust-blue);
        }

        .text-green {
          color: var(--status-success-text);
        }

        @media (max-width: 900px) {
          .compliance-separator {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
