import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Inst, Toon, OL, House, Palm, Tree, Stall, Bunting, Cloud, Butterfly, Hotspot, rng, sway, textTexture } from './parts.jsx';
import { getS } from '../store.js';

export const groundH = (x, z) => {
  const d = Math.hypot(x, z); let k = Math.min(1, Math.max(0, (d - 42) / 26)); k = k * k * (3 - 2 * k);
  return k * (2 + Math.sin(x * 0.16) * 3 + Math.cos(z * 0.13) * 3 + (d - 42) * 0.22);
};

function Terrain({ lite }) {
  const geo = useMemo(() => {
    const seg = lite ? 60 : 110, g = new THREE.PlaneGeometry(200, 200, seg, seg); g.rotateX(-Math.PI / 2);
    const p = g.attributes.position, col = new Float32Array(p.count * 3);
    const a = new THREE.Color('#7ccf5b'), b = new THREE.Color('#58a944'), c = new THREE.Color('#a9da6b'), t = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i), h = groundH(x, z); p.setY(i, h);
      const n = Math.sin(x * 0.7) * Math.cos(z * 0.6) * 0.5 + 0.5;
      t.copy(a).lerp(c, n * 0.6).lerp(b, Math.min(1, h / 6)); col.set([t.r, t.g, t.b], i * 3);
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals(); return g;
  }, [lite]);
  return <mesh geometry={geo} receiveShadow><Toon vertexColors color="#fff" /></mesh>;
}

const PATH = new THREE.CatmullRomCurve3([[0, 0.04, 16], [1.6, 0.04, 9], [-1.6, 0.04, 3.5], [0.8, 0.04, -3], [-0.6, 0.04, -9], [0, 0.04, -14]].map((p) => new THREE.Vector3(...p)));
const PATH_PTS = PATH.getPoints(40);
function Path() {
  const geo = useMemo(() => {
    const n = 48, pos = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const p = PATH.getPoint(i / n), t = PATH.getTangent(i / n), w = 1.15;
      pos.push(p.x - t.z * w, p.y, p.z + t.x * w, p.x + t.z * w, p.y, p.z - t.x * w);
      if (i < n) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }, []);
  const stones = useMemo(() => { const r = rng(7); return Array.from({ length: 36 }, (_, i) => { const p = PATH.getPoint(r()); return { p: [p.x + (r() - 0.5) * 1.6, 0.06, p.z], s: [0.18 + r() * 0.12, 0.06, 0.15 + r() * 0.1], c: '#d6b98c', ry: r() * 3 }; }); }, []);
  return (<>
    <mesh geometry={geo} receiveShadow><Toon color="#e2c28f" side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-2} /></mesh>
    <Inst items={stones} geo={<sphereGeometry args={[1, 6, 5]} />} />
  </>);
}

