import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { useS, setS } from './store.js';
import { Boundary } from './Boundary.jsx';
import { BASE, CHAPTERS, CHARS, DIALOGUES, LOCS } from './data.js';
import Diagnostic from './ui/Diagnostic.jsx';
import Guru from './ui/Guru.jsx';
import Fallback from './ui/Fallback.jsx';
import { DialogueBox, GardenPanel, StagePanel } from './ui/Panels.jsx';

const Scene = lazy(() => import('./three/Scene.jsx'));
const hasWebGL = () => { try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch { return false; } };
const probe = async (path) => { try { const r = await fetch(BASE + path, { method: 'HEAD' }); return r.ok && !(r.headers.get('content-type') || '').includes('text/html'); } catch { return false; } };
const STEPS = ['Tiba di kampung', 'Lawat kebun', 'Soalan pemanasan'];

export default function App() {
  const S = useS();
  const [gl] = useState(hasWebGL);
  const [crashed, setCrashed] = useState(false);
  const [intro, setIntro] = useState('playing');
  const [view, setView] = useState('gate');
  const [panel, setPanel] = useState(() => (location.hash === '#guru' ? 'guru' : null));
  const [dlg, setDlg] = useState(null);
  const [speaker, setSpeaker] = useState(null);
  const [split, setSplit] = useState(false);
  const [done, setDone] = useState(() => new Set(['gate']));
  const [result, setResult] = useState(() => { try { return JSON.parse(localStorage.getItem('km-diag')); } catch { return null; } });
  const [glb, setGlb] = useState({ aiman: false, mia: false, tok: false });
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    Promise.all(Object.keys(CHARS).map((k) => probe(CHARS[k].glb))).then(([a, m, t]) => setGlb({ aiman: a, mia: m, tok: t }));
    probe('video/muzik-matematik.mp4').then(setHasVideo);
    const h = () => setPanel((p) => (location.hash === '#guru' ? 'guru' : p === 'guru' ? null : p));
    addEventListener('hashchange', h); return () => removeEventListener('hashchange', h);
  }, []);
  useEffect(() => { document.documentElement.classList.toggle('big', S.big); document.documentElement.classList.toggle('rm', S.rm); }, [S.big, S.rm]);

  const mark = (k) => setDone((d) => new Set(d).add(k));
  const closePanel = useCallback(() => { if (location.hash === '#guru') history.replaceState(null, '', location.pathname + location.search); setPanel(null); }, []);
  const endIntro = useCallback(() => setIntro('done'), []);
  const go = (id) => {
    setView(id);
    if (id === 'garden') { mark('garden'); setPanel('garden'); } else if (id === 'stage') setPanel('stage');
    else if (id === 'stalls') setDlg('stalls');
  };
  const startAdv = () => { setView('gate'); setDlg('start'); };
  const openDiag = () => { setDlg(null); setPanel('diag'); };
  const onChar = (id) => setDlg(id);
  const diagDone = (r) => { setResult(r); mark('diag'); try { localStorage.setItem('km-diag', JSON.stringify(r)); } catch {} };
  const playing = intro === 'playing';
  const showScene = gl && !crashed;
  const doneN = STEPS.filter((_, i) => done.has(['gate', 'garden', 'diag'][i])).length;

  return (
    <div className="app">
      <a className="skip" href="#utama">Langkau ke kandungan</a>
      <div className="stage" aria-hidden="true">
        {showScene && (
          <Boundary fallback={null} onError={() => setCrashed(true)}>
            <Suspense fallback={<div className="loading">Memuatkan kampung…</div>}>
              <Scene view={view} intro={intro} onIntroDone={endIntro} onPick={go} onChar={onChar} speaker={speaker} split={split} lite={S.lite} glb={glb} onCrash={() => setCrashed(true)} />
            </Suspense>
          </Boundary>)}
      </div>

      <header className="hud">
        <span className="brand">🏡 Kampung Matematik</span>
        <ol className="prog" aria-label={`Kemajuan: ${doneN} daripada ${STEPS.length}`}>{STEPS.map((s, i) => <li key={s} className={done.has(['gate', 'garden', 'diag'][i]) ? 'on' : ''}>{done.has(['gate', 'garden', 'diag'][i]) ? '✓ ' : ''}{s}</li>)}</ol>
        <div className="tools">
          <button className="tog" aria-pressed={S.big} onClick={() => setS({ big: !S.big })}>Teks Besar</button>
          <button className="tog" aria-pressed={S.rm} onClick={() => setS({ rm: !S.rm })}>Kurangkan Gerakan</button>
          <button className="tog" aria-pressed={S.lite} onClick={() => setS({ lite: !S.lite })}>Mod Ringan</button>
          <a className="tog link" href="#guru">Sudut Guru</a>
        </div>
      </header>

      <main id="utama">
        {!showScene && !panel && <Fallback onDiag={() => setPanel('diag')} reason={gl ? 'crash' : 'nogl'} />}
        {showScene && playing && (<div className="intro"><h1>KAMPUNG MATEMATIK</h1><h2>Pengembaraan Luas Bentuk Gabungan</h2><button className="btn ghost" onClick={endIntro}>Langkau pengenalan</button></div>)}
        {showScene && !playing && !panel && !dlg && (
          <section className="home">
            <h1>KAMPUNG MATEMATIK</h1><h2>Pengembaraan Luas Bentuk Gabungan</h2>
            <p>Pesta Kampung Seri Ceria hampir bermula! Bantu Aiman, Mia dan Tok Ketua menyelesaikan cabaran luas. Klik tempat berpenanda di kampung atau guna butang di bawah.</p>
            <div className="row"><button className="btn big" onClick={startAdv}>MULA PENGEMBARAAN</button><button className="btn ghost" onClick={openDiag}>Soalan pemanasan</button></div>
            <p className="small">Bab 1 hingga 5: {CHAPTERS.length} bab, akan dibuka pada milestone seterusnya.{result && ` Keputusan terakhir: ${result.score}/${result.total} (${result.tier}).`}</p>
          </section>)}
      </main>

      {showScene && <nav className="locs" aria-label="Lokasi kampung">{LOCS.map((l) => <button key={l.id} disabled={playing} aria-current={view === l.id} className={view === l.id ? 'on' : ''} onClick={() => go(l.id)}>{l.label}</button>)}</nav>}
      {dlg && !panel && DIALOGUES[dlg] && (
        <DialogueBox key={dlg} id={dlg} onSpeaker={setSpeaker} onClose={() => setDlg(null)}
          actions={dlg === 'start' ? [{ label: 'Mula soalan pemanasan', fn: openDiag }, { label: 'Lawat kebun dahulu', ghost: true, fn: () => { setDlg(null); go('garden'); } }] : undefined} />)}
      {panel === 'diag' && <Diagnostic onClose={closePanel} onDone={diagDone} />}
      {panel === 'garden' && <GardenPanel onClose={closePanel} split={split} setSplit={setSplit} onDiag={() => setPanel('diag')} />}
      {panel === 'stage' && <StagePanel onClose={closePanel} hasVideo={hasVideo} />}
      {panel === 'guru' && <Guru onClose={closePanel} glb={glb} hasVideo={hasVideo} />}
      {showScene && !glb.aiman && !glb.mia && !glb.tok && <div className="chip" role="note">Watak: model sementara. GLB belum ada.</div>}
    </div>
  );
}
