// Konfigurasi tata letak logis denah kantor (1280 x 800)
// Sesuai spesifikasi PRD Kantor AI - Bagian 5 & 6

export interface Point {
  x: number;
  y: number;
}

export interface RoomDef {
  id: string;
  name: string;
  subname: string;
  x: number;
  y: number;
  w: number;
  h: number;
  floorTexture: string;
  floorBg: string;
  borderColor: string;
  accentColor: string;
}

export interface SlotDef {
  id: string;
  name: string;
  x: number;
  y: number;
  room: string;
}

export interface PropDef {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  image: string;
  zIndex?: number;
  title?: string;
}

export const STAGE_CONFIG = {
  width: 1280,
  height: 800,
  aspectRatio: 1280 / 800,
};

// 5.2 Koordinat Ruangan (1280 x 800)
export const ROOMS: Record<string, RoomDef> = {
  KANTOR: {
    id: 'KANTOR',
    name: 'RUANG KERJA UTAMA',
    subname: 'Open Workspace & Meja Kerja',
    x: 40,
    y: 40,
    w: 760,
    h: 430,
    floorTexture: '/sprites/floor_wood.png',
    floorBg: '#1e1b18',
    borderColor: '#b45309',
    accentColor: '#f59e0b',
  },
  MUSHOLA: {
    id: 'MUSHOLA',
    name: 'MUSHOLA AL-IKHLAS',
    subname: 'Area Ibadah & Ketenangan',
    x: 830,
    y: 40,
    w: 410,
    h: 250,
    floorTexture: '/sprites/floor_mushola.png',
    floorBg: '#062f28',
    borderColor: '#0d9488',
    accentColor: '#14b8a6',
  },
  TOILET: {
    id: 'TOILET',
    name: 'RESTROOM & TOILET',
    subname: 'Bilik Sanitasi & Wastafel',
    x: 830,
    y: 310,
    w: 410,
    h: 160,
    floorTexture: '/sprites/floor_toilet.png',
    floorBg: '#0f172a',
    borderColor: '#0284c7',
    accentColor: '#38bdf8',
  },
  LAPANGAN: {
    id: 'LAPANGAN',
    name: 'TAMAN & GAZEBO KOPI',
    subname: 'Outdoor Recreation & Break Area',
    x: 40,
    y: 500,
    w: 1200,
    h: 260,
    floorTexture: '/sprites/floor_grass.png',
    floorBg: '#064e3b',
    borderColor: '#059669',
    accentColor: '#10b981',
  },
};

// 5.3 Slot Posisi Tetap (7 Agent)
export const SLOTS = {
  // Meja Kerja 1 s/d 7 (Posisi duduk karakter di depan meja)
  DESK: [
    { id: 'desk_1', name: 'Papan Tulis (Ito - PM)', x: 140, y: 170, room: 'KANTOR' },
    { id: 'desk_2', name: 'Meja 2 (Avis - FE)', x: 300, y: 170, room: 'KANTOR' },
    { id: 'desk_3', name: 'Meja 3 (Zidane - BE)', x: 460, y: 170, room: 'KANTOR' },
    { id: 'desk_4', name: 'Meja 4 (Sinta - QA)', x: 620, y: 170, room: 'KANTOR' },
    { id: 'desk_5', name: 'Meja 5 (Muji - MK)', x: 220, y: 340, room: 'KANTOR' },
    { id: 'desk_6', name: 'Meja 6 (Laras - KT)', x: 380, y: 340, room: 'KANTOR' },
    { id: 'desk_7', name: 'Meja 7 (Kimi Hime - CS)', x: 540, y: 340, room: 'KANTOR' },
  ],

  // Area Apel Pagi / Standup (7 Slot Berbaris)
  STANDUP_AREA: [
    { id: 'standup_1', name: 'Apel 1', x: 100, y: 430, room: 'KANTOR' },
    { id: 'standup_2', name: 'Apel 2', x: 190, y: 430, room: 'KANTOR' },
    { id: 'standup_3', name: 'Apel 3', x: 280, y: 430, room: 'KANTOR' },
    { id: 'standup_4', name: 'Apel 4', x: 370, y: 430, room: 'KANTOR' },
    { id: 'standup_5', name: 'Apel 5', x: 460, y: 430, room: 'KANTOR' },
    { id: 'standup_6', name: 'Apel 6', x: 550, y: 430, room: 'KANTOR' },
    { id: 'standup_7', name: 'Apel 7', x: 640, y: 430, room: 'KANTOR' },
  ],

  // Sajadah Mushola (Shaf 1 & Shaf 2)
  MUSHOLA: [
    { id: 'sajadah_1', name: 'Shaf 1-1', x: 890, y: 110, room: 'MUSHOLA' },
    { id: 'sajadah_2', name: 'Shaf 1-2', x: 970, y: 110, room: 'MUSHOLA' },
    { id: 'sajadah_3', name: 'Shaf 1-3', x: 1050, y: 110, room: 'MUSHOLA' },
    { id: 'sajadah_4', name: 'Shaf 1-4', x: 1130, y: 110, room: 'MUSHOLA' },
    { id: 'sajadah_5', name: 'Shaf 2-1', x: 930, y: 210, room: 'MUSHOLA' },
    { id: 'sajadah_6', name: 'Shaf 2-2', x: 1010, y: 210, room: 'MUSHOLA' },
    { id: 'sajadah_7', name: 'Shaf 2-3', x: 1090, y: 210, room: 'MUSHOLA' },
  ],

  // Bilik Toilet
  TOILET: [
    { id: 'toilet_1', name: 'Bilik 1', x: 950, y: 410, room: 'TOILET' },
    { id: 'toilet_2', name: 'Bilik 2', x: 1110, y: 410, room: 'TOILET' },
    { id: 'toilet_3', name: 'Antrean 1', x: 900, y: 360, room: 'TOILET' },
    { id: 'toilet_4', name: 'Antrean 2', x: 1020, y: 360, room: 'TOILET' },
    { id: 'toilet_5', name: 'Antrean 3', x: 1140, y: 360, room: 'TOILET' },
    { id: 'toilet_6', name: 'Wastafel 1', x: 870, y: 380, room: 'TOILET' },
    { id: 'toilet_7', name: 'Wastafel 2', x: 870, y: 430, room: 'TOILET' },
  ],

  // Lapangan & Gazebo Santai
  LAPANGAN: [
    { id: 'lapangan_1', name: 'Pohon Santai', x: 140, y: 640, room: 'LAPANGAN' },
    { id: 'lapangan_2', name: 'Bangku Barat', x: 280, y: 690, room: 'LAPANGAN' },
    { id: 'lapangan_3', name: 'Kopi Aren', x: 440, y: 620, room: 'LAPANGAN' },
    { id: 'lapangan_4', name: 'Meja Santai', x: 600, y: 690, room: 'LAPANGAN' },
    { id: 'lapangan_5', name: 'Bangku Timur', x: 740, y: 620, room: 'LAPANGAN' },
    { id: 'lapangan_6', name: 'Taman Bunga', x: 900, y: 690, room: 'LAPANGAN' },
    { id: 'lapangan_7', name: 'Gawang Bola', x: 1080, y: 640, room: 'LAPANGAN' },
  ],
};

