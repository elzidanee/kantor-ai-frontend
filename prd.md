# Frontend Kantor AI: Spesifikasi Visual dan Implementasi

Dokumen ini adalah panduan membangun **Fase 6 dan 7 (bagian Frontend)** dari `roadmap_kantor_ai.md`. Backend (`kantor-ai-backend`, port 3000) sudah menyelesaikan Fase 0 sampai 5, jadi frontend tinggal mengonsumsi REST API dan SSE yang ada.

Dokumen pendamping:
- `Prompt-Asset-Kantor-AI.md`: prompt untuk membuat aset gambar di ChatGPT.
- `roadmap_kantor_ai.md`: pembagian tugas backend dan frontend.

| | |
|---|---|
| Versi | 0.1 |
| Tanggal | 7 Oktober 2026 |
| Folder proyek | `kantor-ai-frontend` (terpisah dari backend) |
| Bahasa antarmuka | Indonesia |

---

## 1. Tujuan dan prinsip

### Tujuan
1. Menampilkan kantor yang **terasa hidup**: karakter bergerak, bicara lewat balon, dan berpindah ruangan sesuai data nyata dari backend.
2. Membuat owner bisa mengelola semuanya (agent, tugas, target, jadwal, biaya) tanpa menyentuh terminal.
3. Tetap enak dipakai di ponsel, karena owner sering hanya ingin mengecek dan menyetujui hasil.

### Prinsip
1. **Data nyata, bukan dekorasi.** Setiap animasi punya sumber di event backend. Tidak ada gerak yang berpura-pura.
2. **Denah di layar utama.** Halaman pertama yang dilihat adalah kantor, bukan tabel.
3. **Aset opsional di awal.** Seluruh fitur harus jalan dengan karakter gambar-kode (SVG/CSS) lebih dulu. Aset PNG dari ChatGPT menggantikannya belakangan tanpa mengubah logika.
4. **Mode demo tanpa backend.** Ada pembangkit event palsu supaya tampilan bisa dikembangkan dan diuji tanpa menjalankan backend.
5. **Gerak punya makna.** Berjalan berarti berpindah, mengetik berarti bekerja, tertidur berarti kantor tutup. Selain itu tidak ada animasi pajangan yang mengganggu.
6. **Bisa dimatikan.** Semua animasi menghormati `prefers-reduced-motion` dan tombol "Kurangi animasi".

---

## 2. Arah visual

### 2.1 Konsep: "Kantor siang hari yang hangat"

Antarmuka aplikasi (sidebar, kartu, tabel) bersih dan netral supaya fokus ke **denah**, yang menjadi bagian paling berwarna. Gaya denah adalah ilustrasi game simulasi 2D yang ramah: sudut pandang miring dari atas (3/4 top-down), garis tepi tegas berwarna biru tua, bentuk membulat, warna pastel yang jenuh.

Ciri khas yang membuatnya tidak generik:
- **Siklus hari mengikuti status kantor.** Saat `OPEN` terang, saat `BREAK` hangat keemasan, saat `CLOSED` redup kebiruan dengan lampu mati dan jendela gelap, saat `OVERTIME` lampu menyala dengan cahaya malam di jendela.
- **Jam dinding di denah** menunjukkan waktu WIB yang sama dengan backend.
- **Karakter bicara** lewat balon yang isinya dari `bubbleText` backend.

### 2.2 Token warna

Definisikan sebagai CSS variables di `src/styles/tokens.css`. Tema siang (bawaan) dan malam.

| Token | Siang | Malam | Pemakaian |
|---|---|---|---|
| `--bg` | `#EEF2F6` | `#0F1620` | Latar aplikasi |
| `--surface` | `#FFFFFF` | `#172230` | Kartu, panel |
| `--surface-2` | `#F7F9FB` | `#1D2B3B` | Latar bersarang, input |
| `--ink` | `#162231` | `#E8EEF4` | Teks utama |
| `--ink-2` | `#526173` | `#9AABBB` | Teks sekunder |
| `--line` | `#D5DDE5` | `#2C3C4D` | Garis pembatas |
| `--accent` | `#4F6BED` | `#8FA3FF` | Tombol utama, fokus |
| `--ok` | `#2E9E6B` | `#5BC795` | Berhasil, `DONE`, buka |
| `--warn` | `#D98A1E` | `#F0B35A` | Jeda, menunggu |
| `--danger` | `#D6453D` | `#F27A72` | Gagal, tutup, peringatan |
| `--info` | `#2F80D0` | `#6FB1F0` | Informasi, `RUNNING` |
| `--stroke` | `#2B3A4E` | `#0A1018` | Garis tepi objek di denah |

Warna ruangan di denah (dasar lantai, bisa diganti tekstur dari aset):

| Ruangan | Siang | Malam |
|---|---|---|
| Ruang kerja | `#EBDDC3` | `#4A4234` |
| Mushola | `#CFE6E0` | `#2D4743` |
| Toilet | `#E8DCEB` | `#43374A` |
| Lapangan | `#BFE0A8` | `#2F4A2A` |

Warna peran (dipakai tubuh karakter, lencana, dan aksen kartu agent):

