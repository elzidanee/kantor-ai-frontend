import React from 'react';

// =========================================================================
// KOLEKSI ASET PERABOT VEKTOR HIGH-END (100% VECTOR, CRISP, NO AI SLOP)
// =========================================================================

// 1. Papan Tulis Agile Sprint (Whiteboard)
export const WhiteboardProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 96,
  h = 58,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Whiteboard Sprint Plan"
  >
    <svg viewBox="0 0 96 58" width={w} height={h} className="filter drop-shadow-md">
      {/* Frame & Board Surface */}
      <rect x="2" y="2" width="92" height="50" rx="4" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" />
      <rect x="4" y="4" width="88" height="46" rx="2" fill="#ffffff" />
      
      {/* Kolom Sprint (To Do | In Progress | Done) */}
      <line x1="33" y1="6" x2="33" y2="48" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="63" y1="6" x2="63" y2="48" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
      <text x="18" y="12" fontSize="5" fontWeight="bold" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">TO DO</text>
      <text x="48" y="12" fontSize="5" fontWeight="bold" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">DOING</text>
      <text x="78" y="12" fontSize="5" fontWeight="bold" fill="#10b981" textAnchor="middle" fontFamily="sans-serif">DONE</text>

      {/* Sticky Notes Berwarna */}
      <rect x="8" y="16" width="10" height="8" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
      <rect x="20" y="17" width="10" height="8" rx="1" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.5" />
      <rect x="9" y="27" width="10" height="8" rx="1" fill="#bfdbfe" stroke="#2563eb" strokeWidth="0.5" />

      <rect x="38" y="17" width="10" height="8" rx="1" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.5" />
      <rect x="49" y="22" width="10" height="8" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />

      <rect x="68" y="16" width="10" height="8" rx="1" fill="#bbf7d0" stroke="#16a34a" strokeWidth="0.5" />
      <rect x="79" y="18" width="10" height="8" rx="1" fill="#bbf7d0" stroke="#16a34a" strokeWidth="0.5" />
      <rect x="73" y="27" width="10" height="8" rx="1" fill="#bbf7d0" stroke="#16a34a" strokeWidth="0.5" />

      {/* Grafik Burndown Chart Mini */}
      <polyline points="10,44 26,42 45,41 60,38 86,46" fill="none" stroke="#3b82f6" strokeWidth="1" />

      {/* Kaki Stand Whiteboard */}
      <line x1="16" y1="52" x2="16" y2="57" stroke="#475569" strokeWidth="2.5" />
      <line x1="80" y1="52" x2="80" y2="57" stroke="#475569" strokeWidth="2.5" />
      <line x1="10" y1="57" x2="22" y2="57" stroke="#475569" strokeWidth="2.5" />
      <line x1="74" y1="57" x2="86" y2="57" stroke="#475569" strokeWidth="2.5" />
    </svg>
  </div>
);

// 2. Rak Buku & Dokumentasi Modern (Bookshelf)
export const BookshelfProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 66,
  h = 70,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Rak Buku & Arsip"
  >
    <svg viewBox="0 0 66 70" width={w} height={h} className="filter drop-shadow-md">
      {/* Rak Kayu Minimalis */}
      <rect x="2" y="2" width="62" height="66" rx="2" fill="#451a03" stroke="#260e02" strokeWidth="2" />
      <rect x="5" y="5" width="56" height="60" fill="#78350f" />

      {/* 3 Tingkat Rak */}
      <line x1="5" y1="25" x2="61" y2="25" stroke="#451a03" strokeWidth="2.5" />
      <line x1="5" y1="46" x2="61" y2="46" stroke="#451a03" strokeWidth="2.5" />

      {/* Buku Tingkat 1 */}
      <rect x="8" y="9" width="6" height="15" fill="#ef4444" rx="0.5" />
      <rect x="15" y="11" width="5" height="13" fill="#3b82f6" rx="0.5" />
      <rect x="21" y="8" width="7" height="16" fill="#10b981" rx="0.5" />
      <rect x="29" y="10" width="6" height="14" fill="#f59e0b" rx="0.5" />
      <rect x="36" y="12" width="8" height="12" fill="#8b5cf6" rx="0.5" />
      <rect x="45" y="9" width="6" height="15" fill="#06b6d4" rx="0.5" />
      <rect x="52" y="11" width="6" height="13" fill="#ec4899" rx="0.5" />

      {/* Buku Tingkat 2 (Sebagian miring) */}
      <rect x="8" y="28" width="8" height="17" fill="#3b82f6" rx="0.5" />
      <rect x="17" y="30" width="6" height="15" fill="#f97316" rx="0.5" />
      <rect x="24" y="29" width="7" height="16" fill="#10b981" rx="0.5" />
      {/* Binder / Folder */}
      <rect x="38" y="31" width="9" height="14" fill="#0284c7" rx="0.5" />
      <rect x="48" y="31" width="9" height="14" fill="#0284c7" rx="0.5" />

      {/* Tingkat 3 (Kotak Arsip & Tanaman kecil) */}
      <rect x="8" y="50" width="18" height="14" fill="#d97706" rx="1" stroke="#92400e" strokeWidth="0.5" />
      <rect x="29" y="50" width="18" height="14" fill="#475569" rx="1" stroke="#1e293b" strokeWidth="0.5" />
      {/* Tanaman Pot Mini */}
      <polygon points="53,62 58,62 57,56 54,56" fill="#ffffff" />
      <circle cx="55.5" cy="53" r="3" fill="#22c55e" />
    </svg>
  </div>
);