// Props Perabot yang ditaruh di denah arsitektur
export const PROPS: PropDef[] = [
  // RUANG KERJA - Perabot Dinding Belakang
  { id: 'whiteboard', type: 'whiteboard', x: 80, y: 50, w: 90, h: 50, image: '/sprites/furn_whiteboard.png', zIndex: 10, title: 'Whiteboard Sprint' },
  { id: 'bookshelf', type: 'bookshelf', x: 230, y: 45, w: 70, h: 60, image: '/sprites/furn_bookshelf.png', zIndex: 10, title: 'Rak Buku Dokumentasi' },
  { id: 'window_k1', type: 'window', x: 530, y: 45, w: 60, h: 45, image: '/sprites/furn_window.png', zIndex: 10, title: 'Jendela Kantor' },
  { id: 'window_k2', type: 'window', x: 660, y: 45, w: 60, h: 45, image: '/sprites/furn_window.png', zIndex: 10, title: 'Jendela Kantor' },
  { id: 'printer', type: 'printer', x: 55, y: 360, w: 60, h: 55, image: '/sprites/furn_printer.png', zIndex: 10, title: 'Mesin Printer & Scanner' },
  { id: 'plant_k1', type: 'plant', x: 50, y: 50, w: 45, h: 55, image: '/sprites/furn_plant.png', zIndex: 10, title: 'Tanaman Monstera' },
  { id: 'plant_k2', type: 'plant', x: 740, y: 50, w: 45, h: 55, image: '/sprites/furn_plant.png', zIndex: 10, title: 'Tanaman Sudut' },

  // RUANG KERJA - Meja Fisik di Posisi Kerja (y sedikit di bawah posisi duduk agar menutupi paha/meja)
  { id: 'desk_prop_1', type: 'desk', x: 105, y: 155, w: 80, h: 50, image: '/sprites/furn_desk.png', zIndex: 180, title: 'Meja 1' },
  { id: 'desk_prop_2', type: 'desk', x: 265, y: 155, w: 80, h: 50, image: '/sprites/furn_desk.png', zIndex: 180, title: 'Meja 2' },
  { id: 'desk_prop_3', type: 'desk', x: 425, y: 155, w: 80, h: 50, image: '/sprites/furn_desk.png', zIndex: 180, title: 'Meja 3' },
  { id: 'desk_prop_4', type: 'desk', x: 585, y: 155, w: 80, h: 50, image: '/sprites/furn_desk.png', zIndex: 180, title: 'Meja 4' },
  { id: 'desk_prop_5', type: 'desk', x: 185, y: 325, w: 80, h: 50, image: '/sprites/furn_desk.png', zIndex: 350, title: 'Meja 5' },
  { id: 'desk_prop_6', type: 'desk', x: 345, y: 325, w: 80, h: 50, image: '/sprites/furn_desk.png', zIndex: 350, title: 'Meja 6' },
  { id: 'desk_prop_7', type: 'desk', x: 505, y: 325, w: 80, h: 50, image: '/sprites/furn_desk.png', zIndex: 350, title: 'Meja 7' },

  // MUSHOLA - Perabot
  { id: 'quran_cab', type: 'quran_cabinet', x: 1160, y: 50, w: 60, h: 70, image: '/sprites/furn_quran_cabinet.png', zIndex: 10, title: 'Lemari Kitab & Al-Quran' },
  { id: 'mushola_win', type: 'window', x: 990, y: 45, w: 65, h: 50, image: '/sprites/furn_window.png', zIndex: 10, title: 'Jendela Mushola' },
  { id: 'shoe_rack', type: 'shoe_rack', x: 845, y: 220, w: 65, h: 45, image: '/sprites/furn_shoe_rack.png', zIndex: 20, title: 'Rak Sandal & Sepatu' },

  // MUSHOLA - Sajadah Karpet (Di bawah kaki karakter sholat)
  { id: 'sajadah_p1', type: 'sajadah', x: 865, y: 95, w: 60, h: 45, image: '/sprites/furn_sajadah_green.png', zIndex: 5 },
  { id: 'sajadah_p2', type: 'sajadah', x: 945, y: 95, w: 60, h: 45, image: '/sprites/furn_sajadah_blue.png', zIndex: 5 },
  { id: 'sajadah_p3', type: 'sajadah', x: 1025, y: 95, w: 60, h: 45, image: '/sprites/furn_sajadah_purple.png', zIndex: 5 },
  { id: 'sajadah_p4', type: 'sajadah', x: 1105, y: 95, w: 60, h: 45, image: '/sprites/furn_sajadah_red.png', zIndex: 5 },
  { id: 'sajadah_p5', type: 'sajadah', x: 905, y: 195, w: 60, h: 45, image: '/sprites/furn_sajadah_green.png', zIndex: 5 },
  { id: 'sajadah_p6', type: 'sajadah', x: 985, y: 195, w: 60, h: 45, image: '/sprites/furn_sajadah_blue.png', zIndex: 5 },
  { id: 'sajadah_p7', type: 'sajadah', x: 1065, y: 195, w: 60, h: 45, image: '/sprites/furn_sajadah_purple.png', zIndex: 5 },

  // RESTROOM / TOILET - Perabot
  { id: 'toilet_stall_1', type: 'stall', x: 920, y: 350, w: 75, h: 90, image: '/sprites/furn_toilet_stall.png', zIndex: 400, title: 'Bilik Toilet 1' },
  { id: 'toilet_stall_2', type: 'stall', x: 1080, y: 350, w: 75, h: 90, image: '/sprites/furn_toilet_stall.png', zIndex: 400, title: 'Bilik Toilet 2' },
  { id: 'washbasin', type: 'washbasin', x: 850, y: 330, w: 60, h: 55, image: '/sprites/furn_washbasin.png', zIndex: 10, title: 'Wastafel Cermin' },

  // LAPANGAN - Perabot Outdoor
  { id: 'tree_park', type: 'tree', x: 60, y: 520, w: 100, h: 120, image: '/sprites/furn_park_tree.png', zIndex: 15, title: 'Pohon Rindang' },
  { id: 'bench_1', type: 'bench', x: 260, y: 640, w: 80, h: 50, image: '/sprites/furn_park_bench.png', zIndex: 15, title: 'Bangku Taman' },
  { id: 'coffee_cart', type: 'coffee_cart', x: 440, y: 540, w: 90, h: 75, image: '/sprites/furn_coffee_cart.png', zIndex: 20, title: 'Gerobak Kopi Aren' },
  { id: 'bench_2', type: 'bench', x: 720, y: 640, w: 80, h: 50, image: '/sprites/furn_park_bench.png', zIndex: 15, title: 'Bangku Taman' },
  { id: 'soccer_goal', type: 'goal', x: 1110, y: 580, w: 95, h: 75, image: '/sprites/furn_soccer_goal.png', zIndex: 15, title: 'Gawang Mini Soccer' },
];

