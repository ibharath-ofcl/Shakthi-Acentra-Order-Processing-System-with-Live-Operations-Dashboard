import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Inbox, 
  Cpu, 
  CheckSquare, 
  CheckCircle, 
  ArrowRight,
  Maximize2
} from 'lucide-react';

export function ArchitecturalPipeline3D({ orders, events, onSelectOrder, theme = 'light' }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameIdRef = useRef(null);
  const capsulesRef = useRef([]);

  // Filter orders into pipeline stages
  const receivedOrders = orders.filter((o) => o.status === 'CREATED');
  const processingOrders = orders.filter((o) => o.status === 'PROCESSING' || o.status === 'PENDING_PAYMENT' || o.status === 'PENDING_RETRY');
  
  const reservedOrderNumbers = new Set(
    events.filter((e) => e.eventType === 'INVENTORY_RESERVED').map((e) => e.orderNumber)
  );
  const reservedOrders = orders.filter((o) => reservedOrderNumbers.has(o.orderNumber) && o.status !== 'CREATED');
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const failedOrders = orders.filter((o) => o.status.includes('FAIL') || o.status.includes('STOCK'));

  // 3D Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 280;

    // 1. Scene
    const scene = new THREE.Scene();
    const isDark = theme === 'dark';
    scene.background = new THREE.Color(isDark ? 0x0f172a : 0xf8fafc);
    sceneRef.current = scene;

    // 2. Camera (Orthographic for precise architectural isometric feel)
    const aspect = width / height;
    const frustumSize = 34;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );

    // Architectural isometric camera position: 45 deg yaw, 35.264 deg pitch
    camera.position.set(24, 26, 24);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting (Calm, soft clinical ambient + key directional)
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.7 : 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 0.9 : 1.1);
    dirLight.position.set(15, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 80;
    const d = 25;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    // 5. Architectural Floor Grid
    const gridColor = isDark ? 0x1e293b : 0xe2e8f0;
    const grid = new THREE.GridHelper(40, 20, gridColor, gridColor);
    grid.position.y = -1.5;
    scene.add(grid);

    // 6. Stations (4 architectural clinical plinths along X axis)
    const stationPositions = [-12, -4, 4, 12];
    const stationColors = isDark 
      ? [0x1e293b, 0x0369a1, 0x0f766e, 0x15803d]
      : [0xe2e8f0, 0xbae6fd, 0xccfbf1, 0xdcfce7];

    stationPositions.forEach((posX, idx) => {
      // Plinth Base
      const baseGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.8, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: stationColors[idx],
        roughness: 0.3,
        metalness: 0.1,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.set(posX, -1.1, 0);
      baseMesh.receiveShadow = true;
      scene.add(baseMesh);

      // Station Ring/Collar
      const collarGeo = new THREE.TorusGeometry(2.1, 0.12, 16, 48);
      const collarMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x334155 : 0x94a3b8,
        roughness: 0.2,
        metalness: 0.5,
      });
      const collarMesh = new THREE.Mesh(collarGeo, collarMat);
      collarMesh.rotation.x = Math.PI / 2;
      collarMesh.position.set(posX, -0.65, 0);
      scene.add(collarMesh);

      // Center Pillar / Receptor
      const pillarGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.4, 24);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x0f172a : 0xffffff,
        roughness: 0.2,
      });
      const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
      pillarMesh.position.set(posX, 0, 0);
      pillarMesh.castShadow = true;
      scene.add(pillarMesh);
    });

    // 7. Conduit / Transfer Track connecting stations
    const trackGeo = new THREE.BoxGeometry(24, 0.18, 0.6);
    const trackMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x334155 : 0xcbd5e1,
      roughness: 0.4,
      metalness: 0.2,
    });
    const trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.position.set(0, -0.6, 0);
    trackMesh.receiveShadow = true;
    scene.add(trackMesh);

    // 8. Order Capsules (Pill-shaped medical cartridges gliding along conduit)
    const capsuleCount = 5;
    const capsules = [];

    for (let i = 0; i < capsuleCount; i++) {
      const group = new THREE.Group();

      // Pill capsule body
      const bodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.7, 16);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x14b8a6 : 0x0d9488,
        roughness: 0.2,
        metalness: 0.1,
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bodyMesh.rotation.z = Math.PI / 2;
      group.add(bodyMesh);

      // Capsule tips
      const tipGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const tipMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
      });
      const tipL = new THREE.Mesh(tipGeo, tipMat);
      tipL.position.x = -0.35;
      group.add(tipL);

      const tipR = new THREE.Mesh(tipGeo, tipMat);
      tipR.position.x = 0.35;
      group.add(tipR);

      group.position.set(-12 + (i * 6), 0.2, 0);
      group.castShadow = true;
      scene.add(group);

      capsules.push({
        group,
        speed: 0.035 + (i * 0.005),
        minX: -12,
        maxX: 12,
      });
    }
    capsulesRef.current = capsules;

    // 9. Animation Loop (Smooth 60fps clinical flow)
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      // Glide capsules along tracks
      capsules.forEach((item) => {
        item.group.position.x += item.speed;
        if (item.group.position.x > item.maxX) {
          item.group.position.x = item.minX;
        }
        // Gentle clinical floating bob
        item.group.position.y = 0.25 + Math.sin(Date.now() * 0.003 + item.group.position.x) * 0.08;
      });

      renderer.render(scene, camera);
    };
    animate();

    // 10. Responsive resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 280;
      const newAspect = newW / newH;

      camera.left = (frustumSize * newAspect) / -2;
      camera.right = (frustumSize * newAspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      camera.updateProjectionMatrix();

      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      if (renderer) renderer.dispose();
    };
  }, [theme]);

  const stagesData = [
    {
      id: 'intake',
      name: '1. Intake & Triage',
      desc: 'Enqueued & verified',
      icon: Inbox,
      count: receivedOrders.length,
      orders: receivedOrders,
      statusClass: 'status-neutral',
    },
    {
      id: 'processing',
      name: '2. Allocation Engine',
      desc: 'Active worker processing',
      icon: Cpu,
      count: processingOrders.length,
      orders: processingOrders,
      statusClass: 'status-info',
    },
    {
      id: 'reserved',
      name: '3. Sterile Inventory Reserve',
      desc: 'Atomic zero-overselling lock',
      icon: CheckSquare,
      count: reservedOrders.length,
      orders: reservedOrders,
      statusClass: 'status-warning',
    },
    {
      id: 'completed',
      name: '4. Verification & Dispatch',
      desc: 'Captured & fulfilled',
      icon: CheckCircle,
      count: completedOrders.length,
      orders: [...completedOrders, ...failedOrders],
      statusClass: 'status-success',
    },
  ];

  return (
    <div className="panel architectural-pipeline-panel">
      <div className="panel-header">
        <div className="panel-title">
          <span>Architectural Order Flow Pipeline</span>
          <span className="badge badge-info font-mono">THREE.JS ISOMETRIC VIEW</span>
        </div>

        <div className="pipeline-controls-legend">
          <span className="pipeline-tip">
            Physical stations render real-time transit between RabbitMQ intake, atomic locking, and dispatch
          </span>
        </div>
      </div>

      {/* 3D Isometric Viewport */}
      <div className="isometric-canvas-wrap" ref={mountRef} />

      {/* 2D Synchronized Operational Cards Below Canvas */}
      <div className="pipeline-stages-bar">
        {stagesData.map((stage, idx) => {
          const Icon = stage.icon;
          const hasNext = idx < stagesData.length - 1;

          return (
            <React.Fragment key={stage.id}>
              <div className="stage-column">
                <div className="stage-meta-header">
                  <div className="stage-icon-name">
                    <Icon size={16} />
                    <span className="stage-title">{stage.name}</span>
                  </div>
                  <span className="badge badge-sm badge-neutral font-mono">
                    {stage.count} ACTIVE
                  </span>
                </div>
                <div className="stage-desc-text">{stage.desc}</div>

                <div className="stage-cards-strip">
                  {stage.orders.length === 0 ? (
                    <div className="empty-stage-note">Queue idle</div>
                  ) : (
                    stage.orders.slice(0, 3).map((order) => (
                      <div
                        key={order.orderNumber}
                        onClick={() => onSelectOrder(order.orderNumber)}
                        className="order-capsule-card"
                        title="Click to inspect order dossier"
                      >
                        <div className="capsule-top">
                          <span className="capsule-id font-mono">{order.orderNumber}</span>
                          <span className="capsule-amount font-mono">${order.totalAmount?.toFixed(2)}</span>
                        </div>
                        <div className="capsule-bottom font-mono">
                          <span>{order.customerId}</span>
                          <span>{order.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {hasNext && (
                <div className="stage-connector-arrow">
                  <ArrowRight size={16} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <style>{`
        .architectural-pipeline-panel {
          position: relative;
        }

        .pipeline-controls-legend {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .isometric-canvas-wrap {
          width: 100%;
          height: 260px;
          position: relative;
          cursor: grab;
          border-bottom: 1px solid var(--border-subtle);
        }

        .isometric-canvas-wrap canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        .pipeline-stages-bar {
          display: flex;
          align-items: stretch;
          padding: 1.25rem 1.5rem;
          background-color: var(--bg-surface);
          gap: 0.75rem;
          overflow-x: auto;
        }

        .stage-column {
          flex: 1;
          min-width: 210px;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.875rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .stage-meta-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stage-icon-name {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--primary-teal);
        }

        .stage-title {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stage-desc-text {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-bottom: 0.4rem;
        }

        .stage-cards-strip {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .empty-stage-note {
          font-size: 0.725rem;
          color: var(--text-disabled);
          font-style: italic;
          padding: 0.75rem 0.5rem;
          text-align: center;
        }

        .order-capsule-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.45rem 0.625rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          transition: transform 0.12s ease, border-color 0.15s ease;
        }

        .order-capsule-card:hover {
          transform: translateY(-1px);
          border-color: var(--primary-teal);
          box-shadow: var(--shadow-xs);
        }

        .capsule-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
        }

        .capsule-id {
          font-weight: 700;
          color: var(--text-primary);
        }

        .capsule-amount {
          color: var(--status-success-text);
          font-weight: 600;
        }

        .capsule-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.675rem;
          color: var(--text-muted);
        }

        .stage-connector-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--border-strong);
        }
      `}</style>
    </div>
  );
}