// 3. Galon Dispenser Air Mineral (Sangat Ikonik Kantor Indonesia!)
export const WaterDispenserProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 26,
  h = 56,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Dispenser & Galon Air Mineral"
  >
    <svg viewBox="0 0 26 56" width={w} height={h} className="filter drop-shadow-md">
      {/* Bodi Dispenser Putih */}
      <rect x="4" y="22" width="18" height="32" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      
      {/* Area Keran Air (Panas/Dingin) */}
      <rect x="7" y="28" width="12" height="12" rx="1.5" fill="#1e293b" />
      {/* Keran Merah (Hot) & Biru (Cold) */}
      <rect x="8.5" y="31" width="3" height="3" fill="#ef4444" rx="0.5" />
      <rect x="14.5" y="31" width="3" height="3" fill="#3b82f6" rx="0.5" />

      {/* Galon Air Biru Transparan di Atas */}
      <ellipse cx="13" cy="22" rx="6" ry="2" fill="#0284c7" />
      <rect x="7" y="6" width="12" height="15" rx="3" fill="#38bdf8" fillOpacity="0.8" stroke="#0284c7" strokeWidth="1" />
      <ellipse cx="13" cy="6" rx="5" ry="2" fill="#7dd3fc" />
      {/* Tutup Galon */}
      <rect x="10" y="2" width="6" height="4" fill="#0284c7" rx="1" />
      {/* Efek Kilau Air */}
      <line x1="9" y1="8" x2="9" y2="18" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  </div>
);

// 4. Mesin Printer & Scanner Kantor
export const PrinterStationProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 56,
  h = 56,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Printer & Scanner Kantor"
  >
    <svg viewBox="0 0 56 56" width={w} height={h} className="filter drop-shadow-md">
      {/* Meja Dudukan Printer */}
      <rect x="6" y="28" width="44" height="26" rx="2" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
      {/* Mesin Printer Modern */}
      <rect x="10" y="10" width="36" height="22" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Kaca Scanner */}
      <rect x="14" y="12" width="28" height="8" rx="1" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
      {/* Layar Kontrol LED */}
      <rect x="36" y="22" width="6" height="5" rx="0.5" fill="#0284c7" />
      {/* Baki Kertas Keluar */}
      <rect x="18" y="24" width="16" height="3" fill="#0f172a" />
      <rect x="19" y="23" width="14" height="2" fill="#ffffff" />
      {/* Lampu Status Hijau */}
      <circle cx="15" cy="25" r="1.2" fill="#22c55e" />
    </svg>
  </div>
);

// 5. Tanaman Hias Pot (Monstera Deliciosa)
export const PlantProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 46,
  h = 58,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Tanaman Hias Monstera"
  >
    <svg viewBox="0 0 46 58" width={w} height={h} className="filter drop-shadow-md">
      {/* Pot Keramik Putih / Terracotta */}
      <polygon points="12,38 34,38 31,56 15,56" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
      <ellipse cx="23" cy="38" rx="11" ry="2.5" fill="#78350f" />

      {/* Daun-daun Monstera Hijau Segar */}
      {/* Batang */}
      <path d="M 23,38 Q 21,26 15,16" fill="none" stroke="#16a34a" strokeWidth="1.5" />
      <path d="M 23,38 Q 25,24 33,18" fill="none" stroke="#16a34a" strokeWidth="1.5" />
      <path d="M 23,38 Q 23,20 23,10" fill="none" stroke="#15803d" strokeWidth="1.8" />

      {/* Daun 1 (Kiri) */}
      <ellipse cx="13" cy="15" rx="8" ry="6" fill="#22c55e" stroke="#15803d" strokeWidth="0.75" transform="rotate(-30 13 15)" />
      {/* Daun 2 (Kanan) */}
      <ellipse cx="34" cy="17" rx="8" ry="6" fill="#16a34a" stroke="#166534" strokeWidth="0.75" transform="rotate(35 34 17)" />
      {/* Daun 3 (Tengah Atas) */}
      <ellipse cx="23" cy="9" rx="8" ry="7" fill="#4ade80" stroke="#16a34a" strokeWidth="0.75" />
      {/* Daun 4 (Depan) */}
      <ellipse cx="20" cy="25" rx="7" ry="5" fill="#15803d" stroke="#14532d" strokeWidth="0.75" transform="rotate(-15 20 25)" />
    </svg>
  </div>
);