// 5.4 Graf Jalur Jalan (Waypoint Graph)
// Karakter berjalan sepanjang rute ini agar TIDAK MENEMBUS DINDING
export const WAYPOINTS: Record<string, Point> = {
  // Ruang Kerja (Aisles & Entrances)
  kantor_row1_aisle: { x: 380, y: 220 },
  kantor_row2_aisle: { x: 380, y: 380 },
  kantor_tengah: { x: 420, y: 300 },
  kantor_timur: { x: 780, y: 200 },       // Pintu timur ruang kerja ke lorong
  kantor_selatan: { x: 420, y: 460 },     // Pintu selatan ruang kerja ke lapangan
  kantor_apel: { x: 370, y: 420 },        // Titik kumpul apel pagi

  // Lorong Vertikal Penghubung
  lorong_atas: { x: 815, y: 150 },        // Pertigaan lorong ke mushola
  lorong_tengah: { x: 815, y: 200 },      // Depan pintu ruang kerja
  lorong_wc: { x: 815, y: 390 },          // Depan pintu toilet
  lorong_bawah: { x: 815, y: 510 },       // Ujung lorong tembus ke lapangan

  // Mushola
  mushola_pintu: { x: 860, y: 150 },      // Pintu masuk mushola
  mushola_aisle: { x: 950, y: 160 },      // Koridor tengah antara shaf 1 & shaf 2
  mushola_shaf1: { x: 1010, y: 110 },     // Shaf 1
  mushola_shaf2: { x: 1010, y: 210 },     // Shaf 2

  // Toilet
  toilet_pintu: { x: 860, y: 390 },       // Pintu masuk toilet
  toilet_aisle: { x: 920, y: 390 },       // Lorong wastafel
  toilet_bilik1: { x: 950, y: 400 },      // Depan bilik 1
  toilet_bilik2: { x: 1110, y: 400 },     // Depan bilik 2

  // Lapangan Outdoor
  lapangan_masuk: { x: 420, y: 530 },     // Pintu keluar dari kantor ke lapangan
  lapangan_lorong: { x: 815, y: 550 },    // Pintu keluar dari lorong ke lapangan
  lapangan_jalan_barat: { x: 260, y: 580 },
  lapangan_jalan_tengah: { x: 550, y: 580 },
  lapangan_jalan_timur: { x: 900, y: 580 },
};

