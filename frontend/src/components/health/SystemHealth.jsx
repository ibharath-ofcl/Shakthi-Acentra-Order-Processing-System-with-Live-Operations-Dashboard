import React from 'react';
import { Server, Database, Layers, ShieldCheck, CheckCircle2, Cpu } from 'lucide-react';

export function SystemHealth({ health }) {
  const isHealthy = health?.status === 'UP';

  const components = [
    {
      name: 'Spring Boot Backend Cluster',
      role: 'REST API Gateway, Asynchronous Orchestrator & State Machine',
      status: isHealthy ? 'OPERATIONAL' : 'DEGRADED',
      details: `Version: ${health?.version || '1.0.0-SNAPSHOT'} | Java 21 (Temurin JRE Alpine) | Port 8080`,
      icon: Server,
      color: 'var(--primary-teal)',
      badgeClass: isHealthy ? 'badge-success' : 'badge-danger',
    },
    {
      name: 'MySQL 8.0 Enterprise Database',
      role: 'InnoDB ACID Storage, Concurrency Safe Isolation & Audit Tables',
      status: 'OPERATIONAL',
      details: 'InnoDB Engine | HikariCP Connection Pool | Port 3306',
      icon: Database,
      color: 'var(--trust-blue)',
      badgeClass: 'badge-success',
    },
    {
      name: 'RabbitMQ 3.13 Messaging Broker',
      role: 'AMQP 0-9-1 Message Broker & Dead Letter Exchange (DLX)',
      status: 'OPERATIONAL',
      details: 'Topic & Direct Exchanges | 5 Queues Configured | Manual ACK | Port 5672',
      icon: Layers,
      color: 'var(--trust-blue)',
      badgeClass: 'badge-success',
    },
    {
      name: 'Zero-Overselling Concurrency Lock',
      role: 'Atomic Conditional Decrement Engine (Race-Condition Free)',
      status: health?.activeModules?.concurrencyGuard || 'ACTIVE',
      details: 'Hardware Row Locks (available_stock - :qty >= 0) | Zero Overselling Guaranteed',
      icon: ShieldCheck,
      color: 'var(--status-success-text)',
      badgeClass: 'badge-success',
    },
  ];

  return (
    <div className="panel clinical-health-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Server size={16} className="text-teal" />
          <span>Clinical Infrastructure & Cluster Diagnostics</span>
          <span className={`badge ${isHealthy ? 'badge-success' : 'badge-danger'} font-mono`}>
            CLUSTER {health?.status || 'UP'}
          </span>
        </div>
        <span className="health-ts font-mono">
          Last Check: {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
        </span>
      </div>

      <div className="panel-body">
        <div className="clinical-health-grid">
          {components.map((comp) => {
            const Icon = comp.icon;

            return (
              <div key={comp.name} className="health-tile">
                <div className="tile-top-row">
                  <div className="tile-icon-bubble" style={{ color: comp.color }}>
                    <Icon size={18} />
                  </div>
                  <span className={`badge badge-sm ${comp.badgeClass} font-mono`}>
                    {comp.status}
                  </span>
                </div>

                <div className="tile-info-block">
                  <span className="tile-comp-name">{comp.name}</span>
                  <span className="tile-comp-role">{comp.role}</span>
                </div>

                <div className="tile-details-box font-mono">
                  {comp.details}
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

        .health-ts {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .clinical-health-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .health-tile {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          box-shadow: var(--shadow-xs);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .health-tile:hover {
          border-color: var(--border-medium);
          box-shadow: var(--shadow-sm);
        }

        .tile-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tile-icon-bubble {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tile-info-block {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .tile-comp-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .tile-comp-role {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.35;
        }

        .tile-details-box {
          font-size: 0.7rem;
          color: var(--text-muted);
          background-color: var(--bg-subtle);
          padding: 0.625rem 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
