export default function Fallback({ onDiag, reason }) {
  return (
    <div className="fb">
      <div className="fbcard">
        <h1>KAMPUNG MATEMATIK</h1><h2>Pengembaraan Luas Bentuk Gabungan</h2>
        <p role="status">{reason === 'crash' ? 'Pemandangan 3D terhenti pada peranti ini.' : 'Peranti atau pelayar ini tidak menyokong WebGL.'} Kamu masih boleh belajar dengan mod teks.</p>
        <p>Pesta Kampung Seri Ceria hampir bermula. Bantu Aiman, Mia dan Tok Ketua mengira luas bentuk gabungan: pecahkan bentuk, kira luas setiap bahagian, kemudian tambah.</p>
        <div className="row"><button className="btn" onClick={onDiag}>Mula soalan pemanasan</button></div>
      </div>
    </div>
  );
}