| Peran | Kode | Warna |
|---|---|---|
| Project Manager | PM | `#7F77DD` |
| Frontend | FE | `#378ADD` |
| Backend | BE | `#1D9E75` |
| QA | QA | `#D85A30` |
| Digital Marketing | MK | `#D4537E` |
| Content Writer | KT | `#A9690F` |
| Customer Support | CS | `#5F5E5A` |
| Peran baru | (dua huruf) | dihasilkan dari hash nama peran, saturasi 55%, terang 50% |

Status tugas (lencana dan kolom Kanban): `QUEUED` abu-biru, `BLOCKED` kuning, `RUNNING` biru (`--info`), `REVIEW` ungu, `DONE` hijau, `FAILED` merah.

### 2.3 Tipografi

| Peran | Font | Catatan |
|---|---|---|
| Judul dan angka besar | **Fredoka** (600) | Bulat dan ramah, selaras gaya denah |
| Isi dan antarmuka | **Plus Jakarta Sans** (400, 500, 700) | Nyaman dibaca untuk teks Indonesia |
| Kode, ID, token | `ui-monospace` (JetBrains Mono jika dipasang) | |

Pasang lewat `@fontsource` (di-bundle, tidak bergantung CDN). Beri fallback: `"Plus Jakarta Sans", system-ui, sans-serif` dan `"Fredoka", "Trebuchet MS", sans-serif`. Angka yang berubah (jam, token) memakai `font-variant-numeric: tabular-nums`.

Skala: 12 / 14 / 16 / 20 / 28 / 40 px. Teks isi minimal 14px; label kecil di denah minimal 11px.

### 2.4 Bentuk, jarak, bayangan

- Radius: 8px (kontrol), 14px (kartu), 20px (panel besar dan modal), 999px (lencana dan pil).
- Jarak memakai kelipatan 4px.
- Kartu: latar `--surface`, garis 1px `--line`, bayangan sangat halus (`0 1px 2px rgba(20,34,49,.06)`). Hindari bayangan tebal.
- Elemen di denah memakai garis tepi 2px `--stroke` dan bayangan kontak lembut di bawah objek.
- Fokus keyboard: cincin 2px `--accent` dengan offset 2px, selalu terlihat.

### 2.5 Ikon

`lucide-react`, ketebalan 1.75. Pemetaan jenis balon:

| `bubbleType` | Ikon | Warna latar balon |
|---|---|---|
| `THINKING` | `Lightbulb` | `--info` lembut |
| `WAITING` | `Hourglass` | `--warn` lembut |
| `RESTING` | `Coffee` | hijau lembut |
| `PRAYING` | `Sparkles` | biru muda |
| `STANDUP` | `Users` | ungu lembut |
| `TOILET` | `DoorClosed` | abu |
| `IDLE` | `Smile` | putih |
| lainnya atau perayaan | `PartyPopper` | kuning lembut |

### 2.6 Prinsip gerak

| Token | Nilai |
|---|---|
| `--ease-out` | `cubic-bezier(.22, 1, .36, 1)` |
| `--ease-inout` | `cubic-bezier(.65, 0, .35, 1)` |
| Durasi UI | 150 ms (hover), 240 ms (panel), 320 ms (modal) |
| Kecepatan jalan karakter | 90 px per detik pada skala denah 1280 px |
| Siklus mengetik | 0,8 detik |
| Balon muncul | 200 ms skala 0,9 ke 1 dan fade |

Hanya animasikan `transform` dan `opacity`. Hentikan semua animasi saat tab tidak terlihat (`visibilitychange`).

---

## 3. Teknologi dan struktur proyek

### 3.1 Tumpukan

| Kebutuhan | Pilihan |
|---|---|
| Kerangka | React + Vite + TypeScript |
| Gaya | Tailwind CSS (token di atas dipetakan ke tema Tailwind) |
| Routing | React Router |
| State realtime | Zustand (satu store untuk status kantor, presence, event) |
| Data REST | TanStack Query |
| Validasi payload | Zod (SSE dan respons API) |
| Animasi karakter dan UI | `motion` (Framer Motion) |
| Drag dan drop Kanban | `@dnd-kit/core` |
| Grafik | Recharts |
| Ikon | `lucide-react` |
| Tes | Vitest + Testing Library; Playwright untuk alur utama (opsional) |

Catatan lingkungan: Node.js di komputermu v25, yang bukan versi LTS dan sempat memicu peringatan `EBADENGINE`. Untuk frontend sebaiknya pakai **Node 24 LTS** supaya paket tooling tidak bermasalah.

### 3.2 Struktur folder

```
kantor-ai-frontend/
  public/
    assets/                    # aset dari ChatGPT (lihat dokumen aset)
      characters/  props/  floors/  ui/
  src/
    app/                       # router, layout, provider
    api/                       # klien REST, skema zod, hook TanStack Query
    realtime/                  # useOfficeStream, store presence, mode demo
    stage/                     # denah: Stage, Room, Prop, Character, Bubble, layout.ts
    features/
      agents/  tasks/  goals/  schedule/  dashboard/  settings/
    components/                # tombol, kartu, modal, lencana, kosong, galat
    styles/                    # tokens.css, global.css
    lib/                       # util waktu WIB, warna, format token
  .env.example                 # VITE_API_URL, VITE_MOCK
```