// 6. Sajadah Sholat Mewah Berpola Mihrab (Mushola)
export const SajadahProp: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  color?: string;
  borderColor?: string;
}> = ({
  x,
  y,
  w = 64,
  h = 44,
  color = '#047857',
  borderColor = '#f59e0b',
}) => (
  <div
    className="absolute pointer-events-none select-none z-0"
    style={{ left: x, top: y, width: w, height: h }}
  >
    <svg viewBox="0 0 64 44" width={w} height={h} className="filter drop-shadow-sm">
      {/* Karpet Sajadah Dasar */}
      <rect x="2" y="2" width="60" height="40" rx="3" fill={color} stroke={borderColor} strokeWidth="1.5" />
      
      {/* Garis Border Emas Dalam */}
      <rect x="5" y="5" width="54" height="34" rx="2" fill="none" stroke={borderColor} strokeWidth="0.75" strokeDasharray="3 1" />

      {/* Lengkungan Mihrab Kubah di Bagian Atas */}
      <path
        d="M 12,32 L 12,18 C 12,12 32,8 32,8 C 32,8 52,12 52,18 L 52,32 Z"
        fill="none"
        stroke={borderColor}
        strokeWidth="1.2"
        opacity="0.85"
      />

      {/* Ornamen Bintang Delapan / Motif Tengah */}
      <polygon points="32,18 35,22 39,22 36,25 38,29 32,27 26,29 28,25 25,22 29,22" fill={borderColor} opacity="0.7" />

      {/* Rumbai Sajadah di Ujung Kiri & Kanan */}
      <line x1="2" y1="2" x2="0" y2="4" stroke={borderColor} strokeWidth="1" />
      <line x1="2" y1="22" x2="0" y2="22" stroke={borderColor} strokeWidth="1" />
      <line x1="2" y1="42" x2="0" y2="44" stroke={borderColor} strokeWidth="1" />

      <line x1="62" y1="2" x2="64" y2="4" stroke={borderColor} strokeWidth="1" />
      <line x1="62" y1="22" x2="64" y2="22" stroke={borderColor} strokeWidth="1" />
      <line x1="62" y1="42" x2="64" y2="44" stroke={borderColor} strokeWidth="1" />
    </svg>
  </div>
);

// 7. Lemari Kitab Suci & Al-Qur'an (Mushola)
export const QuranCabinetProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 60,
  h = 72,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Lemari Kitab & Al-Qur'an"
  >
    <svg viewBox="0 0 60 72" width={w} height={h} className="filter drop-shadow-md">
      {/* Lemari Kayu Jati Berukir */}
      <rect x="2" y="2" width="56" height="68" rx="3" fill="#451a03" stroke="#260e02" strokeWidth="2" />
      <rect x="5" y="5" width="50" height="62" fill="#78350f" />

      {/* Lengkungan Kubah Islami di Atas Lemari */}
      <path d="M 8,18 Q 30,6 52,18" fill="none" stroke="#f59e0b" strokeWidth="1.5" />

      {/* 2 Rak Buku */}
      <line x1="5" y1="36" x2="55" y2="36" stroke="#451a03" strokeWidth="2" />

      {/* Mushaf Al-Quran dengan Pembatas Emas */}
      <rect x="9" y="19" width="7" height="15" fill="#047857" rx="1" stroke="#f59e0b" strokeWidth="0.8" />
      <rect x="17" y="20" width="7" height="14" fill="#047857" rx="1" stroke="#f59e0b" strokeWidth="0.8" />
      <rect x="25" y="19" width="7" height="15" fill="#1e3a8a" rx="1" stroke="#f59e0b" strokeWidth="0.8" />
      <rect x="33" y="20" width="7" height="14" fill="#047857" rx="1" stroke="#f59e0b" strokeWidth="0.8" />
      <rect x="41" y="19" width="8" height="15" fill="#701a75" rx="1" stroke="#f59e0b" strokeWidth="0.8" />

      {/* Mukena & Sajadah Terlipat di Rak Bawah */}
      <rect x="9" y="44" width="18" height="18" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="31" y="44" width="19" height="18" rx="2" fill="#065f46" stroke="#047857" strokeWidth="1" />
    </svg>
  </div>
);

// 8. Rak Sandal & Sepatu (Mushola)
export const ShoeRackProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 64,
  h = 42,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Rak Sandal & Sepatu"
  >
    <svg viewBox="0 0 64 42" width={w} height={h} className="filter drop-shadow-md">
      {/* Frame Rak Kayu Terbuka */}
      <rect x="2" y="2" width="60" height="38" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
      <rect x="5" y="5" width="54" height="32" fill="#92400e" />
      <line x1="5" y1="21" x2="59" y2="21" stroke="#451a03" strokeWidth="2" />

      {/* Sepatu & Sandal Jepit Berjajar */}
      {/* Tingkat 1 */}
      <ellipse cx="14" cy="13" rx="5" ry="3.5" fill="#1e293b" />
      <ellipse cx="26" cy="13" rx="5" ry="3.5" fill="#475569" />
      <ellipse cx="38" cy="13" rx="5" ry="3.5" fill="#3b82f6" />
      <ellipse cx="50" cy="13" rx="5" ry="3.5" fill="#10b981" />

      {/* Tingkat 2 */}
      <ellipse cx="14" cy="29" rx="5" ry="3.5" fill="#ef4444" />
      <ellipse cx="26" cy="29" rx="5" ry="3.5" fill="#f59e0b" />
      <ellipse cx="38" cy="29" rx="5" ry="3.5" fill="#8b5cf6" />
      <ellipse cx="50" cy="29" rx="5" ry="3.5" fill="#06b6d4" />
    </svg>
  </div>
);

