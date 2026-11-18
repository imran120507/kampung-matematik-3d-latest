import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Outlines } from '@react-three/drei';
import * as THREE from 'three';
import { getS } from '../store.js';

// ---------- cartoon material (4-step toon ramp) ----------
const ramp = new THREE.DataTexture(new Uint8Array([95, 155, 215, 255]), 4, 1, THREE.RedFormat);
ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true;
export const Toon = ({ color = '#fff', ...p }) => <meshToonMaterial color={color} gradientMap={ramp} {...p} />;
export const OL = ({ t = 0.035 }) => <Outlines thickness={t} color="#3b2a20" />;
export const rng = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
export const sway = (ref, t, amp, speed, phase = 0) => { if (ref.current && !getS().rm) ref.current.rotation.z = Math.sin(t * speed + phase) * amp; };

// ---------- instancing helper ----------
export function Inst({ geo, items, color = '#fff', cast = false, mat }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();
    items.forEach((it, i) => {
      q.setFromEuler(e.set(0, it.ry || 0, 0)); p.set(...it.p);
      const k = it.s ?? 1; Array.isArray(k) ? s.set(...k) : s.set(k, k, k);
      ref.current.setMatrixAt(i, m.compose(p, q, s));
      if (it.c) ref.current.setColorAt(i, c.set(it.c));
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [items]);
  return <instancedMesh ref={ref} args={[undefined, undefined, items.length]} castShadow={cast} frustumCulled={false}>{geo}{mat || <Toon color={color} />}</instancedMesh>;
}

// ---------- clickable hotspot with floating marker ----------
export function Hotspot({ id, position, label, onPick, height = 3, children }) {
  const [h, setH] = useState(false);
  const m = useRef();
  useFrame(({ clock }) => {
    if (!m.current) return;
    const rm = getS().rm;
    m.current.position.y = height + (rm ? 0 : Math.sin(clock.elapsedTime * 2.2 + position[0]) * 0.22);
    m.current.scale.setScalar(THREE.MathUtils.lerp(m.current.scale.x, h ? 1.35 : 1, 0.2));
  });
  return (
    <group position={position}
      onClick={(e) => { e.stopPropagation(); onPick(id); }}
      onPointerOver={(e) => { e.stopPropagation(); setH(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setH(false); document.body.style.cursor = ''; }}>
      {children}
      <group ref={m} position={[0, height, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.45, 0.9, 4]} /><meshToonMaterial color={h ? '#ffe066' : '#ffb703'} emissive="#ff9f1c" emissiveIntensity={0.45} /><OL t={0.03} /></mesh>
        <Html center distanceFactor={12} position={[0, 0.95, 0]} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}><div className="pin">{label}</div></Html>
      </group>
    </group>
  );
}

// ---------- Malay stilt house (rumah kampung) ----------
const tri = (() => { const s = new THREE.Shape(); s.moveTo(-1.5, 0); s.lineTo(1.5, 0); s.lineTo(0, 1.19); s.closePath(); return s; })();
export function House({ position, ry = 0, wall = '#f6dba6', roof = '#b8553a', trim = '#7a4a2b' }) {
  return (
    <group position={position} rotation={[0, ry, 0]}>
      {[[-2, -1.4], [2, -1.4], [-2, 1.4], [2, 1.4], [0, -1.4], [0, 1.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.72, z]} castShadow><cylinderGeometry args={[0.14, 0.17, 1.45, 8]} /><Toon color={trim} /></mesh>))}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow><boxGeometry args={[4.9, 0.2, 3.5]} /><Toon color="#9a6538" /></mesh>
      <mesh position={[0, 2.6, 0]} castShadow receiveShadow><boxGeometry args={[4.2, 2, 3]} /><Toon color={wall} /><OL /></mesh>
      <mesh position={[0, 2.25, 1.53]}><boxGeometry args={[0.95, 1.5, 0.08]} /><Toon color={trim} /></mesh>
      {[-1.45, 1.45].map((x) => (<group key={x} position={[x, 2.8, 1.52]}>
        <mesh><boxGeometry args={[0.8, 0.8, 0.06]} /><Toon color="#a9dcf5" /></mesh>
        <mesh position={[-0.52, 0, 0.04]}><boxGeometry args={[0.22, 0.85, 0.05]} /><Toon color="#2f9e8f" /></mesh>
        <mesh position={[0.52, 0, 0.04]}><boxGeometry args={[0.22, 0.85, 0.05]} /><Toon color="#2f9e8f" /></mesh></group>))}
      {[0, 1, 2].map((i) => (<mesh key={i} position={[0, 0.3 + i * 0.4, 2.1 + (2 - i) * 0.4]} castShadow><boxGeometry args={[1.2, 0.14, 0.4]} /><Toon color="#b98350" /></mesh>))}
      {[1, -1].map((s) => (<mesh key={s} position={[0, 4.17, s * 0.95]} rotation={[s * 0.56, 0, 0]} castShadow><boxGeometry args={[4.9, 0.16, 2.28]} /><Toon color={roof} /><OL t={0.03} /></mesh>))}
      {[-2.1, 2.1].map((x) => (<mesh key={x} position={[x, 3.6, 0]} rotation={[0, Math.PI / 2, 0]}><shapeGeometry args={[tri]} /><Toon color={wall} side={THREE.DoubleSide} /></mesh>))}
    </group>
  );
}