### 3.3 Variabel lingkungan

```
VITE_API_URL=http://localhost:3000
VITE_MOCK=0        # 1 = pakai pembangkit event palsu tanpa backend
```

---

## 4. Integrasi dengan backend

### 4.1 Pemetaan endpoint (dari roadmap)

| Area | Endpoint | Dipakai oleh |
|---|---|---|
| Kesehatan | `GET /health` | Indikator koneksi dan layar penyiapan |
| Agent | `GET /office/agents`, `PUT /office/agents/:id`, `DELETE /office/agents/:id`, `GET /office/agents/templates`, `POST /office/agents/init-default` | Halaman Agent, onboarding |
| Tugas | `GET /office/tasks`, `POST /office/tasks`, `POST /office/tasks/:id/approve`, `POST /office/tasks/:id/revise` | Kanban, review |
| Target | `POST /office/goals`, `POST /office/goals/:id/clarify`, `GET /office/goals`, `GET /office/goals/:id` | Halaman Target |
| Jadwal | `GET/PUT /settings`, `GET/POST/PUT/DELETE /schedule-blocks`, `POST /schedule-blocks/init-default` | Halaman Jadwal |
| Kontrol kantor | `GET /office/state`, `POST /office/pause`, `POST /office/resume`, `POST /office/overtime` | Panel jam kantor |
| Realtime | `GET /office/stream` (SSE), `GET /office/presences` | Denah, sinkronisasi ulang |
| Kosmetik | `POST /office/toilet/:agentId` | Tombol demo di panel agent |
| Biaya | `GET /office/stats` atau `GET /stats`, `GET /office/logs` atau `GET /logs` | Dashboard |

Bentuk respons yang pasti belum tercantum di roadmap. **Langkah pertama pengembangan:** panggil tiap endpoint dengan `Invoke-RestMethod` atau browser, salin bentuk responsnya, lalu tulis skema Zod dari situ. Jangan menebak nama field.

### 4.2 Kontrak SSE

Backend menyiarkan empat jenis event. Tipe di bawah adalah **dugaan awal** berdasarkan roadmap dan harus dicocokkan dengan payload asli.

```ts
type Location = 'DESK' | 'MUSHOLA' | 'LAPANGAN' | 'TOILET' | (string & {});
type PresenceStatus =
  | 'WORKING' | 'IDLE' | 'WAITING' | 'STANDUP' | 'PRAYING'
  | 'RESTING' | 'TOILET' | 'OFFLINE' | (string & {});
type BubbleType =
  | 'THINKING' | 'WAITING' | 'RESTING' | 'PRAYING'
  | 'STANDUP' | 'TOILET' | 'IDLE' | (string & {});

type OfficeStatus = {                     // event: office.status
  state: 'OPEN' | 'BREAK' | 'CLOSED' | 'PAUSED' | 'OVERTIME';
  breakName?: string;
  delayMs?: number;
};
type AgentPresence = {                    // event: agent.presence
  agentId: string; status: PresenceStatus; location: Location;
  bubbleText?: string | null; bubbleType?: BubbleType | null;
  currentTaskId?: string | null;
};
type TaskUpdated = { taskId: string; status: string; goalId?: string | null };   // task.updated
type RunFinished = { agentId: string; totalTokens: number; latencyMs: number; status: string }; // run.finished
```

Pembacaan di browser bergantung cara backend mengirim event:
- Jika backend memberi nama event SSE, pakai `es.addEventListener('agent.presence', ...)`.
- Jika semuanya lewat `message` dengan JSON berisi `type`, pakai `es.onmessage`.

Buat `useOfficeStream` yang mendukung keduanya, dan abaikan komentar `:ping` (heartbeat 25 detik).

### 4.3 Hook `useOfficeStream`

Tanggung jawab:
1. Membuka `EventSource` ke `${VITE_API_URL}/office/stream`.
2. Mem-parse dan memvalidasi tiap event dengan Zod. Event yang tidak valid dicatat ke konsol dan dilewati, tidak menjatuhkan aplikasi.
3. Menulis ke store Zustand.
4. **Sinkronisasi ulang saat tersambung (pertama kali dan setiap reconnect):** panggil `GET /office/presences` dan `GET /office/state` untuk mengisi status awal, karena SSE hanya menyiarkan perubahan.
5. Menampilkan status koneksi: `connecting`, `live`, `reconnecting`, `offline`.
6. Menggabungkan event beruntun dalam satu frame (batching dengan `requestAnimationFrame`) agar tidak merender berlebihan.
7. Menutup koneksi saat komponen dilepas.

Bentuk store (ringkas):

```ts
type OfficeStore = {
  connection: 'connecting' | 'live' | 'reconnecting' | 'offline';
  office: OfficeStatus | null;
  presence: Record<string, AgentPresence>;     // kunci: agentId
  recentRuns: RunFinished[];                   // 50 terakhir
  applyEvent: (e: OfficeEvent) => void;
  hydrate: (p: AgentPresence[], o: OfficeStatus) => void;
};
```

