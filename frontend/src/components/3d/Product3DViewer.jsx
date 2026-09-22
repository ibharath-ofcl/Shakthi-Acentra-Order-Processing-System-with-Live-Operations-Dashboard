import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Eye, Sparkles, Layers, ZoomIn, ZoomOut, Compass, Image as ImageIcon, Box } from 'lucide-react';

/**
 * Creates 3D procedural meshes for medical SKUs (CAD mode)
 */
function createProductMeshGroup(sku) {
  const group = new THREE.Group();

  switch (sku) {
    case 'MED-OX-201': {
      const lowerGeo = new THREE.BoxGeometry(2.2, 0.6, 1.2);
      const lowerMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.35, metalness: 0.2 });
      const lowerMesh = new THREE.Mesh(lowerGeo, lowerMat);
      lowerMesh.position.set(0, -0.28, 0);
      lowerMesh.castShadow = true;
      group.add(lowerMesh);

      const upperGeo = new THREE.BoxGeometry(2.2, 0.6, 1.2);
      const upperMat = new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.2, metalness: 0.05 });
      const upperMesh = new THREE.Mesh(upperGeo, upperMat);
      upperMesh.position.set(0, 0.32, 0);
      upperMesh.castShadow = true;
      group.add(upperMesh);

      const bezelGeo = new THREE.BoxGeometry(1.4, 0.08, 0.85);
      const bezelMat = new THREE.MeshStandardMaterial({ color: 0x0A0F1D, roughness: 0.1, metalness: 0.9 });
      const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
      bezelMesh.position.set(0, 0.63, 0);
      group.add(bezelMesh);

      const screenGeo = new THREE.PlaneGeometry(1.2, 0.7);
      const screenMat = new THREE.MeshBasicMaterial({ color: 0x10B981 });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.rotation.x = -Math.PI / 2;
      screenMesh.position.set(0, 0.68, 0);
      group.add(screenMesh);
      break;
    }

    case 'MED-BP-302': {
      const baseGeo = new THREE.BoxGeometry(2.4, 0.8, 2.2);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0xF1F5F9, roughness: 0.25, metalness: 0.1 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.rotation.x = 0.25;
      baseMesh.position.set(0, -0.1, 0);
      baseMesh.castShadow = true;
      group.add(baseMesh);

      const lcdGeo = new THREE.PlaneGeometry(1.6, 1.3);
      const lcdMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, emissive: 0x0284C7, emissiveIntensity: 0.35 });
      const lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
      lcdMesh.rotation.x = -Math.PI / 2 + 0.25;
      lcdMesh.position.set(0, 0.38, -0.1);
      group.add(lcdMesh);

      const cuffGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.6, 32, 1, true);
      const cuffMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.8, side: THREE.DoubleSide });
      const cuffMesh = new THREE.Mesh(cuffGeo, cuffMat);
      cuffMesh.rotation.z = Math.PI / 2;
      cuffMesh.position.set(-2.0, 0.2, 0);
      group.add(cuffMesh);
      break;
    }

    case 'MED-GL-403': {
      const boxGeo = new THREE.BoxGeometry(2.4, 1.2, 1.4);
      const boxMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.4, metalness: 0.1 });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      boxMesh.castShadow = true;
      group.add(boxMesh);

      const tuftGeo = new THREE.TorusGeometry(0.35, 0.12, 16, 32, Math.PI);
      const tuftMat = new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.2 });
      const tuftMesh = new THREE.Mesh(tuftGeo, tuftMat);
      tuftMesh.rotation.x = -Math.PI / 2;
      tuftMesh.position.set(0, 0.72, 0);
      group.add(tuftMesh);
      break;
    }

    case 'MED-NEB-504': {
      const handleGeo = new THREE.CylinderGeometry(0.45, 0.5, 2.0, 32);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.25 });
      const handleMesh = new THREE.Mesh(handleGeo, handleMat);
      handleMesh.position.set(0, -0.4, 0);
      group.add(handleMesh);

      const cupGeo = new THREE.CylinderGeometry(0.52, 0.45, 0.9, 32);
      const cupMat = new THREE.MeshPhysicalMaterial({ color: 0x0EA5E9, transparent: true, opacity: 0.65, transmission: 0.85 });
      const cupMesh = new THREE.Mesh(cupGeo, cupMat);
      cupMesh.position.set(0, 0.9, 0);
      group.add(cupMesh);
      break;
    }

    case 'MED-TH-605': {
      const handleGeo = new THREE.BoxGeometry(0.65, 1.6, 0.8);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.25 });
      const handleMesh = new THREE.Mesh(handleGeo, bodyMat);
      handleMesh.rotation.z = -0.15;
      handleMesh.position.set(-0.25, -0.6, 0);
      group.add(handleMesh);

      const barrelGeo = new THREE.CylinderGeometry(0.42, 0.48, 1.8, 32);
      const barrelMesh = new THREE.Mesh(barrelGeo, bodyMat);
      barrelMesh.rotation.z = Math.PI / 2;
      barrelMesh.position.set(0.2, 0.35, 0);
      group.add(barrelMesh);
      break;
    }

    case 'MED-IV-706': {
      const chamberGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.4, 32);
      const chamberMat = new THREE.MeshPhysicalMaterial({ color: 0xE0F2FE, transparent: true, opacity: 0.55, transmission: 0.9 });
      const chamberMesh = new THREE.Mesh(chamberGeo, chamberMat);
      chamberMesh.position.set(0, 0.4, 0);
      group.add(chamberMesh);
      break;
    }

    case 'MED-FA-807': {
      const pouchGeo = new THREE.BoxGeometry(2.4, 1.8, 1.3);
      const pouchMat = new THREE.MeshStandardMaterial({ color: 0xBE123C, roughness: 0.7 });
      const pouchMesh = new THREE.Mesh(pouchGeo, pouchMat);
      pouchMesh.castShadow = true;
      group.add(pouchMesh);

      const crossHGeo = new THREE.BoxGeometry(0.85, 0.28, 0.06);
      const crossVGeo = new THREE.BoxGeometry(0.28, 0.85, 0.06);
      const crossMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
      const crossH = new THREE.Mesh(crossHGeo, crossMat);
      const crossV = new THREE.Mesh(crossVGeo, crossMat);
      crossH.position.set(0, 0, 0.68);
      crossV.position.set(0, 0, 0.68);
      group.add(crossH);
      group.add(crossV);
      break;
    }

    case 'MED-SYR-908':
    default: {
      const barrelGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.4, 32);
      const barrelMat = new THREE.MeshPhysicalMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.6, transmission: 0.88 });
      const barrelMesh = new THREE.Mesh(barrelGeo, barrelMat);
      group.add(barrelMesh);

      const needleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 16);
      const needleMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.95 });
      const needleMesh = new THREE.Mesh(needleGeo, needleMat);
      needleMesh.position.set(0, 2.0, 0);
      group.add(needleMesh);
      break;
    }
  }

  return group;
}