// ---------- coconut palm ----------
export function Palm({ position, h = 6, lean = 0.12, seed = 0 }) {
  const f = useRef();
  const top = [-Math.sin(lean) * h, Math.cos(lean) * h];
  useFrame(({ clock }) => { if (f.current && !getS().rm) { f.current.rotation.z = Math.sin(clock.elapsedTime * 0.9 + seed) * 0.04; f.current.rotation.x = Math.cos(clock.elapsedTime * 0.7 + seed) * 0.03; } });
  return (
    <group position={position}>
      <group rotation={[0, 0, lean]}><mesh position={[0, h / 2, 0]} castShadow><cylinderGeometry args={[0.2, 0.34, h, 8]} /><Toon color="#a9784a" /></mesh></group>
      <group ref={f} position={[top[0], top[1], 0]}>
        {Array.from({ length: 8 }, (_, i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 4, 0]}>
            <group rotation={[0.55 + (i % 2) * 0.2, 0, 0]}><mesh position={[0, 0, 1.5]} scale={[0.32, 0.05, 1.7]} castShadow><sphereGeometry args={[1, 8, 6]} /><Toon color={i % 2 ? '#3f9b49' : '#4cae52'} /></mesh></group>
          </group>))}
        {[[0.25, -0.3, 0.2], [-0.2, -0.35, -0.2], [0.05, -0.4, 0.3]].map((p, i) => (<mesh key={i} position={p}><sphereGeometry args={[0.22, 8, 8]} /><Toon color="#7a5230" /></mesh>))}
      </group>
    </group>
  );
}

// ---------- round fruit tree ----------
export function Tree({ position, s = 1, seed = 0, color = '#4fb04f' }) {
  const g = useRef();
  useFrame(({ clock }) => sway(g, clock.elapsedTime, 0.025, 1.1, seed));
  return (
    <group position={position} scale={s}>
      <mesh position={[0, 1.2, 0]} castShadow><cylinderGeometry args={[0.28, 0.4, 2.4, 8]} /><Toon color="#8b5a33" /></mesh>
      <group ref={g} position={[0, 2.4, 0]}>
        {[[0, 1, 0, 1.7], [-1, 0.5, 0.3, 1.2], [1, 0.6, -0.2, 1.3]].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} castShadow><icosahedronGeometry args={[r, 1]} /><Toon color={i ? '#5fc05a' : color} /></mesh>))}
      </group>
    </group>
  );
}

// ---------- market stall (gerai) ----------
export function Stall({ position, ry = 0, color = '#e0453a', goods = ['#d83a3a', '#ffcf3f'] }) {
  return (
    <group position={position} rotation={[0, ry, 0]}>
      {[[-1.5, -0.8], [1.5, -0.8], [-1.5, 0.9], [1.5, 0.9]].map(([x, z], i) => (<mesh key={i} position={[x, 1.2, z]} castShadow><cylinderGeometry args={[0.07, 0.07, i < 2 ? 2.6 : 2.2, 6]} /><Toon color="#8a5a35" /></mesh>))}
      <mesh position={[0, 0.5, 0.6]} castShadow receiveShadow><boxGeometry args={[3.2, 1, 1]} /><Toon color="#c98d55" /><OL t={0.03} /></mesh>
      <group position={[0, 2.5, 0.05]} rotation={[0.22, 0, 0]}>
        {Array.from({ length: 8 }, (_, i) => (<mesh key={i} position={[-1.65 + i * 0.47, 0, 0]} castShadow><boxGeometry args={[0.47, 0.08, 2.1]} /><Toon color={i % 2 ? '#fff6e0' : color} /></mesh>))}
      </group>
      {Array.from({ length: 7 }, (_, i) => (<mesh key={i} position={[-1.2 + (i % 4) * 0.8, 1.17, 0.45 + Math.floor(i / 4) * 0.35]} castShadow><sphereGeometry args={[0.24, 10, 8]} /><Toon color={goods[i % 2]} /></mesh>))}
    </group>
  );
}

