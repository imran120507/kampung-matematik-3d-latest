import { useEffect, useRef, useState } from 'react';
import Modal from './Modal.jsx';
import { BASE, CHARS, DIALOGUES } from '../data.js';

export function DialogueBox({ id, actions, onClose, onSpeaker }) {
  const lines = DIALOGUES[id], [i, setI] = useState(0), last = i === lines.length - 1, [sp, text] = lines[i], c = CHARS[sp], btn = useRef();
  useEffect(() => { onSpeaker(sp); btn.current?.focus(); }, [i]);
  useEffect(() => () => onSpeaker(null), []);
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, [onClose]);
  return (
    <section className="dlg" role="dialog" aria-label="Dialog" aria-live="polite">
      <div className="av" style={{ background: c.color }} aria-hidden="true">{c.name[0]}</div>
      <div className="dtx"><b>{c.name}</b><p>{text}</p>
        <div className="row">
          {!last && <button ref={btn} className="btn" onClick={() => setI(i + 1)}>Seterusnya ▶</button>}
          {last && actions?.map((a, k) => <button key={k} ref={k === 0 ? btn : null} className={'btn' + (a.ghost ? ' ghost' : '')} onClick={a.fn}>{a.label}</button>)}
          {last && !actions && <button ref={btn} className="btn" onClick={onClose}>Tutup</button>}
          <button className="btn ghost" onClick={onClose}>Langkau</button>
        </div></div>
    </section>
  );
}

export function GardenPanel({ onClose, split, setSplit, onDiag }) {
  const [shown, setShown] = useState(false);
  return (
    <Modal title="Kebun Tok Ketua" onClose={onClose}>
      <p className="small">Misi pratonton Bab 2. Bab ini belum dibuka sepenuhnya dalam versi ini.</p>
      <p>Kebun Tok Ketua ialah <b>bentuk gabungan</b>: segi empat tepat 8 m × 5 m dan segi empat sama 3 m × 3 m yang bersambung. Tekan butang untuk memecahkan bentuk di kampung 3D.</p>
      <div className="row"><button className="btn" aria-pressed={split} onClick={() => setSplit(!split)}>{split ? 'Padam warna bahagian' : 'Pecahkan bentuk kebun'}</button></div>
      {split && (<ul className="skills"><li><span className="dot" style={{ background: '#2fb9c9' }} /> Bahagian biru kehijauan: segi empat tepat 8 × 5</li><li><span className="dot" style={{ background: '#ff8a3d' }} /> Bahagian oren: segi empat sama 3 × 3</li></ul>)}
      {split && !shown && <div className="row"><button className="btn ghost" onClick={() => setShown(true)}>Kira luas</button></div>}
      <div aria-live="polite">{shown && <p className="good"><b>Luas = (8 × 5) + (3 × 3) = 40 + 9 = 49 m²</b></p>}</div>
      <div className="row"><button className="btn" onClick={onDiag}>Cuba soalan pemanasan</button></div>
    </Modal>
  );
}

export function StagePanel({ onClose, hasVideo }) {
  return (
    <Modal title="Pentas Video Muzik" onClose={onClose}>
      {hasVideo ? (
        <video controls preload="metadata" className="vid" src={BASE + 'video/muzik-matematik.mp4'}>
          <track kind="captions" srcLang="ms" label="Bahasa Melayu" src={BASE + 'video/muzik-matematik.ms.vtt'} default />
        </video>
      ) : (<>
        <div className="vidph">🎵 Video muzik matematik asli akan dimainkan di sini.</div>
        <p><b>Status:</b> video belum dihasilkan. Letakkan <code>public/video/muzik-matematik.mp4</code> dan <code>muzik-matematik.ms.vtt</code> (sari kata), kemudian muat semula. Lihat docs/ASSET_GUIDE.md.</p>
      </>)}
    </Modal>
  );
}
