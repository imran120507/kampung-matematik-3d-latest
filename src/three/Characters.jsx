import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useAnimations, useGLTF } from '@react-three/drei';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { Toon, OL } from './parts.jsx';
import { Boundary } from '../Boundary.jsx';
import { BASE, CHARS } from '../data.js';
import { getS } from '../store.js';

// ---- Real asset path: GLB + animation clips (Idle / Wave / Talk) ----
function GLBChar({ url, speaking }) {
  const { scene, animations } = useGLTF(url);
  const model = useMemo(() => { const c = clone(scene); c.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return c; }, [scene]);
  const { actions, names } = useAnimations(animations, model);
  const find = (re) => names.find((n) => re.test(n));
  useEffect(() => {
    const a = actions[find(/idle|stand/i) || names[0]];
    if (!a) return;
    a.reset().fadeIn(0.3).play(); if (getS().rm) a.paused = true;
    return () => a.fadeOut(0.2);
  }, [actions, names]);
  useEffect(() => {
    const a = actions[find(/talk|speak/i)];
    if (!a || getS().rm) return;
    if (speaking) a.reset().fadeIn(0.2).play(); else a.fadeOut(0.3);
    return () => a.fadeOut(0.2);
  }, [speaking, actions, names]);
  return <primitive object={model} />;
}

// ---- TEMPORARY placeholder (not a finished character model) ----
const SPEC = {
  aiman: { s: 0.95, skin: '#e0a878', shirt: '#1FA39A', bottom: '#1F3A6B', extra: '#F28C28', hair: '#1c1c24' },
  mia: { s: 0.92, skin: '#e8b48a', shirt: '#F5D76E', bottom: '#3E9B4F', extra: '#e0453a', hair: '#1c1c24' },
  tok: { s: 1.12, skin: '#d9a070', shirt: '#F6EBC8', bottom: '#F6EBC8', extra: '#2F7D4A', hair: '#cfcfcf' }
};
function Placeholder({ id, speaking }) {
  const c = SPEC[id], head = useRef(), arm = useRef(), body = useRef();
  useFrame(({ clock }) => {
    if (getS().rm) return; const t = clock.elapsedTime;
    body.current.position.y = Math.sin(t * 2 + c.s * 5) * 0.015;
    head.current.rotation.x = speaking ? Math.sin(t * 9) * 0.08 : 0;
    arm.current.rotation.z = -0.25 - (speaking ? 0.6 + Math.sin(t * 6) * 0.3 : 0);
  });
  return (
    <group scale={c.s} ref={body}>
      {[-0.11, 0.11].map((x) => (<group key={x}><mesh position={[x, 0.3, 0]} castShadow><cylinderGeometry args={[0.07, 0.08, 0.5, 8]} /><Toon color={c.skin} /></mesh>
        <mesh position={[x, 0.32, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.34, 8]} /><Toon color={c.bottom} /></mesh>
        <mesh position={[x, 0.04, 0.05]}><sphereGeometry args={[0.1, 8, 6]} /><Toon color="#7b4a2a" /></mesh></group>))}
      <mesh position={[0, 0.82, 0]} castShadow><capsuleGeometry args={[0.24, 0.42, 6, 12]} /><Toon color={c.shirt} /><OL t={0.02} /></mesh>
      {id === 'tok' && <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.27, 0.27, 0.2, 12]} /><Toon color={c.extra} /></mesh>}
      {id === 'aiman' && [-0.15, 0.15].map((x) => <mesh key={x} position={[x, 0.85, 0.2]}><boxGeometry args={[0.1, 0.45, 0.05]} /><Toon color={c.extra} /></mesh>)}
      {id === 'mia' && [-0.12, 0.12].map((x) => <mesh key={x} position={[x, 0.85, 0.22]}><boxGeometry args={[0.06, 0.4, 0.04]} /><Toon color={c.bottom} /></mesh>)}
      <mesh position={[-0.33, 0.85, 0]} rotation={[0, 0, 0.25]}><capsuleGeometry args={[0.07, 0.35, 4, 8]} /><Toon color={c.shirt} /></mesh>
      <group ref={arm} position={[0.3, 1.05, 0]}><mesh position={[0.05, -0.2, 0]}><capsuleGeometry args={[0.07, 0.35, 4, 8]} /><Toon color={c.shirt} /></mesh><mesh position={[0.07, -0.47, 0]}><sphereGeometry args={[0.07, 8, 6]} /><Toon color={c.skin} /></mesh></group>
      <group ref={head} position={[0, 1.42, 0]}>
        <mesh castShadow><sphereGeometry args={[0.31, 20, 16]} /><Toon color={c.skin} /><OL t={0.025} /></mesh>
        {[-0.11, 0.11].map((x) => (<group key={x}><mesh position={[x, 0.03, 0.27]}><sphereGeometry args={[0.045, 8, 8]} /><meshBasicMaterial color="#222" /></mesh><mesh position={[x * 1.6, -0.08, 0.25]}><sphereGeometry args={[0.05, 8, 8]} /><meshBasicMaterial color="#ff9aa2" /></mesh></group>))}
        <mesh position={[0, -0.1, 0.29]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.06, 0.012, 6, 12, Math.PI]} /><meshBasicMaterial color="#7a2a2a" /></mesh>
        {id !== 'tok' && <mesh position={[0, 0.05, -0.02]} rotation={[-0.15, 0, 0]}><sphereGeometry args={[0.33, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} /><Toon color={c.hair} /></mesh>}
        {id === 'mia' && [-0.33, 0.33].map((x) => <mesh key={x} position={[x, -0.15, -0.05]}><sphereGeometry args={[0.1, 8, 8]} /><Toon color={c.hair} /></mesh>)}
        {id === 'tok' && (<>
          <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.2, 0.22, 0.2, 12]} /><Toon color="#4a2c16" /></mesh>
          <mesh position={[0, -0.1, 0.3]}><boxGeometry args={[0.22, 0.04, 0.04]} /><Toon color="#b5b5b5" /></mesh>
          {[-0.11, 0.11].map((x) => <mesh key={x} position={[x, 0.04, 0.28]}><torusGeometry args={[0.07, 0.012, 6, 14]} /><meshBasicMaterial color="#333" /></mesh>)}</>)}
      </group>
    </group>
  );
}

export function Character({ id, position, ry = 0, hasGLB, speaking, onPick }) {
  const ph = <Placeholder id={id} speaking={speaking} />;
  return (
    <group position={position} rotation={[0, ry, 0]}
      onClick={(e) => { e.stopPropagation(); onPick(id); }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = ''; }}>
      {hasGLB
        ? <Boundary fallback={ph}><Suspense fallback={ph}><GLBChar url={BASE + CHARS[id].glb} speaking={speaking} /></Suspense></Boundary>
        : ph}
      <Html center position={[0, 2.35 * (SPEC[id].s), 0]} distanceFactor={10} style={{ pointerEvents: 'none' }}><div className="pin small">{CHARS[id].name}</div></Html>
    </group>
  );
}