export default function Product3DViewer({
  product,
  height = '420px',
  autoRotate = true,
  showControls = true
}) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const turntableGroupRef = useRef(null);
  const reqIdRef = useRef(null);

  // Viewer States
  const [activeMode, setActiveMode] = useState('360'); // '360' (Real Product Turntable) | 'cad' (3D CAD Mesh)
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [wireframe, setWireframe] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0); // 0 to 360 degrees
  const [zoomScale, setZoomScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const previousMousePosition = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);
  const currentRotationY = useRef(0);
  const currentTiltX = useRef(0.12);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth || 480;
    const heightPx = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF8FAFC);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(36, width / heightPx, 0.1, 100);
    camera.position.set(0, 0.7, 5.0);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const softFillLight = new THREE.PointLight(0x22C55E, 1.2, 10);
    softFillLight.position.set(-3, 0, 3);
    scene.add(softFillLight);

    const bottomGlow = new THREE.DirectionalLight(0x0284C7, 0.8);
    bottomGlow.position.set(0, -3, -2);
    scene.add(bottomGlow);

    // 5. Turntable Root Group
    const turntableGroup = new THREE.Group();
    scene.add(turntableGroup);
    turntableGroupRef.current = turntableGroup;

    // 6. Clinical Glass/Metallic Stage Pedestal
    const stageGeo = new THREE.CylinderGeometry(1.9, 2.1, 0.22, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.15,
      metalness: 0.2
    });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.position.y = -1.35;
    stageMesh.receiveShadow = true;
    turntableGroup.add(stageMesh);

    // Stage Illuminated LED Ring
    const ringGeo = new THREE.TorusGeometry(1.92, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x167733 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.24;
    turntableGroup.add(ringMesh);

    // 7. Render Product Based on Mode
    if (activeMode === '360') {
      // Load and map the real high-res medical photography onto dual-sided 3D floating showcase plane with depth
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(product.image, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;

        // Front Face with Real Product Photo
        const planeGeo = new THREE.PlaneGeometry(2.4, 2.4);
        const frontMat = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          roughness: 0.3,
          metalness: 0.05,
          side: THREE.FrontSide
        });
        const frontMesh = new THREE.Mesh(planeGeo, frontMat);
        frontMesh.position.set(0, 0.05, 0.02);
        frontMesh.castShadow = true;
        turntableGroup.add(frontMesh);

        // Rear Mirrored Specular Face for realistic 360° inspection
        const rearMat = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          roughness: 0.3,
          metalness: 0.05,
          side: THREE.BackSide
        });
        const rearMesh = new THREE.Mesh(planeGeo, rearMat);
        rearMesh.position.set(0, 0.05, -0.02);
        rearMesh.castShadow = true;
        turntableGroup.add(rearMesh);
      });
    } else {
      // 3D CAD Mode
      const cadMesh = createProductMeshGroup(product.sku);
      cadMesh.position.y = 0.05;
      turntableGroup.add(cadMesh);
    }

    // 8. Ground Soft Shadow
    const groundShadowGeo = new THREE.PlaneGeometry(4.2, 4.2);
    const groundShadowMat = new THREE.MeshBasicMaterial({
      color: 0x94A3B8,
      transparent: true,
      opacity: 0.22
    });
    const groundShadow = new THREE.Mesh(groundShadowGeo, groundShadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -1.48;
    scene.add(groundShadow);

    // 9. Animation & Inertia Physics Loop
    let clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (turntableGroup) {
        if (isRotating && !isDragging) {
          currentRotationY.current += delta * 0.55;
        } else if (!isDragging && Math.abs(velocity.current) > 0.0001) {
          currentRotationY.current += velocity.current;
          velocity.current *= 0.94; // Smooth momentum decay
        }

        turntableGroup.rotation.y = currentRotationY.current;
        turntableGroup.rotation.x = currentTiltX.current;
        turntableGroup.scale.set(zoomScale, zoomScale, zoomScale);

        // Update displayed 360° degree angle
        const normalizedDeg = Math.round(((currentRotationY.current % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2) * (180 / Math.PI));
        setRotationAngle(normalizedDeg);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [product.sku, product.image, activeMode, isRotating, isDragging, zoomScale]);

  // Wireframe toggle in CAD mode
  useEffect(() => {
    if (!turntableGroupRef.current) return;
    turntableGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material && activeMode === 'cad') {
        child.material.wireframe = wireframe;
      }
    });
  }, [wireframe, activeMode]);

  // Mouse / Touch Interaction Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsRotating(false);
    velocity.current = 0;
    previousMousePosition.current = { x: e.clientX || e.touches?.[0]?.clientX, y: e.clientY || e.touches?.[0]?.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    if (!clientX || !clientY) return;

    const deltaX = clientX - previousMousePosition.current.x;
    const deltaY = clientY - previousMousePosition.current.y;

    currentRotationY.current += deltaX * 0.012;
    currentTiltX.current = Math.max(-0.25, Math.min(0.35, currentTiltX.current + deltaY * 0.006));
    velocity.current = deltaX * 0.008;

    previousMousePosition.current = { x: clientX, y: clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Preset Angle Snapping
  const snapToAngle = (degrees) => {
    setIsRotating(false);
    velocity.current = 0;
    currentRotationY.current = (degrees * Math.PI) / 180;
    currentTiltX.current = 0.12;
  };

  const handleZoom = (direction) => {
    setZoomScale(prev => Math.max(0.8, Math.min(1.7, prev + direction * 0.15)));
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: height,
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F1F5F9 100%)',
        border: '1px solid #E2E8F0',
        boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.02)'
      }}
    >
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      />

      {/* Top Left: 360° Real Product Badge & Angle Heading */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            border: '1px solid #E2E8F0',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#167733',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
        >
          <Sparkles size={13} color="#167733" />
          <span>Original Clinical Device (360° Studio Turntable)</span>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            color: '#FFFFFF',
            padding: '0.25rem 0.65rem',
            borderRadius: '8px',
            fontSize: '0.72rem',
            fontFamily: 'JetBrains Mono',
            fontWeight: 600,
            width: 'fit-content'
          }}
        >
          <Compass size={12} className="text-teal" />
          <span>Heading: {rotationAngle}° / 360°</span>
        </div>
      </div>

      {/* Top Right: Mode Switcher (360° Real Photo vs 3D CAD) */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          display: 'flex',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          padding: '3px',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          gap: '2px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}
      >
        <button
          onClick={() => setActiveMode('360')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '0.35rem 0.75rem',
            borderRadius: '9px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeMode === '360' ? '#167733' : 'transparent',
            color: activeMode === '360' ? '#FFFFFF' : '#64748B',
            transition: 'all 0.15s ease'
          }}
        >
          <ImageIcon size={13} />
          <span>360° Real</span>
        </button>

        <button
          onClick={() => setActiveMode('cad')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '0.35rem 0.75rem',
            borderRadius: '9px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeMode === 'cad' ? '#167733' : 'transparent',
            color: activeMode === 'cad' ? '#FFFFFF' : '#64748B',
            transition: 'all 0.15s ease'
          }}
        >
          <Box size={13} />
          <span>3D CAD</span>
        </button>
      </div>

      {/* Bottom Center: Quick Angle Presets */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(10px)',
          padding: '0.35rem 0.5rem',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
        }}
      >
        {[
          { label: 'Front', deg: 0 },
          { label: 'Right (90°)', deg: 90 },
          { label: 'Rear (180°)', deg: 180 },
          { label: 'Left (270°)', deg: 270 }
        ].map(preset => (
          <button
            key={preset.label}
            onClick={() => snapToAngle(preset.deg)}
            style={{
              border: 'none',
              backgroundColor: Math.abs(rotationAngle - preset.deg) < 15 ? '#DCFCE7' : '#F8FAFC',
              color: Math.abs(rotationAngle - preset.deg) < 15 ? '#167733' : '#475569',
              padding: '0.3rem 0.6rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Bottom Right: Interactive Controls */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(10px)',
            padding: '0.35rem',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Zoom Controls */}
          <button
            onClick={() => handleZoom(1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: '#F1F5F9',
              color: '#475569',
              cursor: 'pointer'
            }}
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>

          <button
            onClick={() => handleZoom(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: '#F1F5F9',
              color: '#475569',
              cursor: 'pointer'
            }}
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>

          {/* Auto-Rotate 360° Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: isRotating ? '#DCFCE7' : '#F1F5F9',
              color: isRotating ? '#167733' : '#64748B',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={isRotating ? 'Pause 360° spin' : 'Auto-spin 360°'}
          >
            <RotateCcw size={14} />
          </button>

          {/* Wireframe Toggle in CAD mode */}
          {activeMode === 'cad' && (
            <button
              onClick={() => setWireframe(!wireframe)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: wireframe ? '#E0F2FE' : '#F1F5F9',
                color: wireframe ? '#0284C7' : '#64748B',
                cursor: 'pointer'
              }}
              title="Toggle Wireframe CAD mesh"
            >
              <Layers size={14} />
            </button>
          )}

          {/* Reset Camera View */}
          <button
            onClick={() => {
              snapToAngle(0);
              setZoomScale(1);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: '#F1F5F9',
              color: '#64748B',
              cursor: 'pointer'
            }}
            title="Reset to 0° front view"
          >
            <Eye size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