### 4.4 Mode demo (`VITE_MOCK=1`)

Pembangkit event lokal yang meniru backend: mengikuti jadwal 08:00 sampai 17:00 dengan apel, sholat Dzuhur, makan siang, sholat Ashar, kunjungan toilet acak, dan balon kata acak. Ada kontrol waktu (jeda, kecepatan 1x, 8x, 20x, geser jam) yang hanya tampil di mode demo. Fungsi ini juga dipakai untuk menguji aset baru dan semua state animasi.

### 4.5 Hal yang perlu dikonfirmasi atau diminta dari backend

| Kebutuhan | Alasan |
|---|---|
| Bentuk pasti payload SSE (nama event atau field `type`) | Menentukan parser |
| Field `meja`/`deskIndex` dan `color` pada agent | Menentukan slot meja dan warna karakter |
| Apakah `agent.presence` memuat nama agent atau hanya `agentId` | Menghindari pencarian ulang |
| `GET /office/tasks` dengan filter (status, agent, goal) dan paginasi | Kanban dan halaman detail target |
| Statistik beberapa hari terakhir (bukan hanya hari ini) | Grafik tren di dashboard |
| Kapan `bubbleText` dihapus (kedaluwarsa atau diganti `null`) | Menentukan kapan balon hilang |
| Autentikasi owner | PRD memuat login, roadmap belum |

---

## 5. Denah kantor (Stage)

### 5.1 Prinsip

- Denah memakai **sistem koordinat logis 1280 x 800** yang diskalakan ke lebar wadah (rasio 16:10) dengan `transform: scale()`. Posisi semua benda disimpan dalam koordinat logis, jadi tidak ada hitung ulang saat layar berubah.
- Struktur ruangan, slot, dan jalur ada di **satu berkas konfigurasi** `src/stage/layout.ts`, bukan tersebar di komponen. Mengubah tata letak cukup mengedit berkas ini.
- Mode debug (`?debug=1`) menggambar semua slot, jalur, dan kotak ruangan agar penyetelan koordinat mudah.

### 5.2 Ruangan (koordinat logis)

| Ruangan | x | y | lebar | tinggi |
|---|---|---|---|---|
| Ruang kerja (`KANTOR`) | 40 | 40 | 760 | 430 |
| Mushola | 830 | 40 | 410 | 250 |
| Toilet | 830 | 310 | 410 | 160 |
| Lapangan | 40 | 500 | 1200 | 260 |

Lorong vertikal antara ruang kerja dan mushola/toilet berada di x 800 sampai 830.

### 5.3 Slot posisi

Tiap agent mendapat slot tetap berdasarkan nomor mejanya (fallback: urutan agent) sehingga tidak ada dua karakter di titik yang sama.

| Slot | Titik (x, y) |
|---|---|
| Meja (7) | (140,170) (300,170) (460,170) (620,170) (220,340) (380,340) (540,340) |
| Area apel (7) | (100,430) (190,430) (280,430) (370,430) (460,430) (550,430) (640,430) |
| Sajadah mushola (7) | (890,110) (970,110) (1050,110) (1130,110) (930,210) (1010,210) (1090,210) |
| Bilik toilet (2) | (930,400) (1110,400) |
| Lapangan (7) | (120,620) (260,700) (420,600) (580,700) (740,600) (900,700) (1100,620) |

Untuk lebih dari tujuh agent, tambahkan slot di `layout.ts`. Jika slot habis, karakter ditempatkan di titik terdekat yang kosong.

### 5.4 Jalur jalan (waypoint)

Karakter tidak berjalan lurus menembus dinding. Definisikan graf kecil titik-titik jalur, lalu cari rute terpendek (Dijkstra) dari lokasi lama ke slot baru.

| Titik | Posisi | Terhubung ke |
|---|---|---|
| `kantor_tengah` | (420,300) | `kantor_timur`, `kantor_selatan` |
| `kantor_timur` | (780,200) | `lorong_atas` |
| `kantor_selatan` | (420,480) | `lapangan_masuk` |
| `lorong_atas` | (815,150) | `mushola_pintu`, `lorong_wc`, `kantor_timur` |
| `lorong_wc` | (815,390) | `toilet_pintu`, `lorong_atas`, `lorong_bawah` |
| `lorong_bawah` | (815,520) | `lapangan_masuk`, `lorong_wc` |
| `mushola_pintu` | (860,150) | `lorong_atas` |
| `toilet_pintu` | (860,390) | `lorong_wc` |
| `lapangan_masuk` | (420,530) | `kantor_selatan`, `lorong_bawah` |

Rute dihitung sekali per perpindahan, lalu dijalankan sebagai urutan gerak lurus antar titik. Karakter menghadap ke arah gerak (cermin horizontal untuk kiri atau kanan).

### 5.5 Lapisan (dari belakang ke depan)