// 9. Bilik Toilet Modern dengan Indikator LED (Restroom)
export const ToiletStallProp: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  isOccupied?: boolean;
}> = ({
  x,
  y,
  w = 76,
  h = 86,
  isOccupied = false,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title={isOccupied ? 'Bilik Toilet: Terisi' : 'Bilik Toilet: Kosong'}
  >
    <svg viewBox="0 0 76 86" width={w} height={h} className="filter drop-shadow-md">
      {/* Partisi Dinding Bilik */}
      <rect x="2" y="2" width="72" height="82" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
      {/* Panel Pintu Kayu Minimalis */}
      <rect x="6" y="6" width="64" height="74" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
      
      {/* Gagang Pintu Stainless Steel */}
      <rect x="12" y="44" width="4" height="12" rx="1.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
      
      {/* Lampu Status LED Indikator (Merah = Terisi, Hijau = Tersedia) */}
      <circle
        cx="38"
        cy="18"
        r="4"
        fill={isOccupied ? '#ef4444' : '#22c55e'}
        stroke="#ffffff"
        strokeWidth="1"
        className={isOccupied ? 'animate-pulse' : ''}
      />
      
      {/* Label Text Status */}
      <text
        x="38"
        y="32"
        fontSize="5"
        fontWeight="bold"
        fill={isOccupied ? '#fca5a5' : '#86efac'}
        fontFamily="sans-serif"
        textAnchor="middle"
      >
        {isOccupied ? 'TERISI' : 'TERSEDIA'}
      </text>
    </svg>
  </div>
);

// 10. Meja Wastafel Cermin (Restroom)
export const WashbasinProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 64,
  h = 58,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Wastafel Cermin & Cuci Tangan"
  >
    <svg viewBox="0 0 64 58" width={w} height={h} className="filter drop-shadow-md">
      {/* Cermin Dinding Besar Berlampu Backlit */}
      <rect x="8" y="2" width="48" height="26" rx="3" fill="#38bdf8" fillOpacity="0.3" stroke="#e2e8f0" strokeWidth="1.5" />
      <line x1="12" y1="6" x2="26" y2="24" stroke="#ffffff" strokeWidth="1" opacity="0.6" strokeLinecap="round" />

      {/* Meja Vanity Marmer Hitam */}
      <rect x="4" y="28" width="56" height="26" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

      {/* 2 Wastafel Porselen Putih Undermount */}
      <ellipse cx="20" cy="40" rx="9" ry="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <circle cx="20" cy="41" r="1.5" fill="#475569" />
      {/* Kran Air Chrome */}
      <path d="M 20,33 L 20,36 Q 20,38 18,38" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />

      <ellipse cx="44" cy="40" rx="9" ry="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <circle cx="44" cy="41" r="1.5" fill="#475569" />
      <path d="M 44,33 L 44,36 Q 44,38 42,38" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

// 11. Gerobak Kopi Aren Artisan (Taman Santai)
export const CoffeeCartProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 90,
  h = 80,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Gerobak Kopi Aren & Toast"
  >
    <svg viewBox="0 0 90 80" width={w} height={h} className="filter drop-shadow-lg">
      {/* Tenda Kopi Bergaris Merah Putih / Hijau Krem */}
      <polygon points="10,22 80,22 86,10 4,10" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
      <polygon points="18,22 32,22 36,10 22,10" fill="#ffffff" />
      <polygon points="46,22 60,22 64,10 50,10" fill="#ffffff" />
      <polygon points="74,22 80,22 86,10 78,10" fill="#ffffff" />

      {/* Tiang Penyangga Kayu */}
      <line x1="12" y1="22" x2="12" y2="40" stroke="#78350f" strokeWidth="2.5" />
      <line x1="78" y1="22" x2="78" y2="40" stroke="#78350f" strokeWidth="2.5" />

      {/* Meja Bar Kopi Kayu */}
      <rect x="8" y="40" width="74" height="24" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
      {/* Papan Tulis Menu Chalkboard */}
      <rect x="14" y="44" width="28" height="16" rx="1.5" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
      <text x="28" y="52" fontSize="4.5" fill="#fef08a" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">KOPI AREN</text>
      <text x="28" y="57" fontSize="3.5" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">Ice / Hot 15K</text>

      {/* Mesin Espresso / Teko Leher Angsa */}
      <rect x="52" y="32" width="12" height="8" rx="1" fill="#334155" stroke="#1e293b" strokeWidth="0.8" />
      <path d="M 68,36 Q 72,32 74,38" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />

      {/* 2 Cangkir Kopi Siap Saji */}
      <rect x="46" y="34" width="4" height="6" rx="0.5" fill="#ffffff" />
      <rect x="76" y="35" width="4" height="5" rx="0.5" fill="#ffffff" />

      {/* Roda Gerobak */}
      <circle cx="24" cy="68" r="8" fill="#451a03" stroke="#260e02" strokeWidth="2" />
      <circle cx="24" cy="68" r="3" fill="#d97706" />

      <circle cx="66" cy="68" r="8" fill="#451a03" stroke="#260e02" strokeWidth="2" />
      <circle cx="66" cy="68" r="3" fill="#d97706" />
    </svg>
  </div>
);