// Hubungan Antar Waypoint (Edges Berarah & Jarak)
export const GRAPH_EDGES: Array<[string, string]> = [
  // Di dalam Ruang Kerja
  ['kantor_row1_aisle', 'kantor_tengah'],
  ['kantor_row2_aisle', 'kantor_tengah'],
  ['kantor_tengah', 'kantor_timur'],
  ['kantor_tengah', 'kantor_selatan'],
  ['kantor_selatan', 'kantor_apel'],

  // Ruang Kerja ke Lorong
  ['kantor_timur', 'lorong_tengah'],

  // Lorong Vertikal
  ['lorong_tengah', 'lorong_atas'],
  ['lorong_tengah', 'lorong_wc'],
  ['lorong_wc', 'lorong_bawah'],

  // Lorong ke Mushola
  ['lorong_atas', 'mushola_pintu'],
  ['mushola_pintu', 'mushola_aisle'],
  ['mushola_aisle', 'mushola_shaf1'],
  ['mushola_aisle', 'mushola_shaf2'],

  // Lorong ke Toilet
  ['lorong_wc', 'toilet_pintu'],
  ['toilet_pintu', 'toilet_aisle'],
  ['toilet_aisle', 'toilet_bilik1'],
  ['toilet_aisle', 'toilet_bilik2'],

  // Kantor ke Lapangan
  ['kantor_selatan', 'lapangan_masuk'],

  // Lorong ke Lapangan
  ['lorong_bawah', 'lapangan_lorong'],

  // Jalur di Lapangan
  ['lapangan_masuk', 'lapangan_jalan_barat'],
  ['lapangan_masuk', 'lapangan_jalan_tengah'],
  ['lapangan_lorong', 'lapangan_jalan_tengah'],
  ['lapangan_lorong', 'lapangan_jalan_timur'],
  ['lapangan_jalan_barat', 'lapangan_jalan_tengah'],
  ['lapangan_jalan_tengah', 'lapangan_jalan_timur'],
];

