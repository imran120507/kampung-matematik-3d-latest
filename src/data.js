export const BASE = import.meta.env.BASE_URL;
export const DSKP_URL = 'https://asiemodel.net/wp-content/uploads/2022/08/009_DSKP_KSSR_Semakan_2017_Matematik_Thn5-print.pdf';

export const CHARS = {
  aiman: { name: 'Aiman', color: '#1FA39A', role: 'Penggalak: meramal & meneroka', intro: 'Hai! Saya Aiman. Saya suka mencuba. Apa pendapat kamu tentang bentuk ini?', glb: 'models/aiman.glb' },
  mia: { name: 'Mia', color: '#F5D76E', role: 'Pembimbing: petunjuk & penjelasan', intro: 'Hai! Saya Mia. Kalau kamu buntu, tekan Petunjuk dan saya akan bantu.', glb: 'models/mia.glb' },
  tok: { name: 'Tok Ketua', color: '#2F7D4A', role: 'Pemberi cabaran: masalah kampung sebenar', intro: 'Selamat datang, anak-anak. Kampung kita ada banyak masalah luas yang menunggu untuk diselesaikan.', glb: 'models/tok.glb' }
};

// camera views: pos = camera position, tgt = look-at point
export const VIEWS = {
  gate:     { pos: [0, 3.6, 22.5],  tgt: [0, 3.0, 12] },
  garden:   { pos: [-3.5, 6.5, 14.5], tgt: [-10.5, 0.5, 4.5] },
  stalls:   { pos: [3.5, 3.6, 14], tgt: [10, 1.5, 4.5] },
  stage:    { pos: [2, 5, -4],      tgt: [0, 2.8, -17] },
  overview: { pos: [22, 15, 26],    tgt: [0, 1, 0] }
};
export const LOCS = [
  { id: 'gate', label: 'Pintu Masuk' }, { id: 'garden', label: 'Kebun' },
  { id: 'stalls', label: 'Gerai' }, { id: 'stage', label: 'Pentas Muzik' }, { id: 'overview', label: 'Pemandangan' }
];

export const DIALOGUES = {
  start: [
    ['tok', 'Selamat datang ke Kampung Seri Ceria! Pesta kampung tinggal beberapa hari lagi, tetapi kebun dan gerai kita belum siap.'],
    ['aiman', 'Tok Ketua perlukan bantuan kita! Setiap bahagian kampung dibina daripada dua bentuk yang bercantum.'],
    ['mia', 'Kita cari luas setiap bentuk dahulu, kemudian tambahkan. Jangan risau, saya beri petunjuk bila kamu buntu!'],
    ['tok', 'Sebelum bermula, jawab beberapa soalan pemanasan supaya kami tahu cara terbaik membantu kamu.']
  ],
  stalls: [
    ['tok', 'Di sini gerai buah dan kuih akan dibuka. Alas meja setiap gerai ialah bentuk gabungan.'],
    ['mia', 'Itu cabaran Bab 3: Pasar Kampung. Bab ini belum dibuka dalam versi ini.']
  ],
  aiman: [['aiman', CHARS.aiman.intro]], mia: [['mia', CHARS.mia.intro]], tok: [['tok', CHARS.tok.intro]]
};

export const CHAPTERS = [
  'Bab 1: Rahsia Bentuk', 'Bab 2: Kebun Tok Ketua', 'Bab 3: Pasar Kampung', 'Bab 4: Taman Impian', 'Bab 5: Pesta Kampung'
];

export const OBJECTIVES = [
  'Mengenal pasti bentuk komponen (segi empat tepat, segi empat sama, segi tiga) dalam bentuk gabungan, 4 daripada 5 rajah betul.',
  'Menulis rumus luas bagi setiap bentuk komponen dan unit yang betul (cm², m²).',
  'Menentukan luas gabungan dua bentuk dengan memecahkan dan menambah, sekurang-kurangnya 4 daripada 5 soalan betul.',
  'Menyelesaikan masalah kampung yang melibatkan luas bentuk gabungan dengan langkah kerja yang jelas.'
];