// 12. Bangku Taman Kayu (Park Bench)
export const ParkBenchProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 76,
  h = 44,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Bangku Taman Kayu"
  >
    <svg viewBox="0 0 76 44" width={w} height={h} className="filter drop-shadow-md">
      {/* Sandaran Kayu Slatted */}
      <rect x="6" y="8" width="64" height="4" rx="1" fill="#b45309" stroke="#78350f" strokeWidth="0.75" />
      <rect x="6" y="14" width="64" height="4" rx="1" fill="#d97706" stroke="#78350f" strokeWidth="0.75" />
      
      {/* Dudukan Bangku */}
      <rect x="4" y="22" width="68" height="6" rx="1.5" fill="#b45309" stroke="#78350f" strokeWidth="1" />

      {/* Rangka Besi Hitam Solid */}
      <path d="M 12,8 L 12,38 M 64,8 L 64,38" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <path d="M 8,38 L 16,38 M 60,38 L 68,38" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

// 13. Pohon Rindang Taman
export const ShadeTreeProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 110,
  h = 120,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Pohon Rindang Taman"
  >
    <svg viewBox="0 0 110 120" width={w} height={h} className="filter drop-shadow-xl">
      {/* Batang Pohon Kayu Kokoh */}
      <path d="M 50,70 Q 48,95 44,115 L 66,115 Q 62,95 60,70 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
      
      {/* Akar Pohon di Tanah */}
      <path d="M 44,112 Q 36,118 30,118" stroke="#78350f" strokeWidth="2.5" fill="none" />
      <path d="M 66,112 Q 74,118 80,118" stroke="#78350f" strokeWidth="2.5" fill="none" />

      {/* Kanopi Daun Berlapis (Lush Canopy Foliage) */}
      <circle cx="55" cy="52" r="38" fill="#15803d" opacity="0.9" />
      <circle cx="36" cy="46" r="28" fill="#16a34a" />
      <circle cx="74" cy="46" r="28" fill="#16a34a" />
      <circle cx="55" cy="34" r="30" fill="#22c55e" />
      <circle cx="44" cy="30" r="18" fill="#4ade80" opacity="0.6" />
      <circle cx="66" cy="32" r="16" fill="#86efac" opacity="0.5" />
    </svg>
  </div>
);

// 14. Gawang Mini Soccer (Taman)
export const SoccerGoalProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 95,
  h = 75,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Gawang Mini Soccer"
  >
    <svg viewBox="0 0 95 75" width={w} height={h} className="filter drop-shadow-md">
      {/* Jaring Belakang Gawang (Grid Pola) */}
      <polygon points="12,18 83,18 88,68 7,68" fill="#ffffff" fillOpacity="0.15" stroke="#ffffff" strokeWidth="0.75" strokeDasharray="3 3" />
      
      {/* Tiang Gawang Besi Putih */}
      <polyline points="12,68 12,18 83,18 83,68" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="12" y1="18" x2="4" y2="68" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="83" y1="18" x2="91" y2="68" stroke="#cbd5e1" strokeWidth="2" />
    </svg>
  </div>
);