// Helper: hitung jarak euclid
export function distance(p1: Point, p2: Point): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// ============================================================================
// 5.4B Graf Jalur 3D Denah Master Plan (Akurat dengan Kusen Pintu & Lorong)
// ============================================================================
export const WAYPOINTS_3D: Record<string, Point> = {
  // --- RUANG KERJA UTAMA (Interior Aisles & Doorway) ---
  kantor_3d_aisle_north: { x: 370, y: 260 },   // Lorong meja atas (Dewi, Bima, Ari)
  kantor_3d_aisle_center: { x: 390, y: 340 },  // Lorong meja tengah (Sinta, Laras)
  kantor_3d_aisle_south: { x: 350, y: 440 },   // Lorong meja bawah (Dimas, Naya) & Standup
  kantor_3d_gathering: { x: 480, y: 340 },     // Titik kumpul tengah ruang kerja
  kantor_3d_east_aisle: { x: 560, y: 340 },    // Lorong dalam menuju pintu keluar
  kantor_3d_door_inside: { x: 615, y: 340 },   // Depan kusen dalam pintu kantor
  kantor_3d_door_threshold: { x: 645, y: 340 },// Ambang pintu keluar ruang kerja

  // --- KORIDOR LANTAI KAYU GELAP (Corridor Spine) ---
  corridor_3d_outside_office: { x: 680, y: 340 }, // Di koridor tepat depan pintu kantor
  corridor_3d_to_mushola: { x: 720, y: 295 },     // Tikungan koridor arah mushola
  corridor_3d_outside_mushola: { x: 745, y: 280 },// Depan pintu masuk mushola
  corridor_3d_to_toilet: { x: 760, y: 360 },      // Tikungan koridor arah toilet
  corridor_3d_toilet_mid: { x: 840, y: 385 },     // Koridor depan toilet
  corridor_3d_outside_toilet: { x: 910, y: 395 }, // Depan pintu masuk toilet
  corridor_3d_to_garden: { x: 620, y: 420 },      // Koridor arah taman/gapura
  corridor_3d_outside_garden: { x: 580, y: 470 }, // Tepat depan gapura taman

  // --- MUSHOLA AL-IKHLAS ---
  mushola_3d_door_threshold: { x: 770, y: 270 }, // Ambang pintu masuk mushola (kusen kayu)
  mushola_3d_aisle: { x: 815, y: 255 },          // Koridor dalam mushola
  mushola_3d_shaf1_entry: { x: 860, y: 235 },    // Depan Shaf 1 (baris depan)
  mushola_3d_shaf2_entry: { x: 830, y: 275 },    // Depan Shaf 2 (baris belakang)

  // --- RESTROOM & TOILET ---
  toilet_3d_door_threshold: { x: 940, y: 400 },  // Ambang pintu masuk toilet
  toilet_3d_sink_aisle: { x: 955, y: 435 },      // Lorong depan wastafel
  toilet_3d_cubicle_aisle: { x: 1030, y: 440 },  // Lorong depan bilik kloset

  // --- TAMAN & GAZEBO KOPI ---
  taman_3d_gate_threshold: { x: 560, y: 510 },   // Ambang pintu gapura kayu masuk taman
  taman_3d_path_start: { x: 565, y: 540 },       // Awal jalan setapak batu
  taman_3d_path_curve1: { x: 605, y: 585 },      // Tikungan 1 jalan setapak batu
  taman_3d_coffee_front: { x: 675, y: 595 },     // Di depan gerobak kopi aren
  taman_3d_path_curve2: { x: 640, y: 650 },      // Tikungan 2 jalan setapak batu
  taman_3d_path_south: { x: 670, y: 710 },       // Ujung selatan jalan setapak batu
  taman_3d_bench_west: { x: 500, y: 630 },       // Dekat bangku taman barat
  taman_3d_bench_east: { x: 780, y: 670 },       // Dekat bangku taman timur & pohon
};

export const GRAPH_EDGES_3D: Array<[string, string]> = [
  // Dalam Ruang Kerja:
  ['kantor_3d_aisle_north', 'kantor_3d_gathering'],
  ['kantor_3d_aisle_center', 'kantor_3d_gathering'],
  ['kantor_3d_aisle_south', 'kantor_3d_gathering'],
  ['kantor_3d_gathering', 'kantor_3d_east_aisle'],
  ['kantor_3d_east_aisle', 'kantor_3d_door_inside'],
  ['kantor_3d_door_inside', 'kantor_3d_door_threshold'],

  // Pintu Kantor ke Koridor:
  ['kantor_3d_door_threshold', 'corridor_3d_outside_office'],

  // Koridor Utama:
  ['corridor_3d_outside_office', 'corridor_3d_to_mushola'],
  ['corridor_3d_to_mushola', 'corridor_3d_outside_mushola'],

  ['corridor_3d_outside_office', 'corridor_3d_to_toilet'],
  ['corridor_3d_to_toilet', 'corridor_3d_toilet_mid'],
  ['corridor_3d_toilet_mid', 'corridor_3d_outside_toilet'],

  ['corridor_3d_outside_office', 'corridor_3d_to_garden'],
  ['corridor_3d_to_garden', 'corridor_3d_outside_garden'],

  // Koridor ke Mushola:
  ['corridor_3d_outside_mushola', 'mushola_3d_door_threshold'],
  ['mushola_3d_door_threshold', 'mushola_3d_aisle'],
  ['mushola_3d_aisle', 'mushola_3d_shaf1_entry'],
  ['mushola_3d_aisle', 'mushola_3d_shaf2_entry'],

  // Koridor ke Toilet:
  ['corridor_3d_outside_toilet', 'toilet_3d_door_threshold'],
  ['toilet_3d_door_threshold', 'toilet_3d_sink_aisle'],
  ['toilet_3d_sink_aisle', 'toilet_3d_cubicle_aisle'],

  // Koridor ke Taman:
  ['corridor_3d_outside_garden', 'taman_3d_gate_threshold'],
  ['taman_3d_gate_threshold', 'taman_3d_path_start'],
  ['taman_3d_path_start', 'taman_3d_path_curve1'],
  ['taman_3d_path_curve1', 'taman_3d_coffee_front'],
  ['taman_3d_path_curve1', 'taman_3d_bench_west'],
  ['taman_3d_path_curve1', 'taman_3d_path_curve2'],
  ['taman_3d_path_curve2', 'taman_3d_path_south'],
  ['taman_3d_coffee_front', 'taman_3d_bench_east'],
  ['taman_3d_path_south', 'taman_3d_bench_east'],
];

