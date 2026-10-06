import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { NasaMission, ScienceSite, TelemetryData } from '../types';
import { getMolaLroTerrain, PlanetaryTerrainData } from './molaLroTerrain';
import { soundFx } from '../utils/audio';
//made with google ai studi
export interface SimulationHandle {
  rotateCamera: (deltaYaw: number) => void;
  resetCamera: () => void;
  driveDirection: (dir: 'forward' | 'backward' | 'left' | 'right', active: boolean) => void;
}

interface ScientificSimulation3DProps {
  mission: NasaMission;
  activeSite: ScienceSite | null;
  targetAutonavSite: ScienceSite | null;
  cameraMode: 'chase' | 'cockpit' | 'first_person';
  onSelectSite: (site: ScienceSite) => void;
  onClearAutonav: () => void;
  onTelemetryUpdate: (data: TelemetryData) => void;
}

export const ScientificSimulation3D = forwardRef<SimulationHandle, ScientificSimulation3DProps>(({
  mission,
  activeSite,
  targetAutonavSite,
  cameraMode,
  onSelectSite,
  onClearAutonav,
  onTelemetryUpdate,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const inputsRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false,
  });

  // Camera Orbit / FPV Look State (controlled by mouse/touch drag)
  const orbitRef = useRef({
    yaw: 0.0,
    pitch: 0.0, // horizontal level for FPV
    distance: 8.5,
    isDragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const siteInteractMeshesRef = useRef<{ mesh: THREE.Object3D; site: ScienceSite }[]>([]);

  // Rover state refs for physics
  const roverPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const roverYawRef = useRef(0);
  const roverSpeedRef = useRef(0);
  const steerAngleRef = useRef(0);
  const wheelSpinRef = useRef(0);
  const distanceRef = useRef(0);

  // Keep callback and active site refs stable inside Three.js animation frame loop
  const onSelectSiteRef = useRef(onSelectSite);
  const onTelemetryUpdateRef = useRef(onTelemetryUpdate);
  const activeSiteRef = useRef(activeSite);
  const targetAutonavRef = useRef(targetAutonavSite);
  const cameraModeRef = useRef(cameraMode);

  useEffect(() => {
    onSelectSiteRef.current = onSelectSite;
  }, [onSelectSite]);

  useEffect(() => {
    onTelemetryUpdateRef.current = onTelemetryUpdate;
  }, [onTelemetryUpdate]);

  useEffect(() => {
    activeSiteRef.current = activeSite;
  }, [activeSite]);

  useEffect(() => {
    targetAutonavRef.current = targetAutonavSite;
  }, [targetAutonavSite]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  // Imperative handle for compass dial rotation & driving
  useImperativeHandle(ref, () => ({
    rotateCamera: (deltaYaw: number) => {
      orbitRef.current.yaw += deltaYaw;
    },
    resetCamera: () => {
      orbitRef.current.yaw = 0.0;
      orbitRef.current.pitch = 0.35;
    },
    driveDirection: (dir: 'forward' | 'backward' | 'left' | 'right', active: boolean) => {
      inputsRef.current[dir] = active;
      if (active) onClearAutonav();
    },
  }));

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        inputsRef.current.forward = true;
        onClearAutonav();
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        inputsRef.current.backward = true;
        onClearAutonav();
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        inputsRef.current.left = true;
        onClearAutonav();
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        inputsRef.current.right = true;
        onClearAutonav();
      } else if (['ShiftLeft', 'ShiftRight'].includes(e.code)) {
        inputsRef.current.boost = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        inputsRef.current.forward = false;
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        inputsRef.current.backward = false;
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        inputsRef.current.left = false;
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        inputsRef.current.right = false;
      } else if (['ShiftLeft', 'ShiftRight'].includes(e.code)) {
        inputsRef.current.boost = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onClearAutonav]);

  // Mouse & Touch Drag Orbit / FPV Controls on Canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, select, input, a, .interactive-ui')) {
      return;
    }
    orbitRef.current.isDragging = true;
    orbitRef.current.startX = e.clientX;
    orbitRef.current.startY = e.clientY;
    orbitRef.current.lastX = e.clientX;
    orbitRef.current.lastY = e.clientY;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!orbitRef.current.isDragging) return;
    const dx = e.clientX - orbitRef.current.lastX;
    const dy = e.clientY - orbitRef.current.lastY;
    orbitRef.current.lastX = e.clientX;
    orbitRef.current.lastY = e.clientY;

    // Full 360-degree horizontal rotation and smooth vertical pitch
    orbitRef.current.yaw -= dx * 0.005;
    orbitRef.current.pitch = Math.max(
      -0.85,
      Math.min(0.85, orbitRef.current.pitch + dy * 0.005)
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const isDrag = Math.hypot(e.clientX - orbitRef.current.startX, e.clientY - orbitRef.current.startY) > 7;
    orbitRef.current.isDragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    // Raycast destination selection if clicked (not dragged)
    if (!isDrag && cameraRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const meshes = siteInteractMeshesRef.current.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(meshes, true);
      if (intersects.length > 0) {
        const hitObj = intersects[0].object;
        const found = siteInteractMeshesRef.current.find((item) => {
          let curr: THREE.Object3D | null = hitObj;
          while (curr) {
            if (curr === item.mesh) return true;
            curr = curr.parent;
          }
          return false;
        });
        if (found) {
          onSelectSiteRef.current(found.site);
          soundFx.playChirp();
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    orbitRef.current.distance = THREE.MathUtils.clamp(
      orbitRef.current.distance + e.deltaY * 0.01,
      4.0,
      25.0
    );
  };

  // ---------------------------------------------------------------------------
  // MAIN THREE.JS SIMULATION SCENE LIFECYCLE (Dependencies: ONLY mission.id)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset rover state for the mission
    roverPosRef.current.set(0, 0, 0);
    roverYawRef.current = 0;
    roverSpeedRef.current = 0;
    steerAngleRef.current = 0;
    wheelSpinRef.current = 0;
    distanceRef.current = 0;
    orbitRef.current.yaw = 0.0;
    orbitRef.current.pitch = 0.35;
    orbitRef.current.distance = mission.missionType === 'surface_rover' ? 8.5 : 10.5;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(mission.environment.skyColorHex);
    scene.fog = new THREE.FogExp2(
      mission.environment.fogColorHex,
      mission.missionType === 'surface_rover' ? 0.012 : 0.002
    );

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4.5, 9.5);
    camera.lookAt(0, 1.2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      mission.missionType === 'surface_rover' ? 0.65 : 0.35
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      mission.environment.sunColorHex,
      mission.environment.sunIntensity
    );
    sunLight.position.set(50, 80, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1.0;
    sunLight.shadow.camera.far = 250;
    const shadowSize = 50;
    sunLight.shadow.camera.left = -shadowSize;
    sunLight.shadow.camera.right = shadowSize;
    sunLight.shadow.camera.top = shadowSize;
    sunLight.shadow.camera.bottom = -shadowSize;
    scene.add(sunLight);

    if (mission.envType === 'mars') {
      const hemiLight = new THREE.HemisphereLight(0xffecd2, 0x8b3a1a, 0.45);
      scene.add(hemiLight);
    } else if (mission.envType === 'moon') {
      const hemiLight = new THREE.HemisphereLight(0xdde5ed, 0x475569, 0.35);
      scene.add(hemiLight);
    }

    // 3. Build illustrative procedural terrain (NOT real MOLA/LOLA data)
    let terrainData: PlanetaryTerrainData | null = null;
    let terrainMesh: THREE.Mesh | null = null;
    const TERRAIN_SIZE = 240;
    const TERRAIN_SEGS = 160;

    if (mission.missionType === 'surface_rover') {
      terrainData = getMolaLroTerrain(mission.id, mission.envType);

      const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGS, TERRAIN_SEGS);
      geo.rotateX(-Math.PI / 2);
      const posAttr = geo.attributes.position;

      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vz = posAttr.getZ(i);
        const vy = terrainData.sampleHeight(vx, vz);
        posAttr.setY(i, vy);
      }
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        map: terrainData.diffuseMap,
        normalMap: terrainData.normalMap,
        normalScale: new THREE.Vector2(1.5, 1.5),
        roughnessMap: terrainData.roughnessMap,
        roughness: 0.92,
        metalness: 0.04,
      });

      terrainMesh = new THREE.Mesh(geo, mat);
      terrainMesh.receiveShadow = true;
      scene.add(terrainMesh);

      // Rocks and geological boulders
      const rockGeo = new THREE.DodecahedronGeometry(1.0, 1);
      const rockMat = new THREE.MeshStandardMaterial({
        map: terrainData.diffuseMap,
        roughness: 0.95,
      });
      const rockCount = 60;
      for (let i = 0; i < rockCount; i++) {
        const rx = (Math.sin(i * 7.7) * 0.5) * (TERRAIN_SIZE * 0.7);
        const rz = (Math.cos(i * 11.3) * 0.5) * (TERRAIN_SIZE * 0.7);
        if (Math.hypot(rx, rz) < 14) continue;
        const ry = terrainData.sampleHeight(rx, rz);
        const scale = 0.5 + Math.abs(Math.sin(i * 4.3)) * 1.5;

        const rockMesh = new THREE.Mesh(rockGeo, rockMat);
        rockMesh.position.set(rx, ry + scale * 0.35, rz);
        rockMesh.scale.set(scale, scale * 0.75, scale * 1.1);
        rockMesh.rotation.set(Math.sin(i), Math.cos(i), i * 0.4);
        rockMesh.castShadow = true;
        rockMesh.receiveShadow = true;
        scene.add(rockMesh);
      }

      if (mission.envType === 'moon') {
        const earthGeo = new THREE.SphereGeometry(6, 32, 32);
        const earthMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.35,
          roughness: 0.6,
        });
        const earthMesh = new THREE.Mesh(earthGeo, earthMat);
        earthMesh.position.set(50, 75, -150);
        scene.add(earthMesh);
      } else if (mission.envType === 'mars') {
        const phobosGeo = new THREE.DodecahedronGeometry(2.0, 1);
        const phobosMat = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.95 });
        const phobosMesh = new THREE.Mesh(phobosGeo, phobosMat);
        phobosMesh.position.set(-60, 70, -140);
        scene.add(phobosMesh);
      }
    } else {
      // Space Flyby Environment
      const starGeo = new THREE.BufferGeometry();
      const starCount = 3500;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        starPos[i] = (Math.random() - 0.5) * 800;
        starPos[i + 1] = (Math.random() - 0.5) * 800;
        starPos[i + 2] = (Math.random() - 0.5) * 800;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, transparent: true, opacity: 0.85 })));

      if (mission.id === 'luna-1') {
        const moonGeo = new THREE.SphereGeometry(24, 36, 36);
        const moonMesh = new THREE.Mesh(moonGeo, new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.95 }));
        moonMesh.position.set(30, 0, -120);
        scene.add(moonMesh);
      } else if (mission.id === 'pioneer-10' || mission.id === 'voyager-1') {
        const jupMesh = new THREE.Mesh(new THREE.SphereGeometry(34, 48, 48), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85 }));
        jupMesh.position.set(35, 5, -125);
        scene.add(jupMesh);

        const grsMesh = new THREE.Mesh(new THREE.SphereGeometry(4.8, 16, 16), new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.8 }));
        grsMesh.position.set(21, 0, -98);
        scene.add(grsMesh);

        if (mission.id === 'voyager-1') {
          const ioMesh = new THREE.Mesh(new THREE.SphereGeometry(5.5, 24, 24), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.9 }));
          ioMesh.position.set(18, 2, -65);
          scene.add(ioMesh);

          const plumeGeo = new THREE.BufferGeometry();
          const plumeCount = 280;
          const plumePos = new Float32Array(plumeCount * 3);
          for (let p = 0; p < plumeCount; p++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 3.2;
            plumePos[p * 3] = Math.cos(angle) * radius;
            plumePos[p * 3 + 1] = Math.random() * 7 + 3;
            plumePos[p * 3 + 2] = Math.sin(angle) * radius;
          }
          plumeGeo.setAttribute('position', new THREE.BufferAttribute(plumePos, 3));
          const plumeMesh = new THREE.Points(plumeGeo, new THREE.PointsMaterial({ color: 0xfef08a, size: 0.8, transparent: true, opacity: 0.75 }));
          plumeMesh.position.set(18, 4, -65);
          scene.add(plumeMesh);
        }
      } else if (mission.id === 'pioneer-11') {
        const saturnMesh = new THREE.Mesh(new THREE.SphereGeometry(24, 40, 40), new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.8 }));
        saturnMesh.position.set(25, 0, -115);
        scene.add(saturnMesh);

        const ringGeo = new THREE.RingGeometry(30, 52, 64);
        ringGeo.rotateX(Math.PI / 2.3);
        const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({ color: 0xd4a373, side: THREE.DoubleSide, transparent: true, opacity: 0.78 }));
        ringMesh.position.set(25, 0, -115);
        scene.add(ringMesh);

        const fRingGeo = new THREE.RingGeometry(55, 56.5, 64);
        fRingGeo.rotateX(Math.PI / 2.3);
        const fRingMesh = new THREE.Mesh(fRingGeo, new THREE.MeshStandardMaterial({ color: 0xfacc15, side: THREE.DoubleSide, transparent: true, opacity: 0.95, emissive: 0xca8a04, emissiveIntensity: 0.5 }));
        fRingMesh.position.set(25, 0, -115);
        scene.add(fRingMesh);
      }
    }

    // 4. Construct Spacecraft Model
    const vehicleGroup = new THREE.Group();
    const wheelMeshes: THREE.Mesh[] = [];

    if (mission.missionType === 'surface_rover') {
      const isApollo = mission.id === 'apollo-15';
      const isSojourner = mission.id === 'sojourner';
      const roverScale = isSojourner ? 0.55 : isApollo ? 0.95 : 0.85;

      const bodyGeo = new THREE.BoxGeometry(1.2 * roverScale, 0.45 * roverScale, 1.6 * roverScale);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: isApollo ? 0xe2e8f0 : 0xd97706,
        metalness: isApollo ? 0.3 : 0.8,
        roughness: 0.35,
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bodyMesh.position.y = 0.55 * roverScale;
      bodyMesh.castShadow = true;
      vehicleGroup.add(bodyMesh);

      if (!isApollo) {
        const solarGeo = new THREE.BoxGeometry(1.8 * roverScale, 0.04 * roverScale, 1.5 * roverScale);
        const solarMat = new THREE.MeshStandardMaterial({
          color: 0x1e1b4b,
          metalness: 0.9,
          roughness: 0.15,
          emissive: 0x0284c7,
          emissiveIntensity: 0.2,
        });
        const solarMesh = new THREE.Mesh(solarGeo, solarMat);
        solarMesh.position.y = 0.8 * roverScale;
        solarMesh.castShadow = true;
        vehicleGroup.add(solarMesh);
      }

      const dishGeo = new THREE.ConeGeometry(0.35 * roverScale, 0.1 * roverScale, 16, 1, true);
      dishGeo.rotateX(-Math.PI / 2.5);
      const dish = new THREE.Mesh(dishGeo, new THREE.MeshStandardMaterial({ color: 0xf8fafc, side: THREE.DoubleSide }));
      dish.position.set(-0.35 * roverScale, 0.95 * roverScale, -0.4 * roverScale);
      vehicleGroup.add(dish);

      const mastGeo = new THREE.CylinderGeometry(0.035 * roverScale, 0.035 * roverScale, 0.9 * roverScale, 8);
      const mast = new THREE.Mesh(mastGeo, new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 }));
      mast.position.set(0.3 * roverScale, 1.25 * roverScale, 0.45 * roverScale);
      vehicleGroup.add(mast);

      const headGeo = new THREE.BoxGeometry(0.3 * roverScale, 0.12 * roverScale, 0.16 * roverScale);
      const head = new THREE.Mesh(headGeo, new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 }));
      head.position.set(0.3 * roverScale, 1.7 * roverScale, 0.45 * roverScale);
      vehicleGroup.add(head);

      const wheelR = 0.25 * roverScale;
      const wheelW = 0.18 * roverScale;
      const wheelGeo = new THREE.CylinderGeometry(wheelR, wheelR, wheelW, 16);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.4 });

      const wheelCoords = [
        [-0.75 * roverScale, wheelR, 0.65 * roverScale],
        [0.75 * roverScale, wheelR, 0.65 * roverScale],
        [-0.82 * roverScale, wheelR, 0.0],
        [0.82 * roverScale, wheelR, 0.0],
        [-0.75 * roverScale, wheelR, -0.65 * roverScale],
        [0.75 * roverScale, wheelR, -0.65 * roverScale],
      ];

      wheelCoords.forEach(([wx, wy, wz]) => {
        const wGroup = new THREE.Group();
        wGroup.position.set(wx, wy, wz);
        const mesh = new THREE.Mesh(wheelGeo, wheelMat);
        mesh.castShadow = true;
        wGroup.add(mesh);
        vehicleGroup.add(wGroup);
        wheelMeshes.push(mesh);
      });
    } else {
      if (mission.id === 'luna-1') {
        const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 24), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.15 }));
        vehicleGroup.add(sphereMesh);

        for (let a = 0; a < 4; a++) {
          const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.2, 6), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
          const ang = (a * Math.PI) / 2;
          ant.position.set(Math.cos(ang) * 0.7, Math.sin(ang) * 0.7, -0.4);
          ant.rotation.z = ang;
          vehicleGroup.add(ant);
        }
      } else {
        const dishMesh = new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.4, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0xf8fafc, side: THREE.DoubleSide }));
        dishMesh.rotateX(-Math.PI / 2);
        vehicleGroup.add(dishMesh);

        vehicleGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.8, 10), new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.6, roughness: 0.4 })));

        const rtg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 6), new THREE.MeshStandardMaterial({ color: 0x475569 }));
        rtg.rotateZ(Math.PI / 2.5);
        rtg.position.set(-1.3, -0.2, -0.4);
        vehicleGroup.add(rtg);

        const plaque = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.02, 16), new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.95, roughness: 0.1 }));
        plaque.rotateX(Math.PI / 2);
        plaque.position.set(0.85, 0, 0);
        vehicleGroup.add(plaque);
      }
    }

    scene.add(vehicleGroup);

    // 5. Scientific Investigation Site Beacons
    siteInteractMeshesRef.current = [];
    const siteGroups: { site: ScienceSite; group: THREE.Group }[] = [];
    mission.sites.forEach((site) => {
      const g = new THREE.Group();
      const [sx, , sz] = site.coordinates;
      const sy = terrainData ? terrainData.sampleHeight(sx, sz) : site.coordinates[1];
      g.position.set(sx, sy, sz);

      const ringGeo = new THREE.RingGeometry(site.radius * 0.6, site.radius, 32);
      ringGeo.rotateX(-Math.PI / 2);
      g.add(new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: site.beaconColor, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })));

      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.35, 24, 8), new THREE.MeshBasicMaterial({ color: site.beaconColor, transparent: true, opacity: 0.4 }));
      beam.position.y = 12;
      g.add(beam);

      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), new THREE.MeshBasicMaterial({ color: site.beaconColor }));
      orb.position.y = 2.5;
      g.add(orb);

      // Invisible hit cylinder for effortless clicking on the destination in 3D
      const hitCylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(site.radius * 1.2, site.radius * 1.2, 30, 16),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitCylinder.position.y = 15;
      g.add(hitCylinder);

      scene.add(g);
      siteGroups.push({ site, group: g });
      siteInteractMeshesRef.current.push({ mesh: g, site });
    });

    // -------------------------------------------------------------------------
    // 6. Physics Animation Loop
    // -------------------------------------------------------------------------
    let animId: number;
    let lastTime = performance.now();
    let telemetryTimer = 0;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;

      const isSurface = mission.missionType === 'surface_rover';
      const inputs = inputsRef.current;
      const targetAutonav = targetAutonavRef.current;

      // Medium brisk speed (not sluggish)
      const maxSpeed = (inputs.boost ? 12.0 : 8.2) * (isSurface ? 1.0 : 2.0);
      const accel = 12.0;
      const turnSpeed = 2.6;
      const friction = 0.90;

      if (targetAutonav) {
        const dx = targetAutonav.coordinates[0] - roverPosRef.current.x;
        const dz = targetAutonav.coordinates[2] - roverPosRef.current.z;
        const dist = Math.hypot(dx, dz);

        if (dist < targetAutonav.radius) {
          onSelectSiteRef.current(targetAutonav);
          targetAutonavRef.current = null;
          roverSpeedRef.current = 0;
          soundFx.playDiscoveryChime();
          onClearAutonav();
        } else {
          const desiredYaw = Math.atan2(-dx, -dz);
          let diff = desiredYaw - roverYawRef.current;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;

          roverYawRef.current += THREE.MathUtils.clamp(diff * 4.2 * delta, -turnSpeed * delta, turnSpeed * delta);
          // Medium autonav cruise speed
          const cruiseSpeed = isSurface ? 7.5 : 12.0;
          const targetSpd = dist < 14 ? Math.max(3.2, (dist / 14) * cruiseSpeed) : cruiseSpeed;
          roverSpeedRef.current = THREE.MathUtils.lerp(roverSpeedRef.current, targetSpd, 0.15);
        }
      } else {
        if (inputs.left) {
          roverYawRef.current += turnSpeed * delta;
          steerAngleRef.current = THREE.MathUtils.lerp(steerAngleRef.current, 0.45, 0.15);
        } else if (inputs.right) {
          roverYawRef.current -= turnSpeed * delta;
          steerAngleRef.current = THREE.MathUtils.lerp(steerAngleRef.current, -0.45, 0.15);
        } else {
          steerAngleRef.current = THREE.MathUtils.lerp(steerAngleRef.current, 0.0, 0.15);
        }

        if (inputs.forward) {
          roverSpeedRef.current = Math.min(maxSpeed, roverSpeedRef.current + accel * delta);
          if (Math.random() < 0.04) soundFx.playThrusterPulse();
        } else if (inputs.backward) {
          roverSpeedRef.current = Math.max(-maxSpeed * 0.5, roverSpeedRef.current - accel * delta);
        } else {
          roverSpeedRef.current *= friction;
        }
      }

      if (Math.abs(roverSpeedRef.current) < 0.01) roverSpeedRef.current = 0;

      const vx = -Math.sin(roverYawRef.current) * roverSpeedRef.current * delta;
      const vz = -Math.cos(roverYawRef.current) * roverSpeedRef.current * delta;
      roverPosRef.current.x += vx;
      roverPosRef.current.z += vz;

      roverPosRef.current.x = THREE.MathUtils.clamp(roverPosRef.current.x, -115, 115);
      roverPosRef.current.z = THREE.MathUtils.clamp(roverPosRef.current.z, -115, 115);

      const stepDist = Math.hypot(vx, vz);
      distanceRef.current += stepDist;
      wheelSpinRef.current += (roverSpeedRef.current * delta * 5.0);

      wheelMeshes.forEach((wm) => {
        wm.rotation.x = wheelSpinRef.current;
      });

      let groundY = 0;
      let normal = new THREE.Vector3(0, 1, 0);
      let pitchDeg = 0;
      let rollDeg = 0;
      let slopeGrade = 0;

      if (isSurface && terrainData) {
        groundY = terrainData.sampleHeight(roverPosRef.current.x, roverPosRef.current.z);
        normal = terrainData.sampleNormal(roverPosRef.current.x, roverPosRef.current.z);

        const forwardVec = new THREE.Vector3(-Math.sin(roverYawRef.current), 0, -Math.cos(roverYawRef.current));
        const incline = -forwardVec.dot(normal);
        slopeGrade = Math.round(incline * 100);

        pitchDeg = Math.round((Math.asin(THREE.MathUtils.clamp(incline, -1, 1)) * 180) / Math.PI);
        const rightVec = new THREE.Vector3(Math.cos(roverYawRef.current), 0, -Math.sin(roverYawRef.current));
        rollDeg = Math.round((Math.asin(THREE.MathUtils.clamp(rightVec.dot(normal), -1, 1)) * 180) / Math.PI);

        vehicleGroup.position.set(roverPosRef.current.x, groundY, roverPosRef.current.z);

        const upVec = normal.clone();
        const rgtVec = new THREE.Vector3().crossVectors(forwardVec, upVec).normalize();
        const correctedFwd = new THREE.Vector3().crossVectors(upVec, rgtVec).normalize();
        const rotMat = new THREE.Matrix4().makeBasis(rgtVec, upVec, correctedFwd.negate());
        vehicleGroup.quaternion.setFromRotationMatrix(rotMat);
      } else {
        vehicleGroup.position.set(roverPosRef.current.x, 0, roverPosRef.current.z);
        vehicleGroup.rotation.y = roverYawRef.current;
      }

      // Camera Positioning
      const camMode = cameraModeRef.current;
      const orbit = orbitRef.current;

      if (camMode === 'chase') {
        const totalYaw = roverYawRef.current + orbit.yaw;
        const totalPitch = orbit.pitch;
        const dist = orbit.distance;

        const cx = roverPosRef.current.x + Math.sin(totalYaw) * dist * Math.cos(totalPitch);
        const cz = roverPosRef.current.z + Math.cos(totalYaw) * dist * Math.cos(totalPitch);
        const cy = groundY + 1.2 + Math.sin(totalPitch) * dist;

        camera.position.lerp(new THREE.Vector3(cx, cy, cz), 0.15);
        camera.lookAt(roverPosRef.current.x, groundY + 1.1, roverPosRef.current.z);
      } else {
        // FPV Mast / Cockpit Camera (360° movable in all directions via drag)
        const eyeY = groundY + (isSurface ? 1.65 : 0.6);
        const lookYaw = roverYawRef.current + orbit.yaw;
        const lookPitch = orbit.pitch;

        const lx = roverPosRef.current.x - Math.sin(lookYaw) * Math.cos(lookPitch) * 25;
        const ly = eyeY + Math.sin(lookPitch) * 25;
        const lz = roverPosRef.current.z - Math.cos(lookYaw) * Math.cos(lookPitch) * 25;

        camera.position.set(roverPosRef.current.x, eyeY, roverPosRef.current.z);
        camera.lookAt(lx, ly, lz);
      }

      siteGroups.forEach(({ site, group }) => {
        const dx = roverPosRef.current.x - site.coordinates[0];
        const dz = roverPosRef.current.z - site.coordinates[2];
        const dist = Math.hypot(dx, dz);

        const orb = group.children[2];
        if (orb) {
          orb.scale.setScalar(1.0 + Math.sin(now * 0.005) * 0.2);
        }

        if (dist <= site.radius && (!activeSiteRef.current || activeSiteRef.current.id !== site.id)) {
          onSelectSiteRef.current(site);
          soundFx.playDiscoveryChime();
        }
      });

      telemetryTimer += delta;
      if (telemetryTimer > 0.06) {
        telemetryTimer = 0;
        const headingDeg = Math.round((((roverYawRef.current * 180) / Math.PI) % 360 + 360) % 360);
        const kmh = Math.abs(roverSpeedRef.current * 3.6);
        const isCriticalTilt = Math.abs(pitchDeg) > 28 || Math.abs(rollDeg) > 28;
        const isWarningTilt = Math.abs(pitchDeg) > 18 || Math.abs(rollDeg) > 18;

        onTelemetryUpdateRef.current({
          x: Math.round(roverPosRef.current.x * 10) / 10,
          y: Math.round(groundY * 10) / 10,
          z: Math.round(roverPosRef.current.z * 10) / 10,
          speed: Math.round(kmh * 10) / 10,
          headingDeg,
          pitchDeg,
          rollDeg,
          distanceTraveledMeters: Math.round(distanceRef.current * 10) / 10,
          powerWatts: Math.round(mission.specs.powerOutputWatts * (1 - Math.min(0.2, (Math.abs(roverPosRef.current.x) / 100) * 0.1))),
          slopeGradePercent: slopeGrade,
          inclineStatus: isCriticalTilt ? 'critical_tilt' : isWarningTilt ? 'steep_warning' : 'nominal',
          tractionSlip: Math.min(1.0, Math.abs(slopeGrade) / 45),
        });
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mission.id]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className="relative h-full w-full overflow-hidden select-none bg-[#05070c] touch-none cursor-grab active:cursor-grabbing"
    />
  );
});

ScientificSimulation3D.displayName = 'ScientificSimulation3D';