function Gate({ onPick }) {
  const board = useRef();
  const tex = useMemo(() => textTexture(['SELAMAT DATANG', 'Kampung Seri Ceria'], 1024, 400, '#fff1c9', '#6b3a1c', [96, 76], '#d88b55'), []);
  useFrame(({ clock }) => sway(board, clock.elapsedTime, 0.025, 1.3));
  return (
    <group position={[0, 0, 13]} onClick={(e) => { e.stopPropagation(); onPick('gate'); }}>
      {[-3.6, 3.6].map((x) => (<group key={x} position={[x, 0, 0]}>
        <mesh position={[0, 2.5, 0]} castShadow><boxGeometry args={[0.8, 5, 0.8]} /><Toon color="#c98d55" /><OL /></mesh>
        <mesh position={[0, 5.15, 0]} castShadow><boxGeometry args={[1.1, 0.3, 1.1]} /><Toon color="#e0453a" /></mesh>
        <mesh position={[0, 5.75, 0]} castShadow><coneGeometry args={[0.5, 0.9, 4]} /><Toon color="#ffcf3f" /></mesh></group>))}
      <mesh position={[0, 4.85, 0]} castShadow><boxGeometry args={[8.2, 0.35, 0.7]} /><Toon color="#8a5a35" /><OL /></mesh>
      {Array.from({ length: 9 }, (_, i) => (<mesh key={i} position={[-3.2 + i * 0.8, 5.25, 0]} castShadow><coneGeometry args={[0.28, 0.6, 4]} /><Toon color={i % 2 ? '#ffcf3f' : '#e0453a'} /></mesh>))}
      <group ref={board} position={[0, 4.05, 0.05]}>
        {[-2.6, 2.6].map((x) => (<mesh key={x} position={[x, 0.65, 0]}><cylinderGeometry args={[0.03, 0.03, 0.5, 4]} /><Toon color="#5a3a22" /></mesh>))}
        <mesh castShadow><boxGeometry args={[6, 1.9, 0.18]} /><Toon color="#d88b55" /><OL /></mesh>
        <mesh position={[0, 0, 0.1]}><planeGeometry args={[5.7, 1.65]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
      </group>
    </group>
  );
}

const fencePosts = (x0, x1, z, gap = 1.3) => { const out = []; for (let x = x0; x <= x1 + 0.01; x += gap) out.push({ p: [x, 0.55, z], s: [0.12, 1.1, 0.12], c: '#9b6a3f' }); return out; };

function Garden({ split, onPick }) {
  const crops = useMemo(() => {
    const out = [];
    for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) out.push({ p: [-3.5 + i * 0.85, 0.35, -1.9 + r * 1.1], s: 0.3, c: r % 2 ? '#8fd45a' : '#5fc05a' });
    for (let r = 0; r < 2; r++) for (let i = 0; i < 3; i++) out.push({ p: [4.5 + i * 0.95, 0.38, -1.8 + r * 1.1], s: 0.33, c: '#ff9f1c' });
    return out;
  }, []);
  const posts = useMemo(() => [...fencePosts(-4.3, 7.3, -2.8), ...fencePosts(-4.3, 4.3, 2.8), ...fencePosts(4.3, 7.3, 0.8)], []);
  const sc = useRef();
  useFrame(({ clock }) => { if (sc.current && !getS().rm) sc.current.rotation.z = Math.sin(clock.elapsedTime * 1.4) * 0.06; });
  return (
    <Hotspot id="garden" label="Kebun Tok Ketua" position={[-12, 0, 4]} onPick={onPick} height={3.6}>
      <mesh position={[0, 0.07, 0]} receiveShadow><boxGeometry args={[8, 0.14, 5]} /><Toon color="#7a4b2a" /></mesh>
      <mesh position={[5.5, 0.07, -1]} receiveShadow><boxGeometry args={[3, 0.14, 3]} /><Toon color="#7a4b2a" /></mesh>
      {split && (<>
        <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[7.9, 4.9]} /><meshBasicMaterial color="#2fb9c9" transparent opacity={0.55} /></mesh>
        <mesh position={[5.5, 0.17, -1]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.9, 2.9]} /><meshBasicMaterial color="#ff8a3d" transparent opacity={0.6} /></mesh>
      </>)}
      <Inst items={crops} geo={<icosahedronGeometry args={[1, 1]} />} cast />
      <Inst items={posts} geo={<boxGeometry args={[1, 1, 1]} />} cast />
      <group position={[-3, 0, 1.6]}>
        <mesh position={[0, 1.1, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 2.2, 6]} /><Toon color="#7a5230" /></mesh>
        <group ref={sc} position={[0, 1.6, 0]}><mesh castShadow><boxGeometry args={[1.5, 0.08, 0.08]} /><Toon color="#7a5230" /></mesh></group>
        <mesh position={[0, 1.4, 0]} castShadow><cylinderGeometry args={[0.28, 0.34, 0.8, 8]} /><Toon color="#e05a5a" /><OL t={0.025} /></mesh>
        <mesh position={[0, 2.0, 0]} castShadow><sphereGeometry args={[0.26, 10, 8]} /><Toon color="#f2d08a" /></mesh>
        <mesh position={[0, 2.27, 0]} castShadow><coneGeometry args={[0.55, 0.3, 10]} /><Toon color="#e8b64c" /></mesh>
      </group>
    </Hotspot>
  );
}

function Stalls({ onPick }) {
  return (
    <Hotspot id="stalls" label="Gerai Pesta" position={[10.5, 0, 4.5]} onPick={onPick} height={4.4}>
      <Stall position={[0, 0, -3.4]} ry={-Math.PI / 2} color="#e0453a" goods={['#d83a3a', '#ffcf3f']} />
      <Stall position={[0, 0, 0]} ry={-Math.PI / 2} color="#2f9e8f" goods={['#8fd45a', '#ff9f1c']} />
      <Stall position={[0, 0, 3.4]} ry={-Math.PI / 2} color="#7b5fd0" goods={['#ff6fa5', '#ffe066']} />
    </Hotspot>
  );
}