1. Latar ruangan dan lantai (warna atau tekstur).
2. Dinding dan jendela.
3. Perabot belakang (rak, papan tulis, jam dinding).
4. Alas lantai (sajadah, garis lapangan).
5. Karakter dan perabot yang berurutan berdasarkan `y` (**depth sorting**: yang `y`-nya lebih besar digambar di depan). Meja berada di depan karakter yang duduk.
6. Efek (partikel konfeti, "zzz").
7. Balon kata, selalu paling atas.
8. Lapisan siklus hari (overlay warna dengan `mix-blend-mode: multiply`).

### 5.6 Kamera dan perangkat

| Perangkat | Perilaku |
|---|---|
| Desktop (>= 1024px) | Denah di tengah, panel samping 360px untuk detail agent atau daftar status |
| Tablet | Denah penuh lebar, panel muncul sebagai laci kanan |
| Ponsel | Denah penuh lebar dan bisa di-zoom dan geser (cubit dua jari); detail agent muncul sebagai *bottom sheet* |

Tombol zoom (+, -, reset) selalu tersedia. Pada ponsel, balon kata ditampilkan hanya untuk agent terpilih dan agent yang baru saja berubah status, agar denah tidak penuh.

---

## 6. Karakter dan animasi

### 6.1 Komponen karakter

`<Character agent presence />` menerima agent dan presence-nya, lalu merender:
- Sprite (PNG dari aset atau fallback SVG).
- Lencana kode peran (dua huruf) di dada. Ini digambar kode, bukan bagian gambar, sehingga peran baru tidak butuh aset baru.
- Nama pendek di bawah kaki, muncul saat hover, fokus, atau karakter terpilih.
- Balon kata (komponen `Bubble`).
- Area klik 48 x 48 px minimal, bisa difokus keyboard (`role="button"`, `aria-label="Raka, Frontend developer, sedang bekerja"`).

### 6.2 Pemetaan status ke animasi

| Status presence | Lokasi | Pose dan gerak | Efek tambahan |
|---|---|---|---|
| `WORKING` | `DESK` | Duduk mengetik (2 frame bergantian, 0,8 dtk) | Layar monitor menyala berkedip |
| `IDLE` | `DESK` | Duduk santai, napas pelan, menoleh tiap 6 sampai 10 dtk | Monitor redup |
| `WAITING` | `DESK` | Duduk santai | Jam pasir kecil di atas kepala |
| `STANDUP` | Area apel | Berdiri tegak berbaris, mengangguk sesekali | - |
| `PRAYING` | `MUSHOLA` | Pose bersujud tenang di sajadah | Cahaya hangat lembut di mushola |
| `RESTING` | `LAPANGAN` | Duduk atau berdiri santai, kadang berjalan pelan | Cangkir kopi atau bola |
| `TOILET` | `TOILET` | Masuk bilik, pintu menutup | Tanda "Terisi" menyala |
| `OFFLINE` | `DESK` | Kepala menunduk tertidur, warna dipudarkan | "zzz" mengambang, lampu meja mati |
| Perayaan (target `DONE`) | Meja PM | Tangan terangkat | Konfeti singkat 2 detik |

**Berpindah lokasi:** saat `location` berubah, putar animasi berjalan sepanjang rute (bagian 5.4) sebelum pose tujuan dimainkan. Jika event baru datang saat masih berjalan, rute dihitung ulang dari posisi saat ini.

**Status `WAITING` atau `THINKING` sebenarnya bukan lokasi baru.** Backend memakai `bubbleType` untuk itu, jadi karakter tetap di meja dan hanya ikonnya berubah.

### 6.3 Balon kata

- Muncul di atas kepala dengan ekor menunjuk ke karakter.
- Ikon kiri (lihat tabel 2.5), teks maksimal dua baris lalu dipotong dengan elipsis. Teks lengkap tersedia di atribut `title` dan di panel detail.
- Lebar maksimal 200px (skala denah), `pointer-events: none` kecuali saat hover.
- Hilang saat `bubbleText` bernilai kosong atau `null`, dengan fade 150 ms.
- Tumpang tindih antar balon dikurangi dengan mengurutkan berdasarkan `y` dan menggeser balon ke sisi yang kosong.

### 6.4 Interaksi

| Aksi | Hasil |
|---|---|
| Hover atau fokus karakter | Nama dan peran muncul |
| Klik atau ketuk karakter | Panel detail agent terbuka |
| Klik ruangan kosong | Menutup panel |
| Tombol keyboard `Tab` | Berpindah antar karakter sesuai urutan meja |
| `Esc` | Menutup panel dan modal |

### 6.5 Efek ambient (semuanya digambar kode)

- Jam dinding analog di ruang kerja, jarum sesuai waktu WIB.
- Jendela dengan cahaya mengikuti status kantor.
- Debu cahaya halus atau daun bergoyang di lapangan (sangat pelan, bisa dimatikan).
- Lampu ruangan: menyala terang saat `OPEN`, hangat saat `BREAK`, mati di ruang kerja saat `CLOSED`.

---

## 7. Halaman dan komponen

### 7.1 Kerangka aplikasi

| Perangkat | Navigasi |
|---|---|
| Desktop | Sidebar kiri ikon dan label (Kantor, Agent, Tugas, Target, Jadwal, Biaya, Pengaturan) |
| Ponsel | *Bottom tab bar* lima tab (Kantor, Tugas, Target, Agent, Lainnya) |

