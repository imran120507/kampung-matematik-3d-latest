// Tiny settings store readable inside useFrame (no React context across the R3F boundary).
import { useSyncExternalStore } from 'react';
const w = typeof window !== 'undefined';
const rm = w && matchMedia('(prefers-reduced-motion: reduce)').matches;
const weak = w && (matchMedia('(pointer:coarse)').matches || innerWidth < 760 || (navigator.deviceMemory && navigator.deviceMemory <= 4));
let state = { rm, lite: !!weak, big: false };
const subs = new Set();
export const getS = () => state;
export const setS = (p) => { state = { ...state, ...p }; subs.forEach((f) => f()); };
export const useS = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, getS);
