import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, Sky } from '@react-three/drei';
import Village from './Village.jsx';
import CameraRig from './CameraRig.jsx';
import { Character } from './Characters.jsx';
import { setS } from '../store.js';

export default function Scene({ view, intro, onIntroDone, onPick, onChar, speaker, split, lite, glb, onCrash }) {
  return (
    <Canvas shadows dpr={lite ? [1, 1.25] : [1, 2]} gl={{ antialias: !lite, powerPreference: 'high-performance' }}
      camera={{ position: [-34, 28, 44], fov: 45, near: 0.5, far: 260 }}
      onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onCrash(); }); }}>
      <PerformanceMonitor onDecline={() => setS({ lite: true })} />
      <color attach="background" args={['#bfe6ff']} />
      <fog attach="fog" args={['#cfeeff', 70, 150]} />
      <Sky sunPosition={[60, 45, 30]} turbidity={3} rayleigh={1.2} />
      <hemisphereLight args={['#cfeaff', '#7aa05a', 1.0]} />
      <directionalLight key={lite ? 'l' : 'h'} position={[30, 40, 22]} intensity={2.3} color="#fff1d0" castShadow
        shadow-mapSize={lite ? [512, 512] : [2048, 2048]} shadow-camera-left={-38} shadow-camera-right={38} shadow-camera-top={38} shadow-camera-bottom={-38}
        shadow-camera-near={1} shadow-camera-far={130} shadow-bias={-0.0004} />
      <Suspense fallback={null}>
        <Village lite={lite} split={split} onPick={onPick} />
        <Character id="aiman" position={[-1.6, 0, 17.4]} ry={0.3} hasGLB={glb.aiman} speaking={speaker === 'aiman'} onPick={onChar} />
        <Character id="mia" position={[-4.2, 0, 15.8]} ry={0.5} hasGLB={glb.mia} speaking={speaker === 'mia'} onPick={onChar} />
        <Character id="tok" position={[2.4, 0, 16.6]} ry={-0.3} hasGLB={glb.tok} speaking={speaker === 'tok'} onPick={onChar} />
      </Suspense>
      <CameraRig view={view} intro={intro} onIntroDone={onIntroDone} />
    </Canvas>
  );
}