Bilah atas selalu menampilkan: status kantor (lencana), jam WIB, indikator koneksi, dan tombol pintas "Target baru".

### 7.2 Kantor (halaman utama)

- Denah penuh dengan karakter.
- Widget jam kantor (analog dan digital) dan lencana status: Sedang Buka, Istirahat (dengan nama jeda dan hitung mundur), Tutup, Dijeda, Lembur.
- Tombol saklar **Jeda kantor** dan **Lembur** (dengan konfirmasi singkat).
- Daftar ringkas "Sedang apa sekarang": satu baris per agent berisi lokasi dan balon terakhir (versi aksesibel dari denah).
- Umpan aktivitas kecil: tugas yang baru selesai atau butuh review.

### 7.3 Agent

- Galeri kartu: avatar, nama, peran, status sekarang, jumlah tugas aktif, dan token hari ini.
- Tombol **Gunakan template** (memuat `GET /office/agents/templates`) dan **Inisialisasi 7 agent bawaan** (`init-default`) untuk kondisi kosong.
- Modal tambah atau ubah agent: nama, peran, jobdesk (teks panjang dengan penghitung karakter dan saran penulisan), model, suhu, batas token, warna, nomor meja, tombol aktif atau nonaktif.
- Panel detail (juga dibuka dari denah): jobdesk, tugas aktif, 10 tugas terakhir, statistik run (jumlah, token, latensi rata-rata, tingkat keberhasilan), dan tombol **Beri tugas**.

### 7.4 Tugas

- **Kanban** dengan kolom: Antrean, Terblokir, Berjalan, Review, Selesai, dan Gagal (bisa dilipat).
- Kartu tugas: judul, avatar agent, lencana prioritas, ikon dependensi, dan waktu.
- Drag dan drop hanya untuk perpindahan yang sah:
  - Review ke Selesai: **Setujui** (konfirmasi).
  - Review ke Antrean: **Minta revisi** (membuka kotak catatan; tampilkan sisa jatah revisi, maksimal 2).
  - Perpindahan lain ditolak dengan animasi goyang dan keterangan alasan.
- Form tugas manual: pilih agent, judul, deskripsi, kriteria penerimaan (daftar yang bisa ditambah), butuh review atau tidak.
- Halaman detail tugas: hasil (teks atau kode dengan tombol salin), daftar kriteria beserta centang `criteria_check`, asumsi, pertanyaan terbuka, riwayat revisi, run (token, latensi, model yang menjawab), tombol **Setujui** dan **Minta revisi**.

### 7.5 Target (Goal)

- Kotak input besar "Apa target kantor hari ini?" dengan tombol kirim.
- Hasil triage ditampilkan sebagai kartu: kategori, ringkasan, peran yang dibutuhkan.
- Jika `NEEDS_CLARIFICATION`: kartu pertanyaan (maksimal 3) dengan kolom jawaban dan tombol **Kirim jawaban** (`POST /office/goals/:id/clarify`).
- **Diagram alur tugas**: simpul-simpul tugas diatur berlapis berdasarkan kedalaman dependensi (kiri ke kanan), garis penghubung SVG, warna simpul sesuai status, dan bilah progres persentase di atas. Klik simpul membuka detail tugas.
- Daftar target sebelumnya beserta progresnya.

### 7.6 Jadwal

- **Lini masa harian 24 jam:** batang horizontal berwarna untuk jam kerja dan tiap blok jeda, penanda waktu sekarang berwarna aksen yang bergerak.
- Form jam masuk, jam pulang, hari kerja (pilihan hari), zona waktu, dan batas harian.
- Editor blok jeda: tambah, ubah, hapus (nama, jenis, mulai, selesai) dengan validasi tumpang tindih. Tombol **Isi jeda bawaan** (`init-default`).
- Pratinjau "Hari ini akan seperti ini" yang menampilkan urutan fase.

### 7.7 Biaya (dashboard)

- Kartu ringkas: run hari ini, token hari ini, latensi rata-rata, tugas selesai dan gagal.
- **Meteran kuota:** token terpakai dibanding batas harian, dan run terpakai dibanding batas run. Warna berubah di 70% (`--warn`) dan 90% (`--danger`).
- Grafik batang per agent (token) dan tabel per model LLM (run dan token).
- Tabel log aktivitas dengan filter (jenis aksi, agent, tugas, target), pencarian nama agent, dan paginasi.

### 7.8 Pengaturan

- Alamat backend dan tombol **Uji koneksi** (`GET /health`: tampilkan status database, Redis, dan 9Router).
- Tema: Siang, Malam, Ikuti sistem.
- **Kurangi animasi**, tampilkan balon, tampilkan nama karakter.
- Suara (opsional, mati secara bawaan).
- Fase 7: ekspor dan impor konfigurasi kantor (JSON).

---

## 8. Keadaan khusus

### 8.1 Layar pertama kali (onboarding)

Dijalankan jika `GET /office/agents` kosong:
1. Periksa koneksi (`/health`), tampilkan tiga lampu: Database, Redis, 9Router.
2. Tombol **Buat 7 karyawan bawaan** (`init-default`).
3. Tombol **Isi jam kerja bawaan** (`schedule-blocks/init-default`).
4. Tombol **Beri tugas pertama** yang membuka form target.

