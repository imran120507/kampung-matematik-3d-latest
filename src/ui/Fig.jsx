const L = { fontSize: 12, fontWeight: 700, fill: '#5a3a22' };
export default function Fig({ f, desc }) {
  if (f.t === 'tri') return (
    <svg viewBox="0 0 150 120" className="fig" role="img" aria-label={desc}>
      <polygon points="40,40 112,40 76,4" fill="#ffd28a" stroke="#6b3a1c" strokeWidth="2" />
      <rect x="40" y="40" width="72" height="48" fill="#a9e0d0" stroke="#6b3a1c" strokeWidth="2" />
      <line x1="76" y1="4" x2="76" y2="40" stroke="#6b3a1c" strokeDasharray="3 3" />
      <text x="80" y="25" {...L}>3 cm</text><text x="76" y="106" textAnchor="middle" {...L}>6 cm</text><text x="4" y="68" {...L}>4 cm</text>
    </svg>);
  const { a, b, s1, s2, u, sc } = f, ox = 34, oy = 20, w = ox + (a + s1) * sc + 44, h = oy + b * sc + 28, y0 = oy + b * sc;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="fig" role="img" aria-label={desc}>
      <rect x={ox} y={oy} width={a * sc} height={b * sc} fill="#a9e0d0" stroke="#6b3a1c" strokeWidth="2" />
      <rect x={ox + a * sc} y={y0 - s2 * sc} width={s1 * sc} height={s2 * sc} fill="#ffd28a" stroke="#6b3a1c" strokeWidth="2" />
      <text x={ox + (a * sc) / 2} y={oy - 6} textAnchor="middle" {...L}>{a} {u}</text>
      <text x="2" y={oy + (b * sc) / 2 + 4} {...L}>{b} {u}</text>
      <text x={ox + a * sc + (s1 * sc) / 2} y={y0 + 16} textAnchor="middle" {...L}>{s1} {u}</text>
      <text x={ox + (a + s1) * sc + 4} y={y0 - (s2 * sc) / 2 + 4} {...L}>{s2} {u}</text>
    </svg>);
}