// Diagnostic. fig: rs = rectangle + rectangle, tri = rectangle + isosceles triangle.
export const QUIZ = [
  { skill: 'Luas segi empat tepat', q: 'Berapakah luas segi empat tepat yang berukuran 6 cm × 4 cm?', o: ['10 cm²', '24 cm²', '20 cm²', '48 cm²'], a: 1,
    h: 'Luas segi empat tepat = panjang × lebar.', e: '6 × 4 = 24 cm².' },
  { skill: 'Unit luas', q: 'Unit manakah sesuai untuk mengukur luas?', o: ['cm', 'cm²', 'cm³', 'kg'], a: 1,
    h: 'Luas mengukur ruang permukaan, iaitu petak sentimeter.', e: 'Luas diukur dalam cm² (sentimeter persegi).' },
  { skill: 'Gabungan segi empat tepat + segi empat sama', fig: { t: 'rs', a: 9, b: 4, s1: 3, s2: 3, u: 'cm', sc: 12 },
    desc: 'Segi empat tepat 9 cm × 4 cm bersambung dengan segi empat sama bersisi 3 cm di sebelah kanan, sama aras di bahagian bawah.',
    q: 'Rajah ialah bentuk gabungan daripada segi empat tepat 9 cm × 4 cm dan segi empat sama bersisi 3 cm. Berapakah jumlah luasnya?',
    o: ['45 cm²', '36 cm²', '52 cm²', '39 cm²'], a: 0,
    h: 'Kira luas segi empat tepat, kemudian luas segi empat sama.', e: '(9 × 4) + (3 × 3) = 36 + 9 = 45 cm².' },
  { skill: 'Gabungan segi empat tepat + segi tiga sama kaki', fig: { t: 'tri' },
    desc: 'Segi empat tepat 6 cm × 4 cm. Di atasnya terletak segi tiga sama kaki bertapak 6 cm dan tinggi 3 cm.',
    q: 'Rajah menunjukkan segi empat tepat 6 cm × 4 cm dengan segi tiga sama kaki di atasnya (tapak 6 cm, tinggi 3 cm). Berapakah jumlah luasnya?',
    o: ['33 cm²', '42 cm²', '27 cm²', '36 cm²'], a: 0,
    h: 'Luas segi tiga = ½ × tapak × tinggi.', e: '(6 × 4) + (½ × 6 × 3) = 24 + 9 = 33 cm². Ingat darab dengan ½ untuk segi tiga.' },
  { skill: 'Masalah kontekstual', fig: { t: 'rs', a: 7, b: 4, s1: 3, s2: 2, u: 'm', sc: 14 },
    desc: 'Petak sayur 7 m × 4 m bersambung dengan petak cili 3 m × 2 m di sebelah kanan, sama aras di bahagian bawah.',
    q: 'Tok Ketua menanam sayur di petak 7 m × 4 m dan cili di petak bersebelahan 3 m × 2 m. Berapakah luas tanah yang ditanam?',
    o: ['34 m²', '34 m', '22 m²', '42 m²'], a: 0,
    h: 'Tanah ditanam = petak sayur + petak cili. Unit luas ialah m².', e: '(7 × 4) + (3 × 2) = 28 + 6 = 34 m².' }
];
export const TIERS = [
  { min: 4, name: 'Lanjutan', text: 'Kamu bersedia untuk cabaran dua langkah dan sisi yang perlu dicari sendiri.' },
  { min: 3, name: 'Teras', text: 'Kamu hampir sedia. Latihan memecahkan bentuk dan menambah luas akan membantu.' },
  { min: 0, name: 'Sokongan', text: 'Kita mulakan dengan petak grid dan bentuk bergambar, selangkah demi selangkah.' }
];