// Hubungkan titik bebas 2D ke waypoint terdekat yang logis
export function getClosestWaypointKey(pos: Point, roomHint?: string): string {
  let closestKey = 'kantor_tengah';
  let minD = Infinity;

  const candidates: string[] = [];

  if (roomHint === 'MUSHOLA' || (pos.x >= 830 && pos.y < 280)) {
    candidates.push('mushola_aisle', 'mushola_shaf1', 'mushola_shaf2', 'mushola_pintu');
  } else if (roomHint === 'TOILET' || (pos.x >= 830 && pos.y >= 280 && pos.y < 480)) {
    candidates.push('toilet_aisle', 'toilet_bilik1', 'toilet_bilik2', 'toilet_pintu');
  } else if (roomHint === 'LAPANGAN' || pos.y >= 480) {
    candidates.push('lapangan_masuk', 'lapangan_lorong', 'lapangan_jalan_barat', 'lapangan_jalan_tengah', 'lapangan_jalan_timur');
  } else {
    // KANTOR
    if (pos.y < 250) {
      candidates.push('kantor_row1_aisle', 'kantor_tengah');
    } else if (pos.y < 390) {
      candidates.push('kantor_row2_aisle', 'kantor_tengah');
    } else {
      candidates.push('kantor_apel', 'kantor_selatan', 'kantor_row2_aisle');
    }
  }

  for (const key of candidates) {
    const wp = WAYPOINTS[key];
    if (!wp) continue;
    const d = distance(pos, wp);
    if (d < minD) {
      minD = d;
      closestKey = key;
    }
  }

  return closestKey;
}

// Hubungkan titik bebas 3D ke waypoint terdekat yang logis
export function getClosestWaypointKey3D(pos: Point, roomHint?: string): string {
  let closestKey = 'kantor_3d_gathering';
  let minD = Infinity;

  const candidates: string[] = [];

  if (roomHint === 'MUSHOLA' || (pos.x >= 730 && pos.y < 330)) {
    candidates.push('mushola_3d_aisle', 'mushola_3d_shaf1_entry', 'mushola_3d_shaf2_entry', 'mushola_3d_door_threshold');
  } else if (roomHint === 'TOILET' || (pos.x >= 860 && pos.y >= 350 && pos.y < 550)) {
    candidates.push('toilet_3d_sink_aisle', 'toilet_3d_cubicle_aisle', 'toilet_3d_door_threshold');
  } else if (roomHint === 'LAPANGAN' || pos.y >= 530) {
    candidates.push('taman_3d_path_start', 'taman_3d_path_curve1', 'taman_3d_coffee_front', 'taman_3d_bench_west', 'taman_3d_bench_east', 'taman_3d_path_south');
  } else {
    // KANTOR 3D
    if (pos.y < 290) {
      candidates.push('kantor_3d_aisle_north', 'kantor_3d_gathering');
    } else if (pos.y < 380) {
      candidates.push('kantor_3d_aisle_center', 'kantor_3d_gathering', 'kantor_3d_east_aisle');
    } else {
      candidates.push('kantor_3d_aisle_south', 'kantor_3d_gathering');
    }
  }

  for (const key of candidates) {
    const wp = WAYPOINTS_3D[key];
    if (!wp) continue;
    const d = distance(pos, wp);
    if (d < minD) {
      minD = d;
      closestKey = key;
    }
  }

  return closestKey;
}

// Algoritma Dijkstra umum mencari rute terpendek antar waypoint
export function findShortestPathBetweenWaypointsGeneric(
  startKey: string,
  endKey: string,
  waypointMap: Record<string, Point>,
  edgeList: Array<[string, string]>
): string[] {
  if (startKey === endKey) return [startKey];

  const adj: Record<string, Array<{ node: string; weight: number }>> = {};
  for (const k of Object.keys(waypointMap)) {
    adj[k] = [];
  }

  for (const [u, v] of edgeList) {
    if (!waypointMap[u] || !waypointMap[v]) continue;
    const w = distance(waypointMap[u], waypointMap[v]);
    adj[u].push({ node: v, weight: w });
    adj[v].push({ node: u, weight: w });
  }

  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  for (const k of Object.keys(waypointMap)) {
    dist[k] = Infinity;
    prev[k] = null;
    unvisited.add(k);
  }

  dist[startKey] = 0;

  while (unvisited.size > 0) {
    let current: string | null = null;
    let shortest = Infinity;
    for (const node of unvisited) {
      if (dist[node] < shortest) {
        shortest = dist[node];
        current = node;
      }
    }

    if (!current || dist[current] === Infinity) break;
    if (current === endKey) break;

    unvisited.delete(current);

    for (const neighbor of adj[current]) {
      if (!unvisited.has(neighbor.node)) continue;
      const alt = dist[current] + neighbor.weight;
      if (alt < dist[neighbor.node]) {
        dist[neighbor.node] = alt;
        prev[neighbor.node] = current;
      }
    }
  }

  const path: string[] = [];
  let curr: string | null = endKey;
  while (curr) {
    path.unshift(curr);
    curr = prev[curr];
  }

  if (path[0] !== startKey) {
    return [startKey, endKey];
  }

  return path;
}

// Wrapper backward compatible untuk 2D
export function findShortestPathBetweenWaypoints(startKey: string, endKey: string): string[] {
  return findShortestPathBetweenWaypointsGeneric(startKey, endKey, WAYPOINTS, GRAPH_EDGES);
}

