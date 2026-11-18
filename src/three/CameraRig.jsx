import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { VIEWS } from '../data.js';
import { getS } from '../store.js';

// Camera state lives in `base`; GSAP tweens it; useFrame applies it (+ tiny pointer parallax).
export default function CameraRig({ view, intro, onIntroDone }) {
  const { camera } = useThree();
  const base = useRef({ pos: new THREE.Vector3(-34, 28, 44), tgt: new THREE.Vector3(0, 2, 0) });
  const tgt = useRef(new THREE.Vector3());
  const done = useRef(onIntroDone); done.current = onIntroDone;

  useEffect(() => {
    const b = base.current, v = VIEWS[view], rm = getS().rm;
    const tl = gsap.timeline();
    if (intro === 'playing') {
      if (rm) { b.pos.set(...VIEWS.gate.pos); b.tgt.set(...VIEWS.gate.tgt); done.current(); return; }
      tl.to(b.pos, { x: 18, y: 12, z: 28, duration: 4.2, ease: 'power2.inOut' }, 0)
        .to(b.tgt, { x: 0, y: 2, z: 2, duration: 4.2, ease: 'power2.inOut' }, 0)
        .to(b.pos, { x: VIEWS.gate.pos[0], y: VIEWS.gate.pos[1], z: VIEWS.gate.pos[2], duration: 3.6, ease: 'power3.inOut' })
        .to(b.tgt, { x: VIEWS.gate.tgt[0], y: VIEWS.gate.tgt[1], z: VIEWS.gate.tgt[2], duration: 3.6, ease: 'power3.inOut' }, '<')
        .call(() => done.current());
    } else if (rm) { b.pos.set(...v.pos); b.tgt.set(...v.tgt); }
    else {
      tl.to(b.pos, { x: v.pos[0], y: v.pos[1], z: v.pos[2], duration: 2.2, ease: 'power3.inOut' }, 0)
        .to(b.tgt, { x: v.tgt[0], y: v.tgt[1], z: v.tgt[2], duration: 2.2, ease: 'power3.inOut' }, 0);
    }
    return () => { tl.kill(); };
  }, [view, intro]);

  useFrame(({ pointer }) => {
    const b = base.current, rm = getS().rm;
    camera.position.set(b.pos.x + (rm ? 0 : pointer.x * 0.5), b.pos.y + (rm ? 0 : pointer.y * 0.25), b.pos.z);
    camera.lookAt(tgt.current.copy(b.tgt));
  });
  return null;
}
