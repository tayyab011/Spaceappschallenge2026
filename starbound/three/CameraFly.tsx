import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraFlyProps {
  targetPosition: [number, number, number] | React.MutableRefObject<[number, number, number]>;
  duration?: number;
  onComplete: () => void;
  controlsRef?: React.MutableRefObject<any>;
}

export const CameraFly: React.FC<CameraFlyProps> = ({
  targetPosition,
  duration = 2.5,
  onComplete,
  controlsRef,
}) => {
  const { camera } = useThree();
  const startTimeRef = useRef<number | null>(null);
  const startPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const startTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const finalCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const targetVecRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const hasFinishedRef = useRef(false);

  useFrame((state) => {
    if (hasFinishedRef.current) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
      startPosRef.current.copy(camera.position);

      const pos = Array.isArray(targetPosition) ? targetPosition : targetPosition.current;
      targetVecRef.current.set(...pos);
      finalCamPosRef.current.copy(targetVecRef.current).add(new THREE.Vector3(0.3, 0.4, 1.2));

      if (controlsRef?.current) {
        startTargetRef.current.copy(controlsRef.current.target);
      }
    }

    const elapsed = state.clock.getElapsedTime() - startTimeRef.current;
    const progress = Math.min(1, elapsed / duration);

   
    const ease =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    camera.position.lerpVectors(startPosRef.current, finalCamPosRef.current, ease);

    if (controlsRef?.current) {
      controlsRef.current.target.lerpVectors(startTargetRef.current, targetVecRef.current, ease);
      controlsRef.current.update();
    }

    if (progress >= 1 && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      
      setTimeout(() => {
        onComplete();
      }, 60);
    }
  });

  return null;
};
