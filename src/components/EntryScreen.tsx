import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface EntryScreenProps {
  onStart: () => void;
}

export const EntryScreen: React.FC<EntryScreenProps> = ({ onStart }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#9a3412');

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      1000
    );

    camera.position.set(0, 32, 45);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.minDistance = 8;
    controls.maxDistance = 160;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;

    const ambientLight = new THREE.AmbientLight(
      0xfff7ed,
      1.8
    );

    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(
      0xffedd5,
      3.5,
      300,
      0.5
    );

    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const dirLight = new THREE.DirectionalLight(
      0xffedd5,
      1.2
    );

    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    const solarSystemGroup = new THREE.Group();
    scene.add(solarSystemGroup);

    const sunGeom = new THREE.SphereGeometry(4.2, 48, 48);

    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    const sunMesh = new THREE.Mesh(
      sunGeom,
      sunMat
    );

    solarSystemGroup.add(sunMesh);

    const sunGlowGeom = new THREE.SphereGeometry(
      4.8,
      32,
      32
    );

    const sunGlowMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.75,
    });

    const sunGlow = new THREE.Mesh(
      sunGlowGeom,
      sunGlowMat
    );

    solarSystemGroup.add(sunGlow);

    const sunOuterGeom = new THREE.SphereGeometry(
      5.8,
      32,
      32
    );

    const sunOuterMat = new THREE.MeshBasicMaterial({
      color: 0xfb923c,
      transparent: true,
      opacity: 0.35,
    });

    const sunOuter = new THREE.Mesh(
      sunOuterGeom,
      sunOuterMat
    );

    solarSystemGroup.add(sunOuter);

    const planetsData = [
      {
        name: 'Mercury',
        size: 0.6,
        dist: 7,
        color: 0x9a3412,
        speed: 1.6,
      },
      {
        name: 'Venus',
        size: 1,
        dist: 10.5,
        color: 0xea580c,
        speed: 1.15,
      },
      {
        name: 'Earth',
        size: 1.15,
        dist: 15,
        color: 0x0284c7,
        speed: 0.85,
        hasMoon: true,
      },
      {
        name: 'Mars',
        size: 0.8,
        dist: 19.5,
        color: 0xc2410c,
        speed: 0.65,
      },
      {
        name: 'Jupiter',
        size: 2.3,
        dist: 26,
        color: 0xd97706,
        speed: 0.38,
      },
      {
        name: 'Saturn',
        size: 1.9,
        dist: 33,
        color: 0xb45309,
        speed: 0.28,
        hasRing: true,
      },
      {
        name: 'Uranus',
        size: 1.4,
        dist: 40,
        color: 0x0d9488,
        speed: 0.18,
      },
      {
        name: 'Neptune',
        size: 1.3,
        dist: 46,
        color: 0x2563eb,
        speed: 0.12,
      },
    ];

    const planetPivots: {
      pivot: THREE.Group;
      speed: number;
      mesh: THREE.Mesh;
    }[] = [];

    planetsData.forEach((planet) => {
      const orbitGeom = new THREE.RingGeometry(
        planet.dist - 0.05,
        planet.dist + 0.05,
        96
      );

      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0xffedd5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });

      const orbitMesh = new THREE.Mesh(
        orbitGeom,
        orbitMat
      );

      orbitMesh.rotation.x = Math.PI / 2;
      solarSystemGroup.add(orbitMesh);

      const pivot = new THREE.Group();
      pivot.rotation.y = Math.random() * Math.PI * 2;
      solarSystemGroup.add(pivot);

      const geom = new THREE.SphereGeometry(
        planet.size,
        32,
        32
      );

      const mat = new THREE.MeshStandardMaterial({
        color: planet.color,
        roughness: 0.5,
        metalness: 0.1,
      });

      const mesh = new THREE.Mesh(geom, mat);

      mesh.position.set(
        planet.dist,
        0,
        0
      );

      pivot.add(mesh);

      if (planet.hasMoon) {
        const moonGeom = new THREE.SphereGeometry(
          0.28,
          16,
          16
        );

        const moonMat =
          new THREE.MeshStandardMaterial({
            color: 0xffedd5,
          });

        const moonMesh = new THREE.Mesh(
          moonGeom,
          moonMat
        );

        moonMesh.position.set(1.8, 0, 0);
        mesh.add(moonMesh);
      }

      if (planet.hasRing) {
        const ringGeom = new THREE.RingGeometry(
          planet.size * 1.4,
          planet.size * 2.3,
          48
        );

        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xfef08a,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });

        const ringMesh = new THREE.Mesh(
          ringGeom,
          ringMat
        );

        ringMesh.rotation.x = Math.PI / 2.4;
        mesh.add(ringMesh);
      }

      planetPivots.push({
        pivot,
        speed: planet.speed,
        mesh,
      });
    });

    const starCount = 350;
    const starGeom = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);

    for (
      let i = 0;
      i < starCount * 3;
      i += 3
    ) {
      starPos[i] =
        (Math.random() - 0.5) * 160;

      starPos[i + 1] =
        (Math.random() - 0.5) * 160;

      starPos[i + 2] =
        (Math.random() - 0.5) * 160;
    }

    starGeom.setAttribute(
      'position',
      new THREE.BufferAttribute(
        starPos,
        3
      )
    );

    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      transparent: true,
      opacity: 0.65,
    });

    const starPoints = new THREE.Points(
      starGeom,
      starMat
    );

    scene.add(starPoints);

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener(
      'resize',
      handleResize
    );

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      planetPivots.forEach((planet) => {
        planet.pivot.rotation.y +=
          delta * planet.speed * 0.25;

        planet.mesh.rotation.y +=
          delta * 0.8;
      });

      const time = clock.getElapsedTime();

      const scale =
        1 + Math.sin(time * 2) * 0.04;

      sunOuter.scale.set(
        scale,
        scale,
        scale
      );

      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);

      window.removeEventListener(
        'resize',
        handleResize
      );

      controls.dispose();
      renderer.dispose();

      if (
        container.contains(
          renderer.domElement
        )
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#9a3412] select-none">
      <div
        ref={mountRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 text-center pointer-events-none">
        <div className="flex flex-col items-center">
          <span className="font-serif text-5xl font-medium tracking-tight text-[#ece7dc] drop-shadow-lg sm:text-7xl md:text-8xl">
            Starbound
          </span>

          <p className="mt-4 max-w-lg text-base text-amber-100/90 drop-shadow-md sm:text-xl">
            Real robots. Real worlds. Still out there,
            still amazing.
          </p>

          <button
            onClick={onStart}
            className="pointer-events-auto mt-8 rounded-full bg-[#c1440e] px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#a9360b] active:scale-95 sm:px-10 sm:py-4 sm:text-lg"
          >
            Start Story
          </button>
        </div>

      </div>
    </div>
  );
};