// ---------- festival bunting ----------
const FLAGS = ['#ff5d5d', '#ffd23f', '#3ec9a7', '#4aa3ff', '#ff9f43'];
export function Bunting({ from, to, n = 10, sag = 0.7 }) {
  const g = useRef();
  const flags = useMemo(() => Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n, p = new THREE.Vector3(...from).lerp(new THREE.Vector3(...to), t);
    p.y -= Math.sin(t * Math.PI) * sag; return { p, c: FLAGS[i % 5] };
  }), [from, to, n, sag]);
  const ang = Math.atan2(to[0] - from[0], to[2] - from[2]);
  useFrame(({ clock }) => { if (g.current && !getS().rm) g.current.children.forEach((c, i) => { c.rotation.x = Math.sin(clock.elapsedTime * 2.2 + i) * 0.2; }); });
  return (
    <group ref={g}>
      {flags.map((f, i) => (<group key={i} position={f.p} rotation={[0, ang + Math.PI / 2, 0]}><mesh position={[0, -0.25, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.26, 0.52, 3]} /><Toon color={f.c} /></mesh></group>))}
    </group>
  );
}

// ---------- cloud ----------
export function Cloud({ position, speed = 1, s = 1, seed = 0 }) {
  const g = useRef();
  useFrame((_, dt) => { if (!g.current || getS().rm) return; g.current.position.x += dt * speed; if (g.current.position.x > 90) g.current.position.x = -90; });
  return (
    <group ref={g} position={position} scale={s}>
      {[[0, 0, 0, 3], [3, -0.3, 0.5, 2.4], [-3, -0.4, -0.3, 2.3], [1.4, 1.1, 0, 2.2]].map(([x, y, z, r], i) => (<mesh key={i} position={[x, y, z]} scale={[1, 0.65, 0.8]}><sphereGeometry args={[r, 12, 10]} /><meshBasicMaterial color="#ffffff" fog={false} /></mesh>))}
    </group>
  );
}

// ---------- butterfly ----------
export function Butterfly({ center, r = 2, speed = 0.6, phase = 0, color = '#ff8fab' }) {
  const g = useRef(), w1 = useRef(), w2 = useRef();
  useFrame(({ clock }) => {
    if (!g.current || getS().rm) return;
    const t = clock.elapsedTime * speed + phase;
    g.current.position.set(center[0] + Math.cos(t) * r, center[1] + Math.sin(t * 2.3) * 0.4, center[2] + Math.sin(t * 0.8) * r * 0.7);
    g.current.rotation.y = -t + Math.PI / 2;
    const f = Math.sin(clock.elapsedTime * 14 + phase) * 0.9; w1.current.rotation.z = f; w2.current.rotation.z = -f;
  });
  return (
    <group ref={g} position={center}>
      <mesh ref={w1} position={[0.1, 0, 0]}><planeGeometry args={[0.22, 0.16]} /><meshBasicMaterial color={color} side={THREE.DoubleSide} /></mesh>
      <mesh ref={w2} position={[-0.1, 0, 0]}><planeGeometry args={[0.22, 0.16]} /><meshBasicMaterial color={color} side={THREE.DoubleSide} /></mesh>
    </group>
  );
}

// ---------- canvas-text texture (no network fonts needed) ----------
export function textTexture(lines, w, h, bg, fg, sizes = [92, 64], border) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  if (border) { g.strokeStyle = border; g.lineWidth = 14; g.strokeRect(14, 14, w - 28, h - 28); }
  g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
  const gap = h / (lines.length + 1);
  lines.forEach((t, i) => { g.font = `800 ${sizes[i] || 56}px "Trebuchet MS","Segoe UI",system-ui,sans-serif`; g.fillText(t, w / 2, gap * (i + 1)); });
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; return tex;
}
