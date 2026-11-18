import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import Fig from './Fig.jsx';
import { QUIZ, TIERS } from '../data.js';

export default function Diagnostic({ onClose, onDone }) {
  const [i, setI] = useState(0), [pick, setPick] = useState(null), [hint, setHint] = useState(false), [res, setRes] = useState([]);
  const q = QUIZ[i], fin = i >= QUIZ.length, score = res.filter(Boolean).length;
  const tier = TIERS.find((t) => score >= t.min);
  useEffect(() => { if (fin) onDone({ score, total: QUIZ.length, tier: tier.name }); }, [fin]);
  const choose = (k) => { if (pick !== null) return; setPick(k); setRes((r) => [...r, k === q.a]); };
  const next = () => { setPick(null); setHint(false); setI(i + 1); };
  const reset = () => { setI(0); setPick(null); setHint(false); setRes([]); };
  const ok = pick === q?.a;
  return (
    <Modal title="Sebelum Kita Mula" onClose={onClose}>
      {!fin ? (<>
        <p className="small">Latihan pemanasan. Tiada markah rasmi. Soalan {i + 1} / {QUIZ.length}</p>
        <progress max={QUIZ.length} value={i + (pick !== null ? 1 : 0)} aria-label="Kemajuan soalan" />
        <p className="q">{q.q}</p>
        {q.fig && <Fig f={q.fig} desc={q.desc} />}
        <div className="opts" role="group" aria-label="Pilihan jawapan">
          {q.o.map((t, k) => (
            <button key={k} className={'opt' + (pick !== null ? (k === q.a ? ' right' : k === pick ? ' wrong' : '') : '')} onClick={() => choose(k)} aria-disabled={pick !== null}>
              <b>{'ABCD'[k]}</b> {t}{pick !== null && k === q.a ? ' ✓' : ''}{pick === k && k !== q.a ? ' ✗' : ''}
            </button>))}
        </div>
        <div aria-live="polite" className="fbk">
          {pick === null && hint && <p className="hint">💡 Mia: {q.h}</p>}
          {pick !== null && <p className={ok ? 'good' : 'bad'}><b>{ok ? '✓ Betul!' : '✗ Belum tepat.'}</b> {q.e}</p>}
        </div>
        <div className="row">
          {pick === null && <button className="btn ghost" onClick={() => setHint(true)}>Petunjuk</button>}
          {pick !== null && <button className="btn" onClick={next}>{i === QUIZ.length - 1 ? 'Lihat keputusan' : 'Soalan seterusnya'}</button>}
        </div>
      </>) : (<>
        <p className="score">{score} / {QUIZ.length}</p>
        <p><b>Laluan cadangan: {tier.name}.</b> {tier.text}</p>
        <ul className="skills">{QUIZ.map((s, k) => <li key={k}>{res[k] ? '✓' : '✗'} {s.skill}</li>)}</ul>
        <p className="small">Ini hanya penunjuk awal untuk bantuan, bukan penilaian rasmi.</p>
        <div className="row"><button className="btn ghost" onClick={reset}>Cuba lagi</button><button className="btn" onClick={onClose}>Kembali ke kampung</button></div>
      </>)}
    </Modal>
  );
}
