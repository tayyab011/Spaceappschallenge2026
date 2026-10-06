import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';  
import * as THREE from 'three';  
import { OrbitCharacter } from './OrbitCharacter';  
import { SpaceGlossaryWord } from './SpaceGlossaryWord';  
import { playSceneMusic, playPageTurn } from '../utils/sound';  
import { speakDialogue, getSpeechEnabled, getAutoSpeakEnabled, stopSpeaking } from '../utils/speech';  
  
interface Page1Props {  
  autoSpeak?: boolean;  
}  
  
export const Page1SolarSystem: React.FC<Page1Props> = ({ autoSpeak = true }) => {  
  const containerRef = useRef<HTMLDivElement | null>(null);  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);  
  const [activeBeat, setActiveBeat] = useState(0);  
  const scrollTimeoutRef = useRef<number | null>(null);  
  const hasSpokenFirstRef = useRef(false);  
  
  const beats = useMemo(() => [  
    {  
      pageNumber: 1,  
      badge: "Prologue · Galactic Scale",  
      layout: 'right',   
      speaker: "Orbit",  
      title: "How Big is Space?",  
      leadText: "Hey explorer! How BIG is space?",
      bodyComponent: (  
        <span>  
          There are billions of stars, planets, and galaxies! Light from the nearest star still takes over four{' '}  
          <SpaceGlossaryWord termKey="light_year" displayText="light-years" /> to reach Earth.  
        </span>  
      ),  
      speechText: "Hey explorer! How big is space? There are billions of stars out there!",
      fact: "The universe has more than 100 billion galaxies. Each has billions of stars!",
      cameraPos: new THREE.Vector3(0, 85, 130),  
      cameraLook: new THREE.Vector3(0, 0, 0),  
    },  
    {  
      pageNumber: 2,  
      badge: "Prologue · Extreme Worlds",  
      layout: 'left',  
      speaker: "Orbit",  
      title: "Why Humans Built Robots",  
      leadText: "Deep space is freezing cold. No air! So we built robot scouts!",
      bodyComponent: (  
        <span>  
          Beyond Earth's warm{' '}  
          <SpaceGlossaryWord termKey="atmosphere" displayText="atmosphere" />, space is colder than -200°C! So we sent brave little robots with solar wings and robot arms.  
        </span>  
      ),  
      speechText: "Deep space is freezing cold. There is no air. So we built robot scouts!",
      fact: "Robotic explorers carry cameras and thermometers, travelling for decades powered by the sun or warm atomic batteries.",  
      cameraPos: new THREE.Vector3(14, 45, 70),  
      cameraLook: new THREE.Vector3(0, 0, 0),  
    },  
    {  
      pageNumber: 3,  
      badge: "Prologue · Planetary Scouts",  
      layout: 'center',  
      speaker: "Orbit",  
      title: "Scouts of the Solar System",  
      leadText: "Some visited planets. Some landed on moons. Some flew farthest!",
      bodyComponent: (  
        <span>  
          They photographed storm clouds on Jupiter, tasted rust-red dust on Mars, and entered{' '}  
          <SpaceGlossaryWord termKey="orbit" displayText="orbit" /> around alien worlds!  
        </span>  
      ),  
      speechText: "Some visited planets. Some landed on moons. Some flew farthest!",
      fact: "Robot spacecraft have visited every planet in our Solar System!",  
      cameraPos: new THREE.Vector3(0, 20, 36),  
      cameraLook: new THREE.Vector3(0, 0, 0),  
    },  
    {  
      pageNumber: 4,  
      badge: "Prologue · The Door Opens",  
      layout: 'right',  
      speaker: "Orbit",  
      title: "Meeting the Explorers",  
      leadText: "Want to hear their stories? Let's visit Earth in 1958!",
      bodyComponent: (  
        <span>  
          Before giant rovers rolled across Mars, humans sent a tiny shiny beach ball into space. Let's meet Sputnik 1!  
        </span>  
      ),  
      speechText: "Want to hear their stories? Let's visit Earth in 1958 and meet our first explorer!",
      fact: "Scroll down to meet Pioneer 1, NASA's very first spacecraft.",
      cameraPos: new THREE.Vector3(8, 6, 12),  
      cameraLook: new THREE.Vector3(9.2, 0, 9.2),  
    },  
  ], []);  
  
  const stateRef = useRef<{  
    scene: THREE.Scene | null;  
    camera: THREE.PerspectiveCamera | null;  
    renderer: THREE.WebGLRenderer | null;  
    earthMesh: THREE.Mesh | null;  
    planets: Array<{ mesh: THREE.Group; dist: number; speed: number; angle: number }>;  
    currentCamPos: THREE.Vector3;  
    targetCamPos: THREE.Vector3;  
    currentLookAt: THREE.Vector3;  
    targetLookAt: THREE.Vector3;  
    animFrameId: number | null;  
  }>({  
    scene: null,  
    camera: null,  
    renderer: null,  
    earthMesh: null,  
    planets: [],  
    currentCamPos: new THREE.Vector3(0, 85, 130),  
    targetCamPos: new THREE.Vector3(0, 85, 130),  
    currentLookAt: new THREE.Vector3(0, 0, 0),  
    targetLookAt: new THREE.Vector3(0, 0, 0),  
    animFrameId: null,  
  });  
  
  useEffect(() => {  
    playSceneMusic('space');  
  }, []);  
  
  useEffect(() => {  
    const container = containerRef.current;  
    const canvas = canvasRef.current;  
    if (!container || !canvas) return;  
  
    const width = container.clientWidth || window.innerWidth;  
    const height = container.clientHeight || window.innerHeight;  
  
    const scene = new THREE.Scene();  
    
    scene.background = new THREE.Color(0xfff1dc);  
    scene.fog = new THREE.FogExp2(0xfff1dc, 0.004);  
    stateRef.current.scene = scene;  
  
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);  
    camera.position.copy(stateRef.current.currentCamPos);  
    camera.lookAt(stateRef.current.currentLookAt);  
    stateRef.current.camera = camera;  
  
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });  
    renderer.setSize(width, height);  
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));  
    stateRef.current.renderer = renderer;  
  
    const ambient = new THREE.AmbientLight(0xffffff, 1.6);  
    scene.add(ambient);  
  
    const sunLight = new THREE.PointLight(0xfef08a, 2.6, 180, 0.7);  
    sunLight.position.set(0, 0, 0);  
    scene.add(sunLight);  
  
    const sunGeo = new THREE.SphereGeometry(3.6, 32, 32);  
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });  
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);  
    scene.add(sunMesh);  
  
    const starCount = 600;  
    const starPositions = new Float32Array(starCount * 3);  
    const starColors = new Float32Array(starCount * 3);  
    for (let i = 0; i < starCount; i++) {  
      const radius = 60 + Math.random() * 150;  
      const theta = Math.random() * Math.PI * 2;  
      const phi = Math.acos(Math.random() * 2 - 1);  
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);  
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);  
      starPositions[i * 3 + 2] = radius * Math.cos(phi);  
  
    
      starColors[i * 3] = 0.95;  
      starColors[i * 3 + 1] = 0.75;  
      starColors[i * 3 + 2] = 0.4;  
    }  
    const starGeo = new THREE.BufferGeometry();  
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));  
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));  
    const starMat = new THREE.PointsMaterial({ size: 1.6, vertexColors: true, transparent: true, opacity: 0.5 });  
    const starPoints = new THREE.Points(starGeo, starMat);  
    scene.add(starPoints);  
  
    const planetDefs = [  
      { name: 'Mercury', color: 0xd97706, size: 0.7, dist: 7, speed: 0.024 },  
      { name: 'Venus', color: 0xfbbf24, size: 1.1, dist: 10, speed: 0.017 },  
      { name: 'Earth', color: 0x38bdf8, size: 1.25, dist: 13, speed: 0.012, isEarth: true },  
      { name: 'Mars', color: 0xf97316, size: 0.85, dist: 17, speed: 0.009 },  
      { name: 'Jupiter', color: 0xfde047, size: 2.5, dist: 24, speed: 0.004 },  
      { name: 'Saturn', color: 0xfcd34d, size: 2.1, dist: 31, speed: 0.003, ring: true },  
    ];  
  
    planetDefs.forEach((p) => {  
      const group = new THREE.Group();  
      const pGeo = new THREE.SphereGeometry(p.size, 28, 28);  
      const pMat = new THREE.MeshStandardMaterial({  
        color: p.color,  
        roughness: 0.6,  
        metalness: 0.1,  
      });  
      const pMesh = new THREE.Mesh(pGeo, pMat);  
      group.add(pMesh);  
  
      if (p.isEarth) {  
        stateRef.current.earthMesh = pMesh;  
        const moonGeo = new THREE.SphereGeometry(0.3, 16, 16);  
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });  
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);  
        moonMesh.position.set(2.2, 0.4, 0);  
        group.add(moonMesh);  
      }  
  
      if (p.ring) {  
        const ringGeo = new THREE.RingGeometry(p.size * 1.3, p.size * 2.1, 32);  
        const ringMat = new THREE.MeshBasicMaterial({  
          color: 0xfef08a,  
          side: THREE.DoubleSide,  
          transparent: true,  
          opacity: 0.75,  
        });  
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);  
        ringMesh.rotation.x = Math.PI / 2.5;  
        group.add(ringMesh);  
      }  
  
      const orbitGeo = new THREE.BufferGeometry();  
      const segments = 64;  
      const pts = [];  
      for (let s = 0; s <= segments; s++) {  
        const theta = (s / segments) * Math.PI * 2;  
        pts.push(new THREE.Vector3(Math.cos(theta) * p.dist, 0, Math.sin(theta) * p.dist));  
      }  
      orbitGeo.setFromPoints(pts);  
      const orbitMat = new THREE.LineBasicMaterial({ color: 0xd97706, transparent: true, opacity: 0.25 });  
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);  
      scene.add(orbitLine);  
  
      scene.add(group);  
      stateRef.current.planets.push({  
        mesh: group,  
        dist: p.dist,  
        speed: p.speed,  
        angle: Math.random() * Math.PI * 2,  
      });  
    });  
  
    let lastTime = performance.now();  
    const animate = () => {  
      const now = performance.now();  
      const delta = (now - lastTime) / 1000;  
      lastTime = now;  
  
      sunMesh.rotation.y += 0.003;  
      starPoints.rotation.y += 0.0003;  
  
      stateRef.current.planets.forEach((p) => {  
        p.angle += p.speed * delta * 1.5;  
        p.mesh.position.x = Math.cos(p.angle) * p.dist;  
        p.mesh.position.z = Math.sin(p.angle) * p.dist;  
        p.mesh.rotation.y += 0.01;  
      });  
  
      stateRef.current.currentCamPos.lerp(stateRef.current.targetCamPos, 0.04);  
      camera.position.copy(stateRef.current.currentCamPos);  
  
      stateRef.current.currentLookAt.lerp(stateRef.current.targetLookAt, 0.04);  
      camera.lookAt(stateRef.current.currentLookAt);  
  
      renderer.render(scene, camera);  
      stateRef.current.animFrameId = requestAnimationFrame(animate);  
    };  
    animate();  
  
    const handleResize = () => {  
      if (!container || !camera || !renderer) return;  
      const w = container.clientWidth || window.innerWidth;  
      const h = container.clientHeight || window.innerHeight;  
      camera.aspect = w / h;  
      camera.updateProjectionMatrix();  
      renderer.setSize(w, h);  
    };  
    window.addEventListener('resize', handleResize);  
  
    return () => {  
      window.removeEventListener('resize', handleResize);  
      if (stateRef.current.animFrameId) {  
        cancelAnimationFrame(stateRef.current.animFrameId);  
      }  
      renderer.dispose();  
    };  
  }, []);  
  
  // Auto-voice switched on while already on a segment: narrate the current one now.
  const prevAutoSpeakRef = useRef(autoSpeak);
  useEffect(() => {
    if (prevAutoSpeakRef.current === autoSpeak) return;
    prevAutoSpeakRef.current = autoSpeak;
    if (autoSpeak && getAutoSpeakEnabled()) {
      const beat = beats[activeBeat];
      speakDialogue(beat.speaker, beat.speechText, { skipSoundCue: true });
    }
  }, [autoSpeak, beats, activeBeat]);

  const handleSpeakBeat = useCallback((beatIdx: number) => {  
    const beat = beats[beatIdx];  
    speakDialogue('orbit', beat.speechText, { skipSoundCue: false, manualTrigger: true });  
  }, [beats]);  
  
  useEffect(() => {  
    const triggerIntro = () => {  
      if (!hasSpokenFirstRef.current && autoSpeak && getAutoSpeakEnabled()) {  
        hasSpokenFirstRef.current = true;  
        speakDialogue('orbit', beats[0].speechText, { skipSoundCue: false });  
      }  
    };  
    window.addEventListener('click', triggerIntro, { once: true });  
    window.addEventListener('scroll', triggerIntro, { once: true });  
    window.addEventListener('touchstart', triggerIntro, { once: true });  
    return () => {  
      window.removeEventListener('click', triggerIntro);  
      window.removeEventListener('scroll', triggerIntro);  
      window.removeEventListener('touchstart', triggerIntro);  
    };  
  }, [autoSpeak, beats]);  
  
  useEffect(() => {  
    const handleScroll = () => {  
      const beatElements = document.querySelectorAll('.scene-1-beat');  
      if (beatElements.length === 0) return;  
  
      const vCenter = window.innerHeight * 0.45;  
      let closestIdx = 0;  
      let minDistance = Infinity;  
  
      beatElements.forEach((el, idx) => {  
        const rect = el.getBoundingClientRect();  
        const dist = Math.abs(rect.top + rect.height / 2 - vCenter);  
        if (dist < minDistance) {  
          minDistance = dist;  
          closestIdx = idx;  
        }  
      });  
  
      if (closestIdx !== activeBeat) {  
        setActiveBeat(closestIdx);  
        stopSpeaking(); // leaving a segment ends its narration immediately
        playPageTurn();  
        const beat = beats[closestIdx];  
        stateRef.current.targetCamPos.copy(beat.cameraPos);  
        stateRef.current.targetLookAt.copy(beat.cameraLook);  
  
        if (scrollTimeoutRef.current) {  
          window.clearTimeout(scrollTimeoutRef.current);  
        }  
        scrollTimeoutRef.current = window.setTimeout(() => {  
          if (autoSpeak && getAutoSpeakEnabled()) {  
            speakDialogue('orbit', beat.speechText, { skipSoundCue: true });  
          }  
        }, 220);  
      }  
    };  
  
    window.addEventListener('scroll', handleScroll, { passive: true });  
    return () => {  
      window.removeEventListener('scroll', handleScroll);  
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);  
    };  
  }, [activeBeat, beats, autoSpeak]);  
  
  return (  
    <section  
      id="chapter-1"  
      ref={containerRef}  
      className="relative w-full text-amber-900 overflow-hidden bg-[#fff1dc]"  
    >  
      <div className="sticky top-0 left-0 w-full h-screen z-0 pointer-events-none">  
        <canvas ref={canvasRef} className="w-full h-full block" />  
        
      </div>  
  
      <div className="relative z-10 -mt-[100vh] w-full flex flex-col items-center">  
        <div className="pt-24 pb-8 px-4 text-center max-w-4xl mx-auto">  
          
          <h1 className="text-3xl sm:text-6xl font-black text-amber-950 mt-3 tracking-tight drop-shadow-sm">  
            How Big is the Universe?  
          </h1>  
          <p className="text-xs sm:text-sm text-amber-700/90 font-mono mt-2">  
            Scroll down to journey from distant stars down toward Earth with Orbit  
          </p>  
        </div>  
  
        {beats.map((beat, idx) => {  
          const isActive = activeBeat === idx;  
          const isCenter = beat.layout === 'center';  
          const isRight = beat.layout === 'right';  
  
          return (  
            <div  
              key={idx}  
              className={`scene-1-beat w-full min-h-[82vh] px-4 sm:px-8 lg:px-12 py-8 flex items-center justify-center transition-all duration-500 ${  
                isActive ? 'opacity-100 scale-100' : 'opacity-65 scale-[0.98]'  
              }`}  
            >  
              <div  
                className={`w-full max-w-5xl flex gap-8 lg:gap-14 items-center ${  
                  isCenter  
                    ? 'flex-col text-center justify-center'  
                    : isRight  
                    ? 'flex-col lg:flex-row-reverse justify-between'  
                    : 'flex-col lg:flex-row justify-between'  
                }`}  
              >  
                <div className={`flex flex-col items-center ${isCenter ? 'w-full' : 'w-full lg:w-5/12'}`}>  
                  <OrbitCharacter  
                    mood={idx === 3 ? 'excited' : 'happy'}  
                    size={isCenter ? 'lg' : 'md'}  
                    isSpeaking={isActive}  
                    speechBubble={beat.leadText}  
                    onClick={() => handleSpeakBeat(idx)}  
                  />  
                   
                </div>  
  
                <div className={`flex flex-col justify-center ${isCenter ? 'w-full max-w-3xl items-center' : 'w-full lg:w-7/12 max-w-2xl'}`}>  
                    
  
                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-amber-950 tracking-tight drop-shadow-sm mb-3">  
                    {beat.title}  
                  </h2>  
  
                  
  
                  <div className="text-lg sm:text-xl lg:text-2xl font-medium text-amber-900/95 leading-relaxed mb-5">  
                    {beat.bodyComponent}  
                  </div>  
  
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-amber-400/50 shadow-lg text-left">  
                    <p className="text-sm sm:text-base lg:text-lg font-semibold text-amber-800 leading-snug">  
                      🔭 <strong className="text-amber-950 font-bold">NASA Fact:</strong> {beat.fact}  
                    </p>  
                  </div>  
                </div>  
              </div>  
            </div>  
          );  
        })}  
      </div>  
    </section>  
  );  
};  
  
export default Page1SolarSystem;