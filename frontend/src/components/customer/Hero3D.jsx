import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF8FAFC); // Clean subtle off-white

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const fillLight = new THREE.PointLight(0x22C55E, 1.5, 10);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x0284C7, 1.0, 10);
    rimLight.position.set(3, -2, -2);
    scene.add(rimLight);

    // Group for all floating objects
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Medical Supply Delivery Box
    const boxGeo = new THREE.BoxGeometry(2.2, 1.5, 1.8);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.25,
      metalness: 0.05
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxMesh.position.set(-0.3, 0.2, 0);
    boxMesh.rotation.set(0.15, -0.35, 0.08);
    group.add(boxMesh);

    // Medical Green Cross on Top of Box
    const crossMat = new THREE.MeshStandardMaterial({ color: 0x167733, roughness: 0.3 });
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.7), crossMat);
    crossV.position.set(-0.3, 0.97, 0);
    crossV.rotation.set(0.15, -0.35, 0.08);
    group.add(crossV);

    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.22), crossMat);
    crossH.position.set(-0.3, 0.97, 0);
    crossH.rotation.set(0.15, -0.35, 0.08);
    group.add(crossH);

    // 2. Floating Pulse Oximeter Product
    const oxiGeo = new THREE.BoxGeometry(1.2, 0.7, 0.65);
    const oxiMat = new THREE.MeshStandardMaterial({
      color: 0x0F172A, // Deep Charcoal Medical Body
      roughness: 0.2,
      metalness: 0.1
    });
    const oxiMesh = new THREE.Mesh(oxiGeo, oxiMat);
    oxiMesh.position.set(1.5, 0.9, 0.6);
    oxiMesh.rotation.set(-0.25, 0.45, -0.15);
    oxiMesh.castShadow = true;
    group.add(oxiMesh);

    // OLED Glowing Screen
    const screenGeo = new THREE.PlaneGeometry(0.8, 0.4);
    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x22C55E // Glowing clinical green OLED
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(1.5, 1.26, 0.65);
    screenMesh.rotation.set(-0.25, 0.45, -0.15);
    group.add(screenMesh);

    // 3. Floating Sterile Canister / Vaccine Vial
    const canGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.3, 32);
    const canMat = new THREE.MeshPhysicalMaterial({
      color: 0xE2E8F0,
      transmission: 0.6,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.45
    });
    const canMesh = new THREE.Mesh(canGeo, canMat);
    canMesh.position.set(-1.8, -0.6, 0.8);
    canMesh.rotation.set(0.4, 0.2, -0.3);
    canMesh.castShadow = true;
    group.add(canMesh);

    // Canister Cap (Clinical Teal)
    const capGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.25, 32);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x0D9488, roughness: 0.3 });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.set(-1.8, 0.1, 0.8);
    capMesh.rotation.set(0.4, 0.2, -0.3);
    group.add(capMesh);

    // 4. Subtle Floating Spheres (Molecular / Cellular accents)
    const sphereMat1 = new THREE.MeshStandardMaterial({ color: 0x167733, roughness: 0.2, metalness: 0.1 });
    const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), sphereMat1);
    sphere1.position.set(2.2, -0.8, -0.5);
    group.add(sphere1);

    const sphereMat2 = new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.2, metalness: 0.1 });
    const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 24), sphereMat2);
    sphere2.position.set(-1.2, 1.6, -0.2);
    group.add(sphere2);

    // Soft Shadow Floor
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.08 });
    const shadowFloor = new THREE.Mesh(shadowGeo, shadowMat);
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -1.8;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.4;
      targetY = y * 0.3;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle floating bob
      group.position.y = Math.sin(elapsed * 1.2) * 0.1;
      
      // Individual floating micro-motions
      oxiMesh.position.y = 0.9 + Math.sin(elapsed * 1.5 + 1) * 0.08;
      screenMesh.position.y = oxiMesh.position.y + 0.36;

      canMesh.position.y = -0.6 + Math.cos(elapsed * 1.1) * 0.07;
      capMesh.position.y = canMesh.position.y + 0.7;

      sphere1.position.y = -0.8 + Math.sin(elapsed * 1.8 + 2) * 0.1;
      sphere2.position.y = 1.6 + Math.cos(elapsed * 1.4 + 0.5) * 0.09;

      // Mouse Parallax Interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      group.rotation.y = mouseX + Math.sin(elapsed * 0.3) * 0.06;
      group.rotation.x = mouseY + Math.cos(elapsed * 0.4) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '460px',
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F1F5F9 100%)',
        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), 0 20px 40px -15px rgba(15, 23, 42, 0.07)',
        border: '1px solid #E2E8F0'
      }}
    />
  );
}
