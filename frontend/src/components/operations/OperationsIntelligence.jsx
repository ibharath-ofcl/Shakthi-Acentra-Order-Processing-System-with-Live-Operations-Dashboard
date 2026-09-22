import React, { useState, useEffect } from 'react';
import {
  Cpu,
  AlertTriangle,
  Play,
  BarChart2,
  ShieldAlert,
  Sparkles,
  CheckCircle,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Package,
  Layers,
  Clock,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { intelligenceApi, ordersApi } from '../../services/api';
import { PRODUCTS } from '../../data/products';

export default function OperationsIntelligence({ inventory = [] }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [inventoryRisks, setInventoryRisks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState('');
  const [selectedOrderPriority, setSelectedOrderPriority] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluatingOrder, setEvaluatingOrder] = useState(false);

  // What-If Simulation State
  const [simSku, setSimSku] = useState('MED-OX-201');
  const [simIncoming, setSimIncoming] = useState(20);
  const [simDemand, setSimDemand] = useState(60);
  const [simDays, setSimDays] = useState(7);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  // Load intelligence data
  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, riskRes, ordersRes] = await Promise.all([
        intelligenceApi.getDashboard().catch(() => null),
        intelligenceApi.getInventoryRisks().catch(() => null),
        ordersApi.getAllOrders(0, 50).catch(() => null)
      ]);

      if (dashRes?.data) setDashboardData(dashRes.data);
      if (riskRes?.data) setInventoryRisks(riskRes.data);
      
      const orderList = ordersRes?.data?.content || ordersRes?.data || [];
      setOrders(orderList);

      if (orderList.length > 0 && !selectedOrderNumber) {
        setSelectedOrderNumber(orderList[0].orderNumber);
        evaluateOrder(orderList[0].orderNumber);
      }
    } catch (err) {
      console.error('Error loading intelligence data:', err);
    } finally {
      setLoading(false);
    }
  };

  const evaluateOrder = async (orderNum) => {
    if (!orderNum) return;
    setEvaluatingOrder(true);
    try {
      const res = await intelligenceApi.getOrderPriority(orderNum);
      if (res?.data) {
        setSelectedOrderPriority(res.data);
      }
    } catch (err) {
      console.error('Failed to evaluate order priority:', err);
    } finally {
      setEvaluatingOrder(false);
    }
  };

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await intelligenceApi.runWhatIfSimulation({
        sku: simSku,
        incomingStock: parseInt(simIncoming, 10) || 0,
        expectedAdditionalDemand: parseInt(simDemand, 10) || 0,
        days: parseInt(simDays, 10) || 7
      });
      if (res?.data) {
        setSimResult(res.data);
      }
    } catch (err) {
      console.error('Simulation calculation failed:', err);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    loadData();
    // Run initial simulation
    runSimulation();
  }, []);

  const getPriorityColor = (level) => {
    switch (level) {
      case 'CRITICAL': return '#EF4444';
      case 'HIGH': return '#F59E0B';
      case 'NORMAL': return '#10B981';
      case 'LOW': return '#64748B';
      default: return '#38BDF8';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'CRITICAL': return '#EF4444';
      case 'AT_RISK': return '#F59E0B';
      case 'WATCH': return '#38BDF8';
      case 'SAFE': return '#10B981';
      default: return '#64748B';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Header & Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4ADE80', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <Sparkles size={14} />
            <span>AI-Assisted Decision Intelligence Engine</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F8FAFC' }}>
            Operations Decision Intelligence
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '650px', marginTop: '0.2rem' }}>
            Deterministic priority scoring, real-time inventory risk monitoring, and sandbox What-If scenario simulations.
          </p>
        </div>

        <button
          onClick={loadData}
          style={{
            background: '#152238',
            border: '1px solid #273D5E',
            color: '#F8FAFC',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Recalculate Models</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      {dashboardData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          
          <div style={{ background: '#152238', border: '1px solid #273D5E', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
              Orders Evaluated
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F8FAFC', fontFamily: 'JetBrains Mono', margin: '0.2rem 0' }}>
              {dashboardData.totalOrdersEvaluated}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> 100% Deterministic Scoring
            </div>
          </div>

          <div style={{ background: '#152238', border: '1px solid #273D5E', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
              High & Critical Orders
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F59E0B', fontFamily: 'JetBrains Mono', margin: '0.2rem 0' }}>
              {(dashboardData.criticalOrdersCount || 0) + (dashboardData.highPriorityOrdersCount || 0)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              {dashboardData.criticalOrdersCount || 0} Critical • {dashboardData.highPriorityOrdersCount || 0} High Priority
            </div>
          </div>

          <div style={{ background: '#152238', border: '1px solid #273D5E', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
              Inventory Risk Alerts
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: (dashboardData.criticalStockAlertsCount || 0) > 0 ? '#EF4444' : '#10B981', fontFamily: 'JetBrains Mono', margin: '0.2rem 0' }}>
              {dashboardData.criticalStockAlertsCount || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              {dashboardData.atRiskProductsCount || 0} products in watch tier
            </div>
          </div>

          <div style={{ background: '#152238', border: '1px solid #273D5E', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
              Active Recommendation
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginTop: '0.4rem', lineHeight: 1.4 }}>
              {dashboardData.recentRecommendations?.[0] || 'All order queues operating at nominal velocity.'}
            </div>
          </div>

        </div>
      )}

      {/* Main Two-Column Layout: Priority Decision Engine & What-If Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '2rem' }}>
        
        {/* Module 1: Order Priority Decision Engine */}
        <div style={{
          background: '#152238',
          border: '1px solid #273D5E',
          borderRadius: '20px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }}>
                  Dynamic Order Priority Engine
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  Multi-factor explainable 0–100 scoring
                </p>
              </div>
            </div>
          </div>

          {/* Order Selection Dropdown */}
          <div style={{ background: '#0B1320', padding: '1rem', borderRadius: '12px', border: '1px solid #1E2D4A', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8' }}>
              Select Order to Inspect AI Decision Factors:
            </label>
            <select
              value={selectedOrderNumber}
              onChange={(e) => {
                setSelectedOrderNumber(e.target.value);
                evaluateOrder(e.target.value);
              }}
              style={{
                background: '#152238',
                border: '1px solid #334E77',
                color: '#F8FAFC',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                outline: 'none',
                width: '100%'
              }}
            >
              {orders.map(o => (
                <option key={o.orderNumber || o.id} value={o.orderNumber}>
                  {o.orderNumber} — {o.customerId || 'Hospital Requisition'} (₹{o.totalAmount || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Computed Priority Result */}
          {selectedOrderPriority ? (
            <div style={{
              background: '#0B1320',
              border: `1px solid ${getPriorityColor(selectedOrderPriority.priorityLevel)}`,
              borderRadius: '16px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8' }}>
                    Calculated Score
                  </div>
                  <div style={{ fontSize: '2.8rem', fontWeight: 900, color: getPriorityColor(selectedOrderPriority.priorityLevel), fontFamily: 'JetBrains Mono', lineHeight: 1.1 }}>
                    {selectedOrderPriority.priorityScore}<span style={{ fontSize: '1.2rem', color: '#64748B' }}>/100</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    backgroundColor: `${getPriorityColor(selectedOrderPriority.priorityLevel)}25`,
                    color: getPriorityColor(selectedOrderPriority.priorityLevel),
                    border: `1px solid ${getPriorityColor(selectedOrderPriority.priorityLevel)}60`
                  }}>
                    {selectedOrderPriority.priorityLevel}
                  </span>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '6px' }}>
                    Tier: {selectedOrderPriority.customerTier} • {selectedOrderPriority.primaryCriticality}
                  </div>
                </div>
              </div>

              {/* Natural Language Explanation */}
              <div style={{ background: '#152238', borderRadius: '10px', padding: '0.85rem 1rem', borderLeft: `3px solid ${getPriorityColor(selectedOrderPriority.priorityLevel)}` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', marginBottom: '2px' }}>
                  Explainability Rationale
                </div>
                <div style={{ fontSize: '0.85rem', color: '#F8FAFC', lineHeight: 1.45 }}>
                  {selectedOrderPriority.explanation}
                </div>
              </div>

              {/* Actionable Recommendation */}
              <div style={{ background: '#152238', borderRadius: '10px', padding: '0.85rem 1rem', borderLeft: '3px solid #4ADE80' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#4ADE80', marginBottom: '2px' }}>
                  Operational Recommendation
                </div>
                <div style={{ fontSize: '0.85rem', color: '#F8FAFC', lineHeight: 1.45 }}>
                  {selectedOrderPriority.recommendation}
                </div>
              </div>

              {/* Contributing Factors Breakdown */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', marginBottom: '0.5rem' }}>
                  Factor Weights Breakdown
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {selectedOrderPriority.contributingFactors?.map((f, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#152238',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem'
                    }}>
                      <span style={{ color: '#CBD5E1' }}>{f.name}: <span style={{ color: '#94A3B8' }}>{f.detail}</span></span>
                      <span style={{ color: '#4ADE80', fontWeight: 700, fontFamily: 'JetBrains Mono', marginLeft: '8px' }}>
                        +{f.scoreImpact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: '#94A3B8', textAlign: 'center', padding: '2rem' }}>
              Loading order priority analysis...
            </div>
          )}
        </div>

        {/* Module 2: What-If Inventory Simulator */}
        <div style={{
          background: '#152238',
          border: '1px solid #273D5E',
          borderRadius: '20px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }}>
                Inventory What-If Simulator
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Real mathematical scenario calculations without DB mutation
              </p>
            </div>
          </div>

          {/* Simulation Parameter Inputs */}
          <div style={{ background: '#0B1320', padding: '1.25rem', borderRadius: '14px', border: '1px solid #1E2D4A', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.35rem' }}>
                Product SKU to Simulate:
              </label>
              <select
                value={simSku}
                onChange={(e) => setSimSku(e.target.value)}
                style={{
                  background: '#152238',
                  border: '1px solid #334E77',
                  color: '#F8FAFC',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  width: '100%'
                }}
              >
                {PRODUCTS.map(p => (
                  <option key={p.sku} value={p.sku}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.3rem' }}>
                  Incoming Units
                </label>
                <input
                  type="number"
                  min="0"
                  value={simIncoming}
                  onChange={(e) => setSimIncoming(e.target.value)}
                  style={{
                    background: '#152238',
                    border: '1px solid #334E77',
                    color: '#F8FAFC',
                    padding: '0.45rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontFamily: 'JetBrains Mono',
                    width: '100%'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.3rem' }}>
                  Surge Demand
                </label>
                <input
                  type="number"
                  min="0"
                  value={simDemand}
                  onChange={(e) => setSimDemand(e.target.value)}
                  style={{
                    background: '#152238',
                    border: '1px solid #334E77',
                    color: '#F8FAFC',
                    padding: '0.45rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontFamily: 'JetBrains Mono',
                    width: '100%'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.3rem' }}>
                  Timeframe (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={simDays}
                  onChange={(e) => setSimDays(e.target.value)}
                  style={{
                    background: '#152238',
                    border: '1px solid #334E77',
                    color: '#F8FAFC',
                    padding: '0.45rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontFamily: 'JetBrains Mono',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            <button
              onClick={runSimulation}
              disabled={simulating}
              style={{
                background: '#167733',
                border: 'none',
                color: '#FFFFFF',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {simulating ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
              <span>Execute Scenario Simulation</span>
            </button>
          </div>

          {/* Simulation Output */}
          {simResult && (
            <div style={{
              background: '#0B1320',
              border: `1px solid ${getRiskColor(simResult.projectedRiskLevel)}`,
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>
                    Projected Ending Stock ({simDays}d)
                  </div>
                  <div style={{
                    fontSize: '2.2rem',
                    fontWeight: 900,
                    color: simResult.projectedEndingStock <= 0 ? '#EF4444' : '#4ADE80',
                    fontFamily: 'JetBrains Mono'
                  }}>
                    {simResult.projectedEndingStock} units
                  </div>
                </div>

                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: `${getRiskColor(simResult.projectedRiskLevel)}25`,
                  color: getRiskColor(simResult.projectedRiskLevel),
                  border: `1px solid ${getRiskColor(simResult.projectedRiskLevel)}60`
                }}>
                  {simResult.projectedRiskLevel}
                </span>
              </div>

              {/* Simulation Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', background: '#152238', padding: '0.85rem', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Current Stock</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', fontFamily: 'JetBrains Mono' }}>{simResult.currentStock}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Total Demand</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', fontFamily: 'JetBrains Mono' }}>{simResult.totalProjectedDemand}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Orders Affected</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: simResult.affectedOrdersCount > 0 ? '#EF4444' : '#4ADE80', fontFamily: 'JetBrains Mono' }}>
                    {simResult.affectedOrdersCount}
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div style={{ background: '#152238', borderRadius: '10px', padding: '0.85rem', borderLeft: `3px solid ${getRiskColor(simResult.projectedRiskLevel)}` }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '2px' }}>
                  Recommended Action
                </div>
                <div style={{ fontSize: '0.82rem', color: '#F8FAFC', lineHeight: 1.4 }}>
                  {simResult.recommendedAction}
                </div>
              </div>

              {/* Factors */}
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.4 }}>
                {simResult.explanation}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Module 3: Inventory Risk Table */}
      <div style={{
        background: '#152238',
        border: '1px solid #273D5E',
        borderRadius: '20px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }}>
              Real-Time Inventory Risk & Depletion Analytics
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              Predictive stockout hazards and clinical replenishment triggers
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #273D5E', color: '#94A3B8', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem' }}>Product / SKU</th>
                <th style={{ padding: '0.75rem' }}>Criticality</th>
                <th style={{ padding: '0.75rem' }}>Risk Score</th>
                <th style={{ padding: '0.75rem' }}>Available / Reserved</th>
                <th style={{ padding: '0.75rem' }}>Depletion Rate</th>
                <th style={{ padding: '0.75rem' }}>Days Left</th>
                <th style={{ padding: '0.75rem' }}>Reorder Qty</th>
                <th style={{ padding: '0.75rem' }}>Actionable Guidance</th>
              </tr>
            </thead>
            <tbody>
              {inventoryRisks.map(item => (
                <tr key={item.sku} style={{ borderBottom: '1px solid #1A2C46', color: '#F8FAFC' }}>
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    <div style={{ fontWeight: 700 }}>{item.productName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'JetBrains Mono' }}>{item.sku}</div>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: item.criticality === 'LIFE_SAVING' ? '#EF4444' : '#38BDF8', fontWeight: 600 }}>
                      {item.criticality}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                      backgroundColor: `${getRiskColor(item.riskLevel)}20`,
                      color: getRiskColor(item.riskLevel),
                      border: `1px solid ${getRiskColor(item.riskLevel)}50`
                    }}>
                      {item.riskScore} • {item.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', fontFamily: 'JetBrains Mono' }}>
                    <span style={{ color: '#4ADE80', fontWeight: 700 }}>{item.availableStock}</span>
                    <span style={{ color: '#64748B' }}> / {item.reservedStock}</span>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', fontFamily: 'JetBrains Mono', color: '#94A3B8' }}>
                    {item.estimatedDailyDemand} u/day
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: item.projectedDaysRemaining <= 7 ? '#EF4444' : '#4ADE80' }}>
                    {item.projectedDaysRemaining}d
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: item.recommendedReorderQuantity > 0 ? '#F59E0B' : '#64748B' }}>
                    +{item.recommendedReorderQuantity}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', fontSize: '0.78rem', color: '#CBD5E1', maxWidth: '300px' }}>
                    {item.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