/**
 * Menghaluskan sudut belokan rute (corner filleting menggunakan Bézier quadratic)
 * Mengubah belokan tajam 90 derajat menjadi lengkungan halus alami
 */
export function smoothPathCorners(rawPath: Point[], filletRadius = 20): Point[] {
  if (rawPath.length <= 2) return rawPath;

  const smoothed: Point[] = [rawPath[0]];

  for (let i = 1; i < rawPath.length - 1; i++) {
    const p0 = smoothed[smoothed.length - 1]; // titik sebelumnya
    const p1 = rawPath[i];                     // titik sudut saat ini
    const p2 = rawPath[i + 1];                 // titik selanjutnya

    const v1x = p0.x - p1.x;
    const v1y = p0.y - p1.y;
    const d1 = Math.hypot(v1x, v1y);

    const v2x = p2.x - p1.x;
    const v2y = p2.y - p1.y;
    const d2 = Math.hypot(v2x, v2y);

    // Jika jarak terlalu pendek, tidak perlu dibulatkan
    if (d1 < 10 || d2 < 10) {
      smoothed.push(p1);
      continue;
    }

    // Hitung dot product untuk melihat apakah ini belokan
    const dot = (v1x * v2x + v1y * v2y) / (d1 * d2);
    // Jika hampir lurus (dot dekat -1), pertahankan p1
    if (dot < -0.96) {
      smoothed.push(p1);
      continue;
    }

    // Batasi radius agar tidak melebihi setengah panjang segmen
    const r = Math.min(filletRadius, d1 * 0.45, d2 * 0.45);

    // Titik awal lengkungan pada segmen masuk
    const ax = p1.x + (v1x / d1) * r;
    const ay = p1.y + (v1y / d1) * r;

    // Titik akhir lengkungan pada segmen keluar
    const bx = p1.x + (v2x / d2) * r;
    const by = p1.y + (v2y / d2) * r;

    // Tambahkan titik busur lengkungan halus
    smoothed.push({ x: ax, y: ay });

    // Titik tengah lengkungan: Q(0.5) = 0.25*A + 0.5*P1 + 0.25*B
    const mx = 0.25 * ax + 0.5 * p1.x + 0.25 * bx;
    const my = 0.25 * ay + 0.5 * p1.y + 0.25 * by;
    smoothed.push({ x: mx, y: my });

    smoothed.push({ x: bx, y: by });
  }

  smoothed.push(rawPath[rawPath.length - 1]);

  // Saring titik-titik yang terlalu berdekatan (< 4px)
  const filtered: Point[] = [smoothed[0]];
  for (let i = 1; i < smoothed.length; i++) {
    const prev = filtered[filtered.length - 1];
    const curr = smoothed[i];
    if (Math.hypot(curr.x - prev.x, curr.y - prev.y) >= 4) {
      filtered.push(curr);
    }
  }

  return filtered;
}

// Menghasilkan daftar titik koordinat utuh dari titik asal sampai titik tujuan
export function calculateNavigationRoute(
  startPos: Point,
  targetPos: Point,
  startRoomHint?: string,
  targetRoomHint?: string,
  is3D = false
): Point[] {
  // Jika jarak sangat dekat (< 30px di ruangan yang sama), langsung jalan lurus
  if (distance(startPos, targetPos) < 35 && startRoomHint === targetRoomHint) {
    return [startPos, targetPos];
  }

  const wpMap = is3D ? WAYPOINTS_3D : WAYPOINTS;
  const edgeList = is3D ? GRAPH_EDGES_3D : GRAPH_EDGES;

  const startWpKey = is3D
    ? getClosestWaypointKey3D(startPos, startRoomHint)
    : getClosestWaypointKey(startPos, startRoomHint);

  const endWpKey = is3D
    ? getClosestWaypointKey3D(targetPos, targetRoomHint)
    : getClosestWaypointKey(targetPos, targetRoomHint);

  const wpKeys = findShortestPathBetweenWaypointsGeneric(startWpKey, endWpKey, wpMap, edgeList);

  const rawRoute: Point[] = [startPos];

  for (const key of wpKeys) {
    const pt = wpMap[key];
    if (pt) {
      const last = rawRoute[rawRoute.length - 1];
      if (distance(last, pt) > 5) {
        rawRoute.push(pt);
      }
    }
  }

  // Tambahkan titik tujuan akhir
  const last = rawRoute[rawRoute.length - 1];
  if (distance(last, targetPos) > 5) {
    rawRoute.push(targetPos);
  }

  // Terapkan penghalusan sudut (Corner Filleting) agar belokan seperti manusia berjalan
  return smoothPathCorners(rawRoute, is3D ? 22 : 16);
}