// 15. Meja Kerja Workstation Modern (Dual-Monitor Developer Desk)
export const DeskProp: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
  chairColor?: string;
}> = ({ x, y, w = 84, h = 50, label, chairColor = '#1e293b' }) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title={label || 'Meja Kerja Workstation'}
  >
    <svg viewBox="0 0 84 50" width={w} height={h} className="filter drop-shadow-lg">
      {/* Kursi Ergonomis Mesh (Tampak atas / sedikit serong) */}
      <ellipse cx="42" cy="40" rx="14" ry="7" fill={chairColor} stroke="#0f172a" strokeWidth="1" />
      <ellipse cx="42" cy="43" rx="10" ry="3" fill="#334155" />
      {/* Sandaran Tangan Kursi */}
      <path d="M 27,37 L 27,42 M 57,37 L 57,42" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

      {/* Permukaan Meja Kayu Oak Hangat */}
      <rect x="2" y="8" width="80" height="28" rx="4" fill="#9a3412" stroke="#431407" strokeWidth="1.5" />
      <rect x="3" y="9" width="78" height="24" rx="3" fill="#b45309" />
      <rect x="5" y="11" width="74" height="20" rx="2" fill="#d97706" opacity="0.6" />

      {/* Deskmat Hitam Besar Anti-Slip */}
      <rect x="18" y="14" width="48" height="18" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="0.8" />

      {/* Monitor Utama (Kiri - IDE Editor Coding) */}
      <rect x="20" y="4" width="22" height="13" rx="1" fill="#020617" stroke="#334155" strokeWidth="1" />
      <rect x="21" y="5" width="20" height="10" rx="0.5" fill="#0f172a" />
      {/* Garis Kode Syntax di Monitor */}
      <line x1="23" y1="7" x2="31" y2="7" stroke="#38bdf8" strokeWidth="1" />
      <line x1="25" y1="9" x2="37" y2="9" stroke="#a855f7" strokeWidth="1" />
      <line x1="25" y1="11" x2="34" y2="11" stroke="#22c55e" strokeWidth="1" />
      <line x1="23" y1="13" x2="29" y2="13" stroke="#f59e0b" strokeWidth="1" />
      {/* Kaki Monitor */}
      <rect x="29" y="17" width="4" height="2" fill="#475569" />

      {/* Monitor Sekunder (Kanan - Analytics / Chat / Kanban) */}
      <rect x="44" y="5" width="20" height="12" rx="1" fill="#020617" stroke="#334155" strokeWidth="1" />
      <rect x="45" y="6" width="18" height="9" rx="0.5" fill="#0f172a" />
      {/* Chart Mini di Monitor 2 */}
      <polyline points="47,12 51,9 55,11 59,7" fill="none" stroke="#f43f5e" strokeWidth="1" />
      {/* Kaki Monitor 2 */}
      <rect x="52" y="17" width="4" height="2" fill="#475569" />

      {/* Keyboard Mekanikal */}
      <rect x="28" y="21" width="16" height="6" rx="1" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
      <line x1="30" y1="23" x2="42" y2="23" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="1.5 1" />
      <line x1="30" y1="25" x2="42" y2="25" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="1.5 1" />

      {/* Mouse Ergonomis */}
      <rect x="47" y="22" width="4" height="5" rx="1.5" fill="#334155" />

      {/* Cangkir Kopi Kantor */}
      <circle cx="12" cy="20" r="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
      <circle cx="12" cy="20" r="2" fill="#78350f" />

      {/* Sukulen / Tanaman Meja Mini */}
      <circle cx="73" cy="20" r="3.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
      <circle cx="73" cy="20" r="2.5" fill="#15803d" />

      {/* Label Nomor Meja Mini */}
      {label && (
        <text
          x="42"
          y="31"
          fontSize="4"
          fontWeight="bold"
          fill="#cbd5e1"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {label}
        </text>
      )}
    </svg>
  </div>
);

// 16. Lemari Server DevOps (Server Rack Enterprise dengan LED Berkedip)
export const ServerRackProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 54,
  h = 75,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="DevOps Server Rack & CI/CD Pipeline"
  >
    <svg viewBox="0 0 54 75" width={w} height={h} className="filter drop-shadow-xl">
      {/* Frame Rak Logam Hitam Tebal */}
      <rect x="2" y="2" width="50" height="71" rx="3" fill="#090d16" stroke="#1e293b" strokeWidth="2" />
      
      {/* Kaca Pintu Transparan Bergradien */}
      <rect x="5" y="5" width="44" height="65" rx="1.5" fill="#0f172a" fillOpacity="0.85" />
      
      {/* 5 Unit Blade Server Rack */}
      {[0, 1, 2, 3, 4].map((i) => {
        const sy = 8 + i * 12;
        return (
          <g key={i}>
            <rect x="7" y={sy} width="40" height="10" rx="1" fill="#020617" stroke="#334155" strokeWidth="0.75" />
            
            {/* Ventilasi Kisi-kisi Server */}
            <line x1="9" y1={sy + 3} x2="23" y2={sy + 3} stroke="#1e293b" strokeWidth="1" strokeDasharray="1.5 1" />
            <line x1="9" y1={sy + 6} x2="23" y2={sy + 6} stroke="#1e293b" strokeWidth="1" strokeDasharray="1.5 1" />

            {/* LED Status Server (Pulsing Green / Blue / Amber) */}
            <circle cx="28" cy={sy + 5} r="1.3" fill="#22c55e" className="animate-pulse" />
            <circle cx="32" cy={sy + 5} r="1.3" fill="#38bdf8" />
            <circle cx="36" cy={sy + 5} r="1.3" fill={i === 2 ? '#f59e0b' : '#22c55e'} />
            <circle cx="40" cy={sy + 5} r="1.3" fill="#22c55e" />

            {/* Kabel Patch Fiber Optik */}
            <path
              d={`M 43,${sy + 5} Q 46,${sy + 8} 44,${sy + 11}`}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="0.8"
            />
          </g>
        );
      })}

      {/* Kunci & Handle Pintu Server */}
      <rect x="44" y="32" width="2" height="10" rx="0.5" fill="#64748b" />
    </svg>
  </div>
);