export const ASSURE = [
  { k: 'A', t: 'Analyse Learners', pts: ['Murid Tahun 5 (sekitar 11 tahun), pelbagai tahap kebolehan dan gaya belajar.', 'Pengetahuan sedia ada yang dijangka: luas segi empat tepat/sama dan unit luas. Diagnostik 5 soalan menyemaknya.', 'Motivasi: cerita pesta kampung, watak asli, rasa meneroka dunia 3D.', 'Keperluan akses: teks besar, kurangkan gerakan, kawalan papan kekunci, bacaan oleh pembaca skrin.'], st: 'Diagnostik berfungsi. Belum diuji dengan murid sebenar.' },
  { k: 'S', t: 'State Objectives', pts: OBJECTIVES, st: 'Objektif ditulis boleh diukur (ABCD). Pemetaan ke soalan diagnostik ada dalam kod.' },
  { k: 'S', t: 'Select Methods, Media & Materials', pts: ['Kaedah: pembelajaran berasaskan masalah dalam cerita kampung, model kerja (worked example) di kebun, soalan berperingkat.', 'Media: persekitaran 3D yang boleh diteroka, dialog watak, rajah SVG berlabel, video muzik matematik.', 'Bahan: kad grid, kertas petak, bentuk kertas boleh dipotong untuk aktiviti luar talian.'], st: 'Kampung 3D siap. Model watak GLB, klip animasi dan video muzik BELUM ada.' },
  { k: 'U', t: 'Utilize Media & Materials', pts: ['Guru pratonton adegan dan diagnostik sebelum kelas.', 'Pengenalan 5 minit: Mula Pengembaraan dan dialog Tok Ketua.', 'Murid meneroka kebun, mencuba model kerja, kemudian menjawab diagnostik.', 'Guru menggunakan hasil diagnostik (Sokongan/Teras/Lanjutan) untuk mengumpulkan murid.'], st: 'Aliran Milestone 1 berfungsi. Bab 1 hingga 5 belum dibina.' },
  { k: 'R', t: 'Require Learner Participation', pts: ['Setiap soalan memberi maklum balas serta-merta dan penjelasan.', 'Petunjuk dari Mia sebelum menjawab.', 'Murid memecahkan bentuk kebun sendiri dan mengira luas komponen.', 'Boleh cuba semula tanpa penalti rasmi.'], st: 'Berfungsi.' },
  { k: 'E', t: 'Evaluate & Revise', pts: ['Diagnostik: ambang penguasaan 4/5, dilaporkan mengikut kemahiran.', 'Sumatif akhir dan rubrik bab akan ditambah pada milestone seterusnya.', 'Semakan: uji dengan murid, semak kesukaran soalan, bahasa dan aksesibiliti, kemudian pinda.'], st: 'Belum disahkan dengan murid. Data hanya disimpan setempat pada peranti.' }
];
export const DIFF = [
  ['Sokongan', 'Petak grid untuk dikira, bentuk sudah dipecahkan, ayat pendek, bacaan kuat oleh guru atau rakan.'],
  ['Teras', 'Memecahkan bentuk sendiri, mengira luas komponen, menambah, menulis unit.'],
  ['Lanjutan', 'Mencari sisi yang tiada, masalah dua langkah, mereka bentuk bentuk gabungan sendiri.']
];
export const ACCESS = [
  'Semua tindakan boleh dibuat dengan papan kekunci (Tab, Enter, Esc). Adegan 3D tidak diperlukan untuk menjawab.',
  'Kurangkan Gerakan: kamera berpindah serta-merta, animasi alam berhenti. Dikesan automatik dari tetapan sistem.',
  'Teks Besar dan kontras tinggi pada panel. Maklum balas guna ikon dan teks, bukan warna sahaja.',
  'Mod Ringan untuk telefon dan peranti lemah. Laman ganti tanpa WebGL turut disediakan.',
  'Belum ada audio, sari kata atau bacaan suara. Perlu ditambah dengan video muzik.'
];