// 5.3B Slot Posisi Khusus Denah 3D Master Plan
export const SLOTS_3D = {
  DESK: [
    { id: 'desk_3d_1', name: 'Papan Tulis Sprint (Ito - PM)', x: 230, y: 250, room: 'KANTOR' },
    { id: 'desk_3d_2', name: 'Meja 2 (Avis - FE)', x: 380, y: 220, room: 'KANTOR' },
    { id: 'desk_3d_3', name: 'Meja 3 (Zidane - BE)', x: 500, y: 250, room: 'KANTOR' },
    { id: 'desk_3d_4', name: 'Meja 4 (Sinta - QA)', x: 330, y: 340, room: 'KANTOR' },
    { id: 'desk_3d_5', name: 'Meja 5 (Muji - MK)', x: 440, y: 340, room: 'KANTOR' },
    { id: 'desk_3d_6', name: 'Meja 6 (Laras - KT)', x: 240, y: 440, room: 'KANTOR' },
    { id: 'desk_3d_7', name: 'Meja 7 (Kimi Hime - CS)', x: 330, y: 520, room: 'KANTOR' },
  ],
  STANDUP_AREA: [
    { id: 'standup_3d_1', name: 'Apel 1', x: 190, y: 390, room: 'KANTOR' },
    { id: 'standup_3d_2', name: 'Apel 2', x: 250, y: 390, room: 'KANTOR' },
    { id: 'standup_3d_3', name: 'Apel 3', x: 310, y: 390, room: 'KANTOR' },
    { id: 'standup_3d_4', name: 'Apel 4', x: 370, y: 390, room: 'KANTOR' },
    { id: 'standup_3d_5', name: 'Apel 5', x: 430, y: 390, room: 'KANTOR' },
    { id: 'standup_3d_6', name: 'Apel 6', x: 490, y: 390, room: 'KANTOR' },
    { id: 'standup_3d_7', name: 'Apel 7', x: 550, y: 390, room: 'KANTOR' },
  ],
  MUSHOLA: [
    { id: 'sajadah_3d_1', name: 'Shaf 1-1', x: 800, y: 200, room: 'MUSHOLA' },
    { id: 'sajadah_3d_2', name: 'Shaf 1-2', x: 860, y: 230, room: 'MUSHOLA' },
    { id: 'sajadah_3d_3', name: 'Shaf 1-3', x: 920, y: 260, room: 'MUSHOLA' },
    { id: 'sajadah_3d_4', name: 'Shaf 1-4', x: 980, y: 290, room: 'MUSHOLA' },
    { id: 'sajadah_3d_5', name: 'Shaf 2-1', x: 770, y: 230, room: 'MUSHOLA' },
    { id: 'sajadah_3d_6', name: 'Shaf 2-2', x: 830, y: 260, room: 'MUSHOLA' },
    { id: 'sajadah_3d_7', name: 'Shaf 2-3', x: 890, y: 290, room: 'MUSHOLA' },
  ],
  TOILET: [
    { id: 'toilet_3d_1', name: 'Wastafel', x: 930, y: 460, room: 'TOILET' },
    { id: 'toilet_3d_2', name: 'Bilik 1', x: 1040, y: 460, room: 'TOILET' },
    { id: 'toilet_3d_3', name: 'Bilik 2', x: 1100, y: 490, room: 'TOILET' },
    { id: 'toilet_3d_4', name: 'Antrean', x: 990, y: 460, room: 'TOILET' },
  ],
  LAPANGAN: [
    { id: 'lapangan_3d_1', name: 'Bangku Barat', x: 480, y: 640, room: 'LAPANGAN' },
    { id: 'lapangan_3d_2', name: 'Jalan Setapak', x: 550, y: 680, room: 'LAPANGAN' },
    { id: 'lapangan_3d_3', name: 'Kopi Aren', x: 690, y: 630, room: 'LAPANGAN' },
    { id: 'lapangan_3d_4', name: 'Bangku Timur', x: 790, y: 680, room: 'LAPANGAN' },
    { id: 'lapangan_3d_5', name: 'Taman Rumput', x: 620, y: 730, room: 'LAPANGAN' },
    { id: 'lapangan_3d_6', name: 'Bawah Pohon', x: 860, y: 660, room: 'LAPANGAN' },
    { id: 'lapangan_3d_7', name: 'Taman Selatan', x: 740, y: 740, room: 'LAPANGAN' },
  ],
};

// Ambil slot koordinat untuk agent berdasarkan lokasi, index agent, dan mode denah
export function getAgentSlot(location: string, agentIndex: number, is3D = false): Point {
  const slotSource = is3D ? SLOTS_3D : SLOTS;
  const idx = Math.max(0, agentIndex % 7);
  switch (location) {
    case 'DESK':
      return slotSource.DESK[idx] || slotSource.DESK[0];
    case 'STANDUP_AREA':
      return slotSource.STANDUP_AREA[idx] || slotSource.STANDUP_AREA[0];
    case 'MUSHOLA':
      return slotSource.MUSHOLA[idx] || slotSource.MUSHOLA[0];
    case 'TOILET':
      return slotSource.TOILET[idx % slotSource.TOILET.length] || slotSource.TOILET[0];
    case 'LAPANGAN':
      return slotSource.LAPANGAN[idx] || slotSource.LAPANGAN[0];
    default:
      return slotSource.DESK[idx] || slotSource.DESK[0];
  }
}