// 17. Jam Dinding Jadwal Sholat Digital LED (Mushola)
export const AdhanClockProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 88,
  h = 36,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Jadwal Sholat Digital Mushola"
  >
    <svg viewBox="0 0 88 36" width={w} height={h} className="filter drop-shadow-md">
      {/* Bingkai Emas Islami */}
      <rect x="2" y="2" width="84" height="32" rx="4" fill="#042f2e" stroke="#ca8a04" strokeWidth="1.5" />
      
      {/* Kubah Siluet Mini */}
      <path d="M 38,2 Q 44,-2 50,2 Z" fill="#ca8a04" />

      {/* Jam Digital Utama (Hijau Neon) */}
      <rect x="6" y="6" width="30" height="14" rx="2" fill="#021a16" stroke="#0d9488" strokeWidth="0.8" />
      <text x="21" y="16" fontSize="8" fontWeight="bold" fill="#34d399" textAnchor="middle" fontFamily="monospace">
        15:45
      </text>

      {/* Label Mushola Al-Ikhlas */}
      <text x="60" y="11" fontSize="4.5" fontWeight="bold" fill="#fef08a" textAnchor="middle" fontFamily="sans-serif">
        MUSHOLA AL-IKHLAS
      </text>
      <text x="60" y="17" fontSize="3.5" fill="#99f6e4" textAnchor="middle" fontFamily="sans-serif">
        WAKTU SHOLAT WIB
      </text>

      {/* Bar Waktu Sholat 5 Waktu */}
      <rect x="6" y="22" width="76" height="9" rx="1.5" fill="#021a16" />
      <text x="13" y="28" fontSize="3.2" fill="#a7f3d0" textAnchor="middle" fontFamily="monospace">SBH 04:30</text>
      <text x="28" y="28" fontSize="3.2" fill="#a7f3d0" textAnchor="middle" fontFamily="monospace">DZH 12:02</text>
      <text x="44" y="28" fontSize="3.2" fill="#fbbf24" fontWeight="bold" textAnchor="middle" fontFamily="monospace">ASH 15:18</text>
      <text x="60" y="28" fontSize="3.2" fill="#a7f3d0" textAnchor="middle" fontFamily="monospace">MGB 17:58</text>
      <text x="75" y="28" fontSize="3.2" fill="#a7f3d0" textAnchor="middle" fontFamily="monospace">ISY 19:08</text>
    </svg>
  </div>
);

// 18. Mihrab Kiblat Lengkung (Mushola Arch Niche)
export const ImamNicheProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 64,
  h = 55,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Mihrab Imam Kiblat"
  >
    <svg viewBox="0 0 64 55" width={w} height={h} className="filter drop-shadow-md">
      {/* Lengkungan Kubah Mihrab */}
      <path
        d="M 6,52 L 6,24 C 6,6 32,-2 32,10 C 32,-2 58,6 58,24 L 58,52 Z"
        fill="#022c22"
        stroke="#ca8a04"
        strokeWidth="2"
      />
      {/* Garis Hiasan Ornamen Dalam */}
      <path
        d="M 12,52 L 12,25 C 12,12 32,4 32,14 C 32,4 52,12 52,25 L 52,52 Z"
        fill="#064e3b"
        stroke="#eab308"
        strokeWidth="1"
      />

      {/* Kaligrafi Medal Emas di Tengah */}
      <circle cx="32" cy="26" r="8" fill="#ca8a04" stroke="#fef08a" strokeWidth="1" />
      <text x="32" y="29" fontSize="6" fontWeight="bold" fill="#022c22" textAnchor="middle" fontFamily="sans-serif">
        الله
      </text>

      {/* Sajadah Imam Khusus di Depan Mihrab */}
      <rect x="18" y="38" width="28" height="14" rx="2" fill="#15803d" stroke="#fef08a" strokeWidth="1" />
      <rect x="22" y="40" width="20" height="10" rx="1" fill="#166534" />
    </svg>
  </div>
);

// 19. Rak Mukena & Sarung Tertata Rapi (Mushola)
export const PrayerGarmentRackProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 52,
  h = 48,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Rak Mukena & Sarung Bersih"
  >
    <svg viewBox="0 0 52 48" width={w} height={h} className="filter drop-shadow-md">
      {/* Rak Kayu Putih Bersih */}
      <rect x="2" y="2" width="48" height="44" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      
      {/* Tingkat 1: Mukena Putih & Pastel */}
      <line x1="4" y1="22" x2="48" y2="22" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="6" y="6" width="10" height="13" rx="1.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
      <rect x="18" y="7" width="10" height="12" rx="1.5" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
      <rect x="30" y="6" width="10" height="13" rx="1.5" fill="#e0e7ff" stroke="#a5b4fc" strokeWidth="0.8" />

      {/* Tingkat 2: Sarung Lipat Aneka Corak */}
      <rect x="6" y="26" width="11" height="15" rx="1" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="0.8" />
      <rect x="19" y="27" width="11" height="14" rx="1" fill="#065f46" stroke="#10b981" strokeWidth="0.8" />
      <rect x="32" y="26" width="11" height="15" rx="1" fill="#78350f" stroke="#d97706" strokeWidth="0.8" />
    </svg>
  </div>
);

