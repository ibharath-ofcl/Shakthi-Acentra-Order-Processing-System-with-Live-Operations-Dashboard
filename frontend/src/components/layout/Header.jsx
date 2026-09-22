import React from 'react';
import { 
  HeartPulse, 
  RefreshCw, 
  Play, 
  Pause, 
  ShieldCheck, 
  Sun, 
  Moon, 
  AlertTriangle 
} from 'lucide-react';

export function Header({ 
  theme, 
  toggleTheme, 
  isLive, 
  toggleLive, 
  refreshNow, 
  lastSyncTime, 
  health, 
  dlqCount 
}) {
  const isHealthy = health?.status === 'UP';

  return (
    <header className="clinical-header">
      <div className="header-left">
        <div className="brand-badge">
          <div className="brand-icon-wrap">
            <HeartPulse size={20} className="brand-pulse-icon" />
          </div>
          <div className="brand-meta">
            <div className="brand-name">ACENTRA HEALTH</div>
            <div className="brand-desc">Clinical Operations Platform</div>
          </div>
        </div>

        <div className="header-divider" />

        <div className="cluster-state">
          <span className={`status-dot ${isHealthy ? 'status-dot-active' : 'status-dot-danger'}`} />
          <span className="cluster-label">
            OPERATIONAL ENGINE: <strong className="text-primary-val">{isHealthy ? 'ONLINE' : 'DEGRADED'}</strong>
          </span>
        </div>
      </div>

      <div className="header-right">
        {dlqCount > 0 && (
          <div className="clinical-dlq-tag">
            <AlertTriangle size={14} />
            <span>{dlqCount} QUARANTINED (DLQ)</span>
          </div>
        )}

        <div className="telemetry-bar">
          <span className="telemetry-clock font-mono">
            SYNC: {lastSyncTime.toLocaleTimeString()}
          </span>

          <button
            onClick={toggleLive}
            className={`btn btn-sm ${isLive ? 'btn-live-active' : 'btn-secondary'}`}
            title={isLive ? 'Pause real-time telemetry stream' : 'Resume real-time telemetry stream'}
          >
            {isLive ? (
              <>
                <span className="live-pulse-dot" />
                <span>LIVE FEED</span>
                <Pause size={12} />
              </>
            ) : (
              <>
                <span className="status-dot status-dot-idle" />
                <span>PAUSED</span>
                <Play size={12} />
              </>
            )}
          </button>

          <button
            onClick={refreshNow}
            className="btn btn-secondary btn-sm"
            title="Force immediate telemetry poll"
          >
            <RefreshCw size={13} />
            <span>SYNC</span>
          </button>

          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'Clinical Slate (Night)' : 'Clinical Light'} mode`}
          >
            {theme === 'light' ? (
              <>
                <Moon size={14} />
                <span className="theme-text">SLATE</span>
              </>
            ) : (
              <>
                <Sun size={14} />
                <span className="theme-text">LIGHT</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .clinical-header {
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-medium);
          padding: 0.875rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: var(--shadow-xs);
        }

        .header-left, .header-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .brand-badge {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .brand-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--primary-teal) 0%, var(--trust-blue-dark) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          box-shadow: 0 2px 4px rgba(13, 148, 136, 0.25);
        }

        .brand-name {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--text-primary);
          line-height: 1.15;
        }

        .brand-desc {
          font-size: 0.725rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .header-divider {
          width: 1px;
          height: 26px;
          background-color: var(--border-subtle);
        }

        .cluster-state {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          font-size: 0.775rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .text-primary-val {
          color: var(--status-success-text);
          font-weight: 700;
        }

        .clinical-dlq-tag {
          background-color: var(--status-danger-bg);
          border: 1px solid var(--status-danger-border);
          color: var(--status-danger-text);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.75rem;
          font-weight: 700;
          font-family: var(--font-mono);
        }

        .telemetry-bar {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .telemetry-clock {
          font-size: 0.725rem;
          color: var(--text-muted);
          padding-right: 0.25rem;
        }

        .btn-live-active {
          background-color: var(--status-success-bg);
          border-color: var(--status-success-border);
          color: var(--status-success-text);
          font-weight: 600;
        }

        .btn-live-active:hover {
          background-color: var(--status-success-bg);
          border-color: var(--status-success-text);
        }

        .live-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--status-success-text);
          box-shadow: 0 0 0 2px var(--status-success-bg);
          animation: calm-pulse 2s infinite ease-in-out;
        }

        @keyframes calm-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.9); }
        }

        .theme-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        @media (max-width: 960px) {
          .header-divider, .cluster-state {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
