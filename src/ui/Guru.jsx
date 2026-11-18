import { useState } from 'react';
import Modal from './Modal.jsx';
import { ACCESS, ASSURE, DIFF, DSKP_URL, OBJECTIVES, CHARS } from '../data.js';

export default function Guru({ onClose, glb, hasVideo }) {
  const [tab, setTab] = useState(0);
  const tabs = ['DSKP', 'ASSURE', 'Pembezaan & Akses', 'Status Aset'];
  return (
    <Modal title="Sudut Guru: ASSURE & DSKP" onClose={onClose} wide>
      <div className="tabs" role="tablist">{tabs.map((t, i) => <button key={t} role="tab" aria-selected={tab === i} className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>{t}</button>)}</div>
      <div className="tabbody" role="tabpanel">
        {tab === 0 && (<>
          <dl className="dl"><dt>Mata pelajaran</dt><dd>Matematik Tahun 5 (KSSR Semakan 2017)</dd><dt>Bidang</dt><dd>Sukatan dan Geometri</dd><dt>Tajuk</dt><dd>6.0 Ruang</dd><dt>Standard Kandungan</dt><dd>6.3 Perimeter dan luas</dd><dt>Standard Pembelajaran</dt><dd>6.3.2</dd></dl>
          <blockquote>Menentukan luas gabungan dua bentuk melibatkan segi empat tepat, segi empat sama, segi tiga sama sisi, segi tiga sama kaki dan segi tiga bersudut tegak.</blockquote>
          <p className="small">Teks standard pembelajaran dibawa dari versi awal projek. Sila semak dengan dokumen DSKP rasmi sebelum digunakan secara rasmi.</p>
          <p><a className="btn ghost" href={DSKP_URL} target="_blank" rel="noopener noreferrer">Buka DSKP (PDF, tab baharu)</a></p>
          <h3>Objektif pembelajaran boleh diukur</h3><ol>{OBJECTIVES.map((o) => <li key={o}>{o}</li>)}</ol>
        </>)}
        {tab === 1 && ASSURE.map((s) => (<section key={s.t} className="as"><h3><span className="k">{s.k}</span>{s.t}</h3><ul>{s.pts.map((p) => <li key={p}>{p}</li>)}</ul><p className="st"><b>Status:</b> {s.st}</p></section>))}
        {tab === 2 && (<><h3>Pembezaan</h3><ul>{DIFF.map(([a, b]) => <li key={a}><b>{a}:</b> {b}</li>)}</ul><h3>Aksesibiliti</h3><ul>{ACCESS.map((a) => <li key={a}>{a}</li>)}</ul></>)}
        {tab === 3 && (<>
          <p><b>Versi ini ialah Milestone 1, bukan produk siap.</b></p>
          <table className="tbl"><tbody>
            {Object.entries(CHARS).map(([id, c]) => <tr key={id}><td>Model watak {c.name}</td><td>{glb[id] ? '✓ GLB ditemui' : '✗ TIADA: guna model sementara'}</td></tr>)}
            <tr><td>Klip animasi watak (Idle/Talk/Wave)</td><td>{Object.values(glb).some(Boolean) ? 'Dikesan jika ada dalam GLB' : '✗ TIADA'}</td></tr>
            <tr><td>Video muzik matematik</td><td>{hasVideo ? '✓ ditemui' : '✗ TIADA: slot disediakan'}</td></tr>
            <tr><td>Audio dan bunyi</td><td>✗ Belum ada</td></tr>
            <tr><td>Bab 1 hingga 5</td><td>✗ Belum dibina</td></tr>
            <tr><td>Pengesahan dengan murid sebenar</td><td>✗ Belum dilakukan</td></tr>
          </tbody></table>
          <p className="small">Panduan: docs/ASSET_GUIDE.md</p>
        </>)}
      </div>
    </Modal>
  );
}