### 8.2 Kondisi galat dan kosong

| Kondisi | Tampilan |
|---|---|
| Backend tidak terjangkau | Banner di atas: "Tidak tersambung ke kantor. Mencoba lagi..." dan tombol coba sekarang. Denah menampilkan data terakhir dengan karakter dipudarkan |
| Stream terputus | Lencana koneksi kuning "Menyambung ulang"; sinkronisasi ulang otomatis saat pulih |
| Daftar kosong | Ilustrasi robot kecil, satu kalimat penjelasan, satu tombol aksi |
| Memuat | Kerangka (skeleton) berbentuk elemen aslinya, bukan spinner penuh layar |
| Aksi gagal | Toast dengan pesan jelas dan tombol ulangi; tidak menutup modal |
| Kuota habis | Banner merah di bilah atas: "Batas harian tercapai, tugas ditunda ke hari kerja berikutnya" |

### 8.3 Teks antarmuka

Bahasa Indonesia yang santai tetapi jelas. Contoh: "Raka sedang membangun halaman landing", "Kantor tutup, buka lagi besok 08:00", "Tugas ini butuh persetujuanmu". Hindari istilah teknis mentah (`QUEUED`) pada label yang dilihat owner; terjemahkan menjadi "Antre", "Terblokir", "Berjalan", "Perlu review", "Selesai", "Gagal".

---

## 9. Aksesibilitas

- Kontras teks minimal 4,5:1 di kedua tema.
- Semua fungsi denah tersedia juga lewat **daftar status** (versi teks), sehingga pengguna pembaca layar dan keyboard tidak bergantung pada visual.
- Wilayah `aria-live="polite"` mengumumkan perubahan penting: "Raka mulai bekerja", "Kantor masuk jam istirahat Dzuhur". Batasi agar tidak membanjiri (gabungkan dalam jeda 2 detik).
- Warna tidak pernah menjadi satu-satunya penanda status: selalu disertai ikon dan teks.
- `prefers-reduced-motion` atau tombol "Kurangi animasi": karakter berpindah dengan fade singkat tanpa berjalan, tanpa konfeti, tanpa partikel, dan siklus mengetik dihentikan.
- Target sentuh minimal 44 x 44 px pada kontrol, 48 x 48 px pada karakter.
- Semua modal menjebak fokus dan kembali ke pemicu saat ditutup.

---

## 10. Performa

| Hal | Aturan |
|---|---|
| Render | Satu store, komponen karakter dibungkus `memo` per agent supaya hanya yang berubah yang dirender |
| Animasi | Hanya `transform` dan `opacity`; gunakan `will-change` seperlunya |
| Aset | Format WebP, sprite sheet dipakai untuk frame yang berurutan, muat malas untuk halaman di luar denah |
| Jaringan | Satu koneksi SSE per tab; hentikan polling saat SSE `live` |
| Tab tersembunyi | Jeda animasi dan batching event, sinkronisasi ulang saat tab kembali aktif |
| Target | 60 fps dengan 7 karakter di laptop biasa; 30 fps stabil di ponsel menengah dengan 20 karakter |
| Ukuran | Bundel awal di bawah 300 KB (gzip) di luar aset gambar |

---

## 11. Rencana integrasi aset

### 11.1 Strategi dua tahap

1. **Tahap kode (tanpa aset):** karakter robot digambar dengan SVG/CSS (kepala persegi membulat, antena, mata menyala, badan berwarna peran, seperti prototipe awal). Perabot berupa bentuk sederhana. Seluruh fitur dan animasi dikerjakan dengan ini.
2. **Tahap aset:** gambar dari ChatGPT menggantikan SVG lewat satu **manifes aset** (`src/stage/assets.ts`). Jika sebuah aset belum ada, otomatis memakai fallback kode. Jadi aset bisa dimasukkan satu per satu tanpa merusak apa pun.

### 11.2 Manifes aset (contoh)

```ts
export const ASSETS = {
  character: {
    mode: 'tint',                     // 'tint' = diwarnai kode, 'prebaked' = per peran sudah berwarna
    poses: {
      idle:    '/assets/characters/robot_idle.png',
      walk:    ['/assets/characters/robot_walk_1.png', '/assets/characters/robot_walk_2.png',
                '/assets/characters/robot_walk_3.png', '/assets/characters/robot_walk_4.png'],
      typing:  ['/assets/characters/robot_type_1.png', '/assets/characters/robot_type_2.png'],
      sleep:   '/assets/characters/robot_sleep.png',
      pray:    '/assets/characters/robot_pray.png',
      rest:    '/assets/characters/robot_rest.png',
      cheer:   '/assets/characters/robot_cheer.png',
    },
    anchor: { x: 0.5, y: 0.95 },      // titik kaki sebagai pusat posisi
    height: 96,                       // tinggi tampil pada skala denah
  },
  props: { desk: '/assets/props/desk.png', /* ... */ },
  floors: { kantor: '/assets/floors/floor_office.webp', /* ... */ },
} as const;
```