function Stage({ onPick }) {
  const tex = useMemo(() => textTexture(['VIDEO MUZIK MATEMATIK', 'Akan datang'], 1024, 576, '#1f2a44', '#ffe066', [72, 54]), []);
  return (
    <Hotspot id="stage" label="Pentas Video Muzik" position={[0, 0, -17]} onPick={onPick} height={6.4}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow><boxGeometry args={[10, 0.6, 5.4]} /><Toon color="#c98d55" /><OL /></mesh>
      {[-4.6, 4.6].map((x) => (<mesh key={x} position={[x, 2.6, 2]} castShadow><cylinderGeometry args={[0.16, 0.16, 4.6, 8]} /><Toon color="#8a5a35" /></mesh>))}
      <mesh position={[0, 5.1, 0]} castShadow><boxGeometry args={[10.6, 0.3, 6]} /><Toon color="#e0453a" /><OL /></mesh>
      <mesh position={[0, 3.2, -2.5]} castShadow><boxGeometry args={[7, 3.9, 0.25]} /><Toon color="#2b2e4a" /></mesh>
      <mesh position={[0, 3.2, -2.35]}><planeGeometry args={[6.4, 3.6]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
    </Hotspot>
  );
}

function Sawah() {
  const tufts = useMemo(() => { const r = rng(3), o = []; for (let b = 0; b < 2; b++) for (let i = 0; i < 14; i++) for (let j = 0; j < 8; j++) o.push({ p: [-6 + i * 0.85 + r() * 0.2, 0.55, b * 7.5 + j * 0.8 + r() * 0.2], s: [0.2, 0.6 + r() * 0.2, 0.2], c: r() > 0.5 ? '#9bd34a' : '#7cc043' }); return o; }, []);
  const g = useRef();
  useFrame(({ clock }) => sway(g, clock.elapsedTime, 0.012, 1.5));
  return (
    <group position={[26, 0, -12]}>
      {[0, 7.5].map((z) => (<group key={z}><mesh position={[0, 0.12, z + 3]}><boxGeometry args={[13, 0.3, 7]} /><Toon color="#8a6a3a" /></mesh>
        <mesh position={[0, 0.3, z + 3]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[12.4, 6.4]} /><meshStandardMaterial color="#8fd3cf" roughness={0.15} metalness={0.2} /></mesh></group>))}
      <group ref={g}><Inst items={tufts} geo={<coneGeometry args={[1, 1, 4]} />} /></group>
    </group>
  );
}

export default function Village({ lite, split, onPick }) {
  const flowers = useMemo(() => {
    const r = rng(11), cols = ['#ff6fa5', '#ffe066', '#ffffff', '#ff9f43', '#b58cff'], o = [], ex = [[-10, 4, 9], [10.5, 4.5, 6], [0, -17, 8], [-14, -6, 5], [14, -9, 5], [-23, 5, 5], [20, 4, 5]];
    for (let n = 0; n < (lite ? 110 : 240); n++) {
      const x = (r() - 0.5) * 70, z = (r() - 0.5) * 60 + 2;
      if (PATH_PTS.some((p) => Math.hypot(p.x - x, p.z - z) < 2.4) || ex.some(([a, b, rad]) => Math.hypot(a - x, b - z) < rad) || z > 12) continue;
      o.push({ p: [x, 0.12, z], s: 0.12 + r() * 0.06, c: cols[(r() * 5) | 0] });
    }
    return o;
  }, [lite]);
  const grass = useMemo(() => { const r = rng(5), o = []; for (let n = 0; n < (lite ? 150 : 380); n++) { const x = (r() - 0.5) * 80, z = (r() - 0.5) * 70; if (PATH_PTS.some((p) => Math.hypot(p.x - x, p.z - z) < 1.8)) continue; o.push({ p: [x, 0.2, z], s: [0.09, 0.3 + r() * 0.2, 0.09], c: r() > 0.5 ? '#5aa944' : '#6dbb4e', ry: r() * 3 }); } return o; }, [lite]);
  const hills = useMemo(() => { const r = rng(21), o = []; for (let n = 0; n < (lite ? 40 : 90); n++) { const a = r() * Math.PI * 2, d = 50 + r() * 28, x = Math.cos(a) * d, z = Math.sin(a) * d - 6, s = 2 + r() * 2; o.push({ p: [x, groundH(x, z) + s * 0.8, z], s, c: r() > 0.5 ? '#3f9b49' : '#4cae52' }); } return o; }, [lite]);
  const fence = useMemo(() => [...fencePosts(4.8, 18), ...fencePosts(-18, -4.8)].map((p) => ({ ...p, p: [p.p[0], p.p[1], 13.2] })), []);
  return (
    <group>
      <Terrain lite={lite} /><Path /><Gate onPick={onPick} />
      <Inst items={fence} geo={<boxGeometry args={[1, 1, 1]} />} cast />
      {[[11.4, 1], [-11.4, 1]].map(([x], i) => (<mesh key={i} position={[x, 0.8, 13.2]}><boxGeometry args={[13.4, 0.1, 0.08]} /><Toon color="#b98350" /></mesh>))}
      <Garden split={split} onPick={onPick} /><Stalls onPick={onPick} /><Stage onPick={onPick} /><Sawah />
      <House position={[-14, 0, -6]} ry={0.5} /><House position={[14, 0, -9]} ry={-0.9} wall="#cfeec3" roof="#c0603a" />
      <House position={[-23, 0, 5]} ry={1.2} wall="#ffe0b0" roof="#9a4a3a" /><House position={[20, 0, 4]} ry={-1.4} wall="#bfe3f0" roof="#b8553a" />
      <Palm position={[-6.6, 0, 14.8]} lean={0.1} seed={1} /><Palm position={[6.9, 0, 14.6]} lean={-0.1} h={6.6} seed={2} />
      <Palm position={[-20, 0, -2]} seed={3} h={7} /><Palm position={[17, 0, -3]} lean={-0.14} seed={4} /><Palm position={[8, 0, -14]} seed={5} h={6.2} />
      <Palm position={[-8, 0, -15]} lean={-0.1} seed={6} /><Palm position={[24, 0, 9]} seed={7} h={7} /><Palm position={[-27, 0, -6]} lean={0.15} seed={8} />
      <Tree position={[-5.6, 0, 10.5]} seed={1} /><Tree position={[12, 0, 14]} s={1.2} seed={2} /><Tree position={[-17, 0, 16]} s={1.1} seed={3} color="#6bc24f" />
      <Tree position={[18, 0, 17]} seed={4} /><Tree position={[-12, 0, -12]} s={1.3} seed={5} /><Tree position={[7, 0, -8]} seed={6} color="#6bc24f" />
      {/* festival poles + bunting */}
      {[-3.8, 4.8].map((x) => (<mesh key={x} position={[x, 2.6, 1]} castShadow><cylinderGeometry args={[0.07, 0.1, 5.2, 6]} /><Toon color="#c9a24a" /></mesh>))}
      <Bunting from={[-3.8, 5, 1]} to={[4.8, 5, 1]} n={13} sag={0.9} />
      <Bunting from={[9, 2.8, -1.7]} to={[9, 2.8, 8.7]} n={11} sag={0.5} />
      <Inst items={flowers} geo={<icosahedronGeometry args={[1, 0]} />} />
      <Inst items={grass} geo={<coneGeometry args={[1, 1, 4]} />} />
      <Inst items={hills} geo={<icosahedronGeometry args={[1, 1]} />} />
      {[[-12, 4], [12, 3.5], [-10, 5]].map(([x, z], i) => (<Butterfly key={i} center={[x, 1.6, z]} r={2.4} phase={i * 2} speed={0.5 + i * 0.12} color={['#ff8fab', '#ffd166', '#a0c4ff'][i]} />))}
      {[[-60, 26, -30, 1.1, 1.3], [-20, 30, -50, 0.8, 1.6], [30, 24, -40, 1.4, 1.1], [60, 28, -10, 0.9, 1.4], [-45, 22, 10, 0.6, 1], [10, 34, -60, 1.1, 1.8], [40, 26, 20, 0.7, 1.2]].map(([x, y, z, sp, s], i) => (<Cloud key={i} position={[x, y, z]} speed={sp} s={s} />))}
    </group>
  );
}