// 20. Kolam Ikan Koi Taman (Outdoor Japanese Koi Pond)
export const KoiPondProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 110,
  h = 75,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Kolam Ikan Koi Santai"
  >
    <svg viewBox="0 0 110 75" width={w} height={h} className="filter drop-shadow-xl">
      {/* Bebatuan Alami Pinggir Kolam (Rock Rim) */}
      <ellipse cx="55" cy="38" rx="52" ry="34" fill="#334155" stroke="#1e293b" strokeWidth="3" />
      <ellipse cx="55" cy="38" rx="46" ry="28" fill="#475569" />

      {/* Air Kolam Biru Jernih */}
      <ellipse cx="55" cy="38" rx="42" ry="25" fill="#0284c7" />
      <ellipse cx="55" cy="38" rx="36" ry="20" fill="#0ea5e9" opacity="0.8" />

      {/* Gelombang Riak Air */}
      <path d="M 32,32 Q 42,30 52,32" fill="none" stroke="#bae6fd" strokeWidth="1" opacity="0.6" />
      <path d="M 58,44 Q 68,42 78,44" fill="none" stroke="#bae6fd" strokeWidth="1" opacity="0.6" />

      {/* Teratai & Daun Lotus Hijau */}
      <circle cx="34" cy="26" r="6" fill="#15803d" />
      <circle cx="34" cy="26" r="2" fill="#ec4899" /> {/* Bunga teratai pink */}

      <circle cx="78" cy="46" r="7" fill="#15803d" />
      <circle cx="78" cy="46" r="2.5" fill="#ffffff" />

      {/* 3 Ekor Ikan Koi Berenang (Orange-Putih Kohaku) */}
      {/* Koi 1 */}
      <g transform="translate(48, 30) rotate(-25)">
        <ellipse cx="0" cy="0" rx="7" ry="2.8" fill="#f97316" />
        <ellipse cx="-2" cy="0" rx="3" ry="2" fill="#ffffff" />
        <polygon points="-7,0 -11,-3 -11,3" fill="#ea580c" />
      </g>

      {/* Koi 2 */}
      <g transform="translate(68, 36) rotate(45)">
        <ellipse cx="0" cy="0" rx="6" ry="2.5" fill="#ffffff" />
        <circle cx="0" cy="0" r="2" fill="#ef4444" />
        <polygon points="-6,0 -9,-2.5 -9,2.5" fill="#ffffff" />
      </g>

      {/* Koi 3 */}
      <g transform="translate(42, 44) rotate(160)">
        <ellipse cx="0" cy="0" rx="5" ry="2.2" fill="#fbbf24" />
        <polygon points="-5,0 -8,-2 -8,2" fill="#f59e0b" />
      </g>
    </svg>
  </div>
);

// 21. Lampu Taman Tenaga Surya (Solar Garden Bollard Lamp)
export const GardenLampProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 28,
  h = 56,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Lampu Taman Warm Solar"
  >
    <svg viewBox="0 0 28 56" width={w} height={h} className="filter drop-shadow-md">
      {/* Cahaya Lingkaran di Tanah */}
      <ellipse cx="14" cy="50" rx="12" ry="5" fill="#fef08a" opacity="0.25" />

      {/* Tiang Besi Hitam */}
      <line x1="14" y1="20" x2="14" y2="52" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="14" cy="52" rx="4" ry="2" fill="#0f172a" />

      {/* Kap Lampu & Bohlam Menyala Hangat */}
      <polygon points="6,20 22,20 18,12 10,12" fill="#1e293b" />
      <rect x="9" y="16" width="10" height="7" rx="1.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
      <circle cx="14" cy="19" r="2.5" fill="#ffffff" />
    </svg>
  </div>
);

// 22. Meja Piknik Payung Taman (Outdoor Parasol Table)
export const PicnicUmbrellaTableProp: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 80,
  h = 76,
}) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{ left: x, top: y, width: w, height: h }}
    title="Meja Payung Santai Taman"
  >
    <svg viewBox="0 0 80 76" width={w} height={h} className="filter drop-shadow-xl">
      {/* Bayangan Meja di Rumput */}
      <ellipse cx="40" cy="62" rx="28" ry="10" fill="#022c22" opacity="0.6" />

      {/* Meja Bundar Kayu */}
      <ellipse cx="40" cy="54" rx="22" ry="9" fill="#9a3412" stroke="#431407" strokeWidth="1.5" />
      <ellipse cx="40" cy="52" rx="20" ry="7" fill="#b45309" />

      {/* 2 Bangku Bundar di Samping Meja */}
      <ellipse cx="16" cy="56" rx="8" ry="4" fill="#78350f" stroke="#431407" strokeWidth="1" />
      <ellipse cx="64" cy="56" rx="8" ry="4" fill="#78350f" stroke="#431407" strokeWidth="1" />

      {/* Tiang Payung Tengah */}
      <line x1="40" y1="20" x2="40" y2="52" stroke="#475569" strokeWidth="2.5" />

      {/* Kanopi Payung Lebar Bergaris Krem - Hijau / Kuning */}
      <polygon points="6,26 74,26 40,4" fill="#047857" stroke="#064e3b" strokeWidth="1.5" />
      <polygon points="18,26 34,26 40,4" fill="#fef08a" />
      <polygon points="46,26 62,26 40,4" fill="#fef08a" />

      {/* Puncak Topi Payung */}
      <circle cx="40" cy="4" r="2.5" fill="#f59e0b" />
    </svg>
  </div>
);