### 11.3 Spesifikasi teknis aset

| Aspek | Aturan |
|---|---|
| Format | PNG transparan saat pengerjaan, dikonversi ke WebP untuk produksi |
| Ukuran karakter | Tinggi sekitar 256 px di sumber (ditampilkan sekitar 96 px), cukup tajam untuk layar retina |
| Titik jangkar | Titik di antara kedua kaki, di sekitar 95% tinggi gambar |
| Arah | Semua pose berjalan menghadap kanan; menghadap kiri dengan `scaleX(-1)` |
| Bayangan | Tidak ada bayangan lantai di gambar; bayangan lonjong ditambahkan kode di bawah karakter |
| Warna karakter | Mode `tint`: badan abu terang netral diwarnai lewat CSS `mask` dan `mix-blend-mode`. Mode `prebaked`: satu set gambar per warna peran |
| Penamaan | huruf kecil, garis bawah, tanpa spasi (lihat dokumen aset) |
| Tekstur lantai | 512 x 512 yang bisa diulang (tile) |

### 11.4 Penyetelan setelah aset masuk

1. Buka `?debug=1` dan cek bahwa kaki karakter tepat di titik slot.
2. Sesuaikan `anchor` dan `height` di manifes, bukan di komponen.
3. Cek pose duduk terhadap meja: bagian bawah badan harus tertutup meja (urutan lapisan 5.5).
4. Uji semua status lewat mode demo.

---

## 12. Rencana pembangunan

Setiap tahap harus bisa didemokan sebelum pindah ke berikutnya.

| Tahap | Isi | Selesai jika |
|---|---|---|
| **F6.0 Fondasi** | Proyek Vite, Tailwind, token, font, router, kerangka halaman, klien API, `.env`, mode demo | Aplikasi tampil, mode demo menyala, `/health` terbaca |
| **F6.1 Denah hidup** | Stage dengan layout.ts, karakter SVG, jalur jalan, depth sorting, balon, `useOfficeStream`, store, sinkronisasi ulang | Karakter berpindah ruangan mengikuti event nyata dan mode demo |
| **F6.2 Agent** | Galeri, modal, template, init-default, panel detail dari denah | Bisa membuat dan mengubah agent, panel terbuka dari karakter |
| **F6.3 Tugas** | Kanban, form tugas, detail, setujui dan revisi | Alur tugas sampai disetujui berjalan di UI |
| **F6.4 Target** | Input target, klarifikasi, diagram alur, progres | Satu target berjalan dari ketikan sampai selesai di UI |
| **F6.5 Jadwal** | Widget jam, jeda dan lembur, editor jadwal, lini masa | Mengubah jam kerja langsung terlihat di denah |
| **F6.6 Biaya** | Meteran kuota, grafik, tabel log dan filter | Angka cocok dengan `GET /stats` |
| **F6.7 Aset dan poles** | Pasang aset ChatGPT, siklus hari, mode malam, ponsel, aksesibilitas, performa | Daftar QA di bawah lolos |
| **F7 Lanjutan** | Efek mengetik di balon, streaming teks LLM, ekspor dan impor konfigurasi | Mengikuti perkembangan backend Fase 7 |

---

## 13. Daftar QA visual

**Denah**
- [ ] Kaki setiap karakter tepat di slot, di semua skala.
- [ ] Tidak ada karakter berjalan menembus dinding.
- [ ] Urutan depth benar: meja menutupi badan bawah karakter yang duduk.
- [ ] Balon tidak keluar dari denah dan tidak saling menimpa parah.
- [ ] Kantor `CLOSED`: lampu redup, karakter tertidur dan dipudarkan.
- [ ] Jeda sholat: semua agent berpindah ke mushola dan kembali setelahnya.

**Aplikasi**
- [ ] Tema siang dan malam sama-sama terbaca (kontras terukur).
- [ ] Ponsel 360 px: tidak ada gulir horizontal pada halaman, denah bisa di-zoom, bottom sheet berfungsi.
- [ ] Backend dimatikan: banner galat muncul dan pulih otomatis saat dinyalakan.
- [ ] Layar kosong (belum ada agent) menampilkan onboarding.
- [ ] Seluruh fungsi bisa dilakukan hanya dengan keyboard.
- [ ] "Kurangi animasi" menghentikan semua gerak berulang.
- [ ] Tidak ada teks mentah status backend (`QUEUED`, dan sebagainya) yang bocor ke label.

---

## 14. Pertanyaan terbuka

1. Perlu login owner sejak awal, atau cukup dibuka lokal dulu?
2. Karakter diwarnai lewat kode (hemat aset) atau dibuat per peran lewat ChatGPT (lebih bagus tetapi lebih banyak gambar)?
3. Apakah jumlah agent akan melebihi tujuh dalam waktu dekat? Itu menentukan berapa slot yang disiapkan di denah.
4. Perlu suara (misalnya bunyi lonceng saat tugas selesai atau azan sebagai penanda jeda)? Jika ya, tentukan apakah aktif secara bawaan.
5. Frontend akan dijalankan lokal bersama backend, atau di-deploy ke server?