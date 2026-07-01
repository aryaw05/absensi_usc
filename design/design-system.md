# Design System — "Brain Orely" Mobile App

> Dokumen ini disusun dari hasil analisis 3 screenshot UI (Onboarding, Loading/Generating, Answer) yang dilampirkan. Semua nilai warna diambil dengan **sampling piksel langsung** dari gambar (bukan tebakan visual), jadi sangat mendekati warna asli — tapi tetap berstatus *approximate*, bukan token resmi dari file desain (Figma) sumber. Kalau nanti dapat akses ke file Figma asli, tinggal sinkronkan ulang nilai hex di bawah.

Stack target: **Tailwind CSS** + **shadcn/ui**.

---

## Daftar Isi

1. [Filosofi & Gaya Visual](#1-filosofi--gaya-visual)
2. [Design Tokens](#2-design-tokens)
3. [`globals.css` (CSS Variables shadcn)](#3-globalscss-css-variables-shadcn)
4. [`tailwind.config.ts`](#4-tailwindconfigts)
5. [Komponen (mapping ke shadcn/ui)](#5-komponen-mapping-ke-shadcnui)
6. [Pola Layout per Halaman](#6-pola-layout-per-halaman)
7. [Ilustrasi & Iconography](#7-ilustrasi--iconography)
8. [Aksesibilitas & Kontras](#8-aksesibilitas--kontras)
9. [Struktur File yang Disarankan](#9-struktur-file-yang-disarankan)
10. [Catatan & Disclaimer](#10-catatan--disclaimer)

---

## 1. Filosofi & Gaya Visual

Gaya UI ini termasuk kategori **"comic outline / doodle UI"** (kadang disebut juga *neo-brutalist-lite*), dengan ciri khas:

- **Outline tebal hitam** di hampir semua elemen — ilustrasi, button, card, badge. Ini elemen paling signature, jadi jangan dihilangkan saat porting ke kode.
- **Hard shadow** (drop shadow tanpa blur, offset 90°) di elemen yang bisa ditekan (button, banner promo) — memberi efek "sticker" / pop-up.
- **Warna flat & saturated**, palet pastel-cerah (ungu lavender, lime/chartreuse, pink magenta) di atas latar krem hangat.
- **Sudut membulat besar** (rounded-2xl–3xl) hampir di semua kontainer, kontras dengan outline yang tegas.
- **Tipografi tebal & besar** untuk heading, geometric sans-serif, tracking rapat.
- **Maskot karakter** (robot/kucing ungu "Orely") sebagai elemen brand yang konsisten muncul di setiap state penting.

Prinsip saat membangun komponen baru: *"flat color + black ink outline + rounded corner"* adalah resep dasarnya. Tambahkan hard shadow hanya untuk elemen yang **interaktif/tappable**, bukan untuk kontainer pasif.

---

## 2. Design Tokens

### 2.1 Warna (Color)

| Token | Hex | HSL (format shadcn) | Pemakaian di screenshot |
|---|---|---|---|
| `background` | `#F9F5F2` | `25.7 36.8% 96.3%` | Latar utama semua screen (krem hangat / ivory) |
| `card` | `#FFFFFF` | `0 0% 100%` | Card jawaban, lingkaran icon button |
| `foreground` (ink) | `#0A0A0A` | `0 0% 3.9%` | Teks heading, outline ilustrasi, border komik |
| `primary` (violet) | `#B69CE0` | `262.9 52.3% 74.5%` | Button "Next", "Similar Answer", fill progress bar |
| `primary-foreground` | `#0A0A0A` | `0 0% 3.9%` | **Teks di atas primary memakai HITAM**, bukan putih — ini detail penting, beda dari default shadcn |
| `accent` (lime) | `#D2EE3B` | `69.4 84.0% 58.2%` | Background screen "Generating...", card promo "Premium" |
| `accent-foreground` (lime dark) | `#34391C` | `70.3 34.1% 16.7%` | Warna teks label "Question:" — versi gelap dari lime |
| `brand-purple-dark` | `#2F1643` | `273.3 50.6% 17.5%` | Warna teks label "Answer:" — versi gelap dari primary |
| `brand-pink-vivid` | `#FCB8F6` | `305.3 91.9% 85.5%` | Gradient header screen Answer (stop atas) |
| `brand-pink-soft` | `#FCE0F6` | `312.9 82.4% 93.3%` | Gradient header screen Answer (stop bawah) |
| `muted` | `#E5E5E3` | `60 3.7% 89.4%` | Background badge/pill (240 komentar, 1.2M) |
| `muted-foreground` | `#6B6864` | `34.3 3.4% 40.6%` | Teks body abu-abu (paragraf onboarding) |
| `border` | `#000000` | `0 0% 0%` | Semua outline komik — button, card, badge, ilustrasi |

> Catatan: tidak ada elemen UI di 3 screenshot yang menunjukkan mode gelap (dark mode). Kalau perlu, siapkan varian dark secara terpisah — jangan asal invert, karena karakter palet ini (pastel di atas krem) butuh treatment khusus di dark mode.

### 2.2 Tipografi

Font yang dipilih:

- **Display/Heading:** `Syne` (weight 700–800) — geometric, karakter tegas, cocok untuk heading besar seperti "From Questions to Revelations" dan "Orely is working to find the right answer"
- **Body/UI:** `Plus Jakarta Sans` (weight 400–600) — dipakai untuk paragraf, label, teks button, badge, dan elemen UI lainnya

#### Cara load font (Next.js — `next/font/google`)

```ts
// app/layout.tsx atau src/lib/fonts.ts
import { Syne, Plus_Jakarta_Sans } from "next/font/google";

export const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});
```

```tsx
// pasang di <body> root layout
<body className={`${syne.variable} ${plusJakartaSans.variable} font-sans`}>
```

> Kalau bukan Next.js (misalnya Vite/CRA biasa), load lewat `<link>` Google Fonts di `index.html`, lalu definisikan `--font-display: 'Syne', sans-serif;` dan `--font-sans: 'Plus Jakarta Sans', sans-serif;` langsung di `globals.css`.

| Token | Ukuran / Line-height | Weight | Tailwind | Contoh pemakaian |
|---|---|---|---|---|
| `display` | 28px / 1.15 | 800 (extrabold) | `font-display text-[28px] leading-[1.15] font-extrabold tracking-tight` | "From Questions to Revelations", "Orely is working to find the right answer" |
| `heading` | 20px / 1.3 | 700 (bold) | `font-display text-xl leading-tight font-bold` | "Brain Orely", "Generating...", "Upgrade your plan", "Answer" (nav title) |
| `label` | 14px / 1.4 | 700 (bold) | `font-sans text-sm font-bold` | "Answer:", "Question:" (dengan warna khusus, lihat token warna) |
| `body` | 14px / 1.5 | 400–500 | `font-sans text-sm leading-relaxed` | Paragraf onboarding, isi jawaban, isi pertanyaan |
| `caption` | 13px / 1.3 | 500–600 | `font-sans text-[13px] font-medium` | Teks badge ("240", "1.2M"), checklist item |
| `button` | 15px / 1.3 | 600 (semibold) | `font-sans text-[15px] font-semibold` | Teks di semua button |

> `display` dan `heading` pakai **Syne** (`font-display`) — keduanya satu-satunya role yang pakai font display. Semua role lain (`label`, `body`, `caption`, `button`) pakai **Plus Jakarta Sans** (`font-sans`).

### 2.3 Spacing

Pakai skala 4px standar Tailwind, dengan konvensi pemakaian:

| Token | Value | Pemakaian |
|---|---|---|
| `xs` | 4px (`gap-1`) | Jarak icon-ke-teks kecil (badge) |
| `sm` | 8px (`gap-2`) | Jarak antar checklist item, jarak icon-teks button |
| `md` | 16px (`p-4`) | Padding horizontal layar (screen padding) |
| `lg` | 20px (`p-5`) | Padding dalam card jawaban |
| `xl` | 24px (`gap-6`) | Jarak antar section utama (heading → ilustrasi → body) |

### 2.4 Border Radius

| Token | Value | Tailwind | Pemakaian |
|---|---|---|---|
| `radius-sm` | 12px | `rounded-xl` | Badge/pill kecil (kalau tidak full-rounded) |
| `radius-md` | 16px | `rounded-2xl` | Button (Next, Similar Answer), banner promo |
| `radius-lg` | 24px | `rounded-3xl` | Card jawaban (sudut atas) |
| `radius-full` | 9999px | `rounded-full` | Icon button bundar (back, bookmark), pagination dot, pill badge |

### 2.5 Shadow ("Hard Shadow" ala sticker)

Ciri khasnya: **tanpa blur**, offset solid, warna shadow = warna border (hitam). Tidak ada di Tailwind default, jadi perlu ditambahkan sebagai custom shadow.

| Token | Value (CSS) | Pemakaian |
|---|---|---|
| `shadow-hard-sm` | `2px 3px 0px 0px #000000` | Badge, icon button kecil |
| `shadow-hard` | `3px 4px 0px 0px #000000` | Button utama (Next, Similar Answer) |
| `shadow-hard-lg` | `4px 6px 0px 0px #000000` | Banner promo (Premium) |

Interaksi yang disarankan (umum di gaya neo-brutalist ini): saat ditekan, elemen bergeser ke arah shadow dan shadow-nya hilang — memberi efek "tombol ditekan masuk".

```css
.btn-hard {
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.btn-hard:active {
  transform: translate(3px, 4px);
  box-shadow: none;
}
```

### 2.6 Border / Stroke

- Lebar stroke konsisten: **2px**, warna selalu hitam (`border`).
- Dipakai di: button, card jawaban, badge/pill, banner promo, dan semua line-art ilustrasi.
- Tidak ada elemen yang pakai border tipis abu-abu khas shadcn default (`1px hsl(var(--border))` yang soft) — di sini border selalu kontras tinggi & tebal. Ini perbedaan paling besar dari default theme shadcn yang perlu disesuaikan manual.

---

## 3. `globals.css` (CSS Variables shadcn)

```css
@layer base {
  :root {
    --background: 25.7 36.8% 96.3%;        /* #F9F5F2 — krem */
    --foreground: 0 0% 3.9%;                /* #0A0A0A — ink */

    --card: 0 0% 100%;                      /* #FFFFFF */
    --card-foreground: 0 0% 3.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;

    --primary: 262.9 52.3% 74.5%;           /* #B69CE0 — violet */
    --primary-foreground: 0 0% 3.9%;        /* teks di atas primary = HITAM */

    --secondary: 60 3.7% 89.4%;             /* dipakai utk badge/pill bg */
    --secondary-foreground: 0 0% 3.9%;

    --muted: 60 3.7% 89.4%;                 /* #E5E5E3 */
    --muted-foreground: 34.3 3.4% 40.6%;    /* #6B6864 */

    --accent: 69.4 84.0% 58.2%;             /* #D2EE3B — lime */
    --accent-foreground: 70.3 34.1% 16.7%;  /* #34391C */

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;

    --border: 0 0% 0%;                      /* stroke komik — hitam pekat */
    --input: 0 0% 0%;
    --ring: 262.9 52.3% 74.5%;

    --radius: 1rem;

    /* ===== Token tambahan khusus brand (di luar default shadcn) ===== */
    --brand-purple-dark: 273.3 50.6% 17.5%; /* #2F1643 — label "Answer:" */
    --brand-pink-vivid: 305.3 91.9% 85.5%;  /* #FCB8F6 — gradient header atas */
    --brand-pink-soft: 312.9 82.4% 93.3%;   /* #FCE0F6 — gradient header bawah */
  }
}
```

---

## 4. `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // token brand tambahan
        brand: {
          purpleDark: "hsl(var(--brand-purple-dark))",
          pinkVivid: "hsl(var(--brand-pink-vivid))",
          pinkSoft: "hsl(var(--brand-pink-soft))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      boxShadow: {
        "hard-sm": "2px 3px 0px 0px hsl(var(--border))",
        hard: "3px 4px 0px 0px hsl(var(--border))",
        "hard-lg": "4px 6px 0px 0px hsl(var(--border))",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-pink-header":
          "linear-gradient(180deg, hsl(var(--brand-pink-vivid)) 0%, hsl(var(--brand-pink-soft)) 100%)",
      },
    },
  },
};

export default config;
```

---

## 5. Komponen (mapping ke shadcn/ui)

### 5.1 Button

Ada 3 varian button yang muncul di screenshot. Tambahkan sebagai varian baru di `buttonVariants` (file `components/ui/button.tsx` hasil generate shadcn).

```tsx
// components/ui/button.tsx (tambahan di cva variants)
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold text-[15px] transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Button utama bergaya "sticker": Next, Similar Answer
        brand:
          "bg-primary text-primary-foreground border-2 border-border rounded-2xl shadow-hard active:translate-x-[3px] active:translate-y-[4px] active:shadow-none",
        // Icon button bundar putih: back arrow, bookmark
        brandIcon:
          "bg-card text-foreground border-2 border-border rounded-full shadow-hard-sm w-9 h-9 p-0 active:translate-x-[2px] active:translate-y-[3px] active:shadow-none",
        // Tombol bundar hitam (CTA arrow di banner Premium)
        brandDark:
          "bg-foreground text-background border-2 border-border rounded-full w-11 h-11 p-0",
      },
      size: {
        default: "h-12 px-6 w-full",
        icon: "h-9 w-9",
      },
    },
  }
);
```

```tsx
// Pemakaian
<Button variant="brand" size="default">
  Next <ArrowRight className="w-4 h-4" />
</Button>

<Button variant="brandIcon" size="icon">
  <ArrowLeft className="w-4 h-4" />
</Button>

<Button variant="brandDark" size="icon">
  <ArrowRight className="w-4 h-4" />
</Button>
```

### 5.2 Card — Jawaban (Answer Card)

```tsx
<Card className="rounded-3xl border-2 border-border bg-card p-5 space-y-4">
  <div>
    <p className="text-sm font-bold text-brand-purpleDark">Answer:</p>
    <p className="text-sm leading-relaxed text-foreground">
      Wind consists of moving air particles that are invisible but create
      sensations when they interact with our skin.
    </p>
  </div>
  <div>
    <p className="text-sm font-bold text-accent-foreground">Question:</p>
    <p className="text-sm leading-relaxed text-foreground">
      Why can&apos;t the wind be seen while the wind can be felt? Explain!
    </p>
  </div>
</Card>
```

### 5.3 Badge / Stat Pill

Badge dengan icon + angka (komentar, viewer), bukan badge teks status biasa.

```tsx
<Badge
  variant="outline"
  className="bg-muted border-2 border-border rounded-full px-3 py-1.5 gap-1.5 text-[13px] font-medium text-foreground"
>
  <MessageSquare className="w-4 h-4" />
  240
</Badge>
```

### 5.4 Progress Bar

Override styling default `Progress` shadcn (yang biasanya tipis & polos) agar match gaya komik.

```tsx
<Progress
  value={66}
  className="h-3 rounded-full border-2 border-border bg-card [&>div]:bg-primary [&>div]:rounded-full"
/>
```

### 5.5 Checklist Item (state "Generating...")

```tsx
function ChecklistItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
      <CheckCircle2 className="w-4 h-4" />
      {label}
    </div>
  );
}
```

### 5.6 Top App Bar

Dua varian: polos (krem) untuk Onboarding/Loading, dan gradient pink untuk halaman Answer.

```tsx
// Varian polos
<header className="flex items-center justify-between px-4 py-3">
  <Button variant="brandIcon" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
  <h1 className="font-display text-xl font-bold">Brain Orely</h1>
  <div className="w-9" /> {/* spacer biar judul tetap center */}
</header>

// Varian gradient (halaman Answer)
<header className="flex items-center justify-between px-4 py-3 bg-gradient-pink-header rounded-b-3xl">
  <Button variant="brandIcon" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
  <h1 className="font-display text-xl font-bold">Answer</h1>
  <Button variant="brandIcon" size="icon"><Bookmark className="w-4 h-4" /></Button>
</header>
```

### 5.7 Pagination Dots (Onboarding)

```tsx
function PaginationDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-2 rounded-full transition-all",
            i === active ? "w-5 bg-foreground" : "w-2 bg-muted"
          )}
        />
      ))}
    </div>
  );
}
```

### 5.8 Highlight Text (Text Marker)

Efek "stabilo" lime di belakang kata "Revelations".

```tsx
<h1 className="font-display text-[28px] font-extrabold leading-[1.15] tracking-tight">
  From Questions to{" "}
  <span className="bg-accent px-1 rounded-sm box-decoration-break-clone">
    Revelations
  </span>
</h1>
```

### 5.9 Banner Promo (Upgrade Plan)

```tsx
<div className="flex items-center justify-between rounded-2xl border-2 border-border bg-accent shadow-hard-lg p-4">
  <div className="flex items-center gap-3">
    <BookOpen className="w-8 h-8" />
    <div>
      <p className="text-sm font-semibold">Premium</p>
      <p className="text-base font-bold">$19 <span className="text-sm font-normal">per month</span></p>
    </div>
  </div>
  <Button variant="brandDark" size="icon">
    <ArrowRight className="w-4 h-4" />
  </Button>
</div>
```

---

## 6. Pola Layout per Halaman

| Halaman | Struktur | Catatan |
|---|---|---|
| **Onboarding** | Status bar → "Skip" (top-right) → Ilustrasi full-width → Heading + highlight → Body text abu-abu → Pagination dots + Button "Next" | Ilustrasi ambil porsi ±55% tinggi layar |
| **Generating/Loading** | Top App Bar polos → Heading besar → Background berubah jadi lime di area ilustrasi → Ilustrasi → "Generating..." → Checklist 2 item → Progress bar | Transisi warna background (krem → lime) terjadi tepat di bawah heading |
| **Answer** | Top App Bar gradient pink (dengan ilustrasi maskot di dalamnya) → Card jawaban (overlap ke header, rounded top besar) → 2 section (Answer/Question) → Row badge (komentar, viewer, share) → Button "Similar Answer" full-width → Section "Upgrade your plan" → Banner promo | Card jawaban menutupi sebagian header — efek "menempel" khas bottom-sheet |

---

## 7. Ilustrasi & Iconography

- **Gaya line-art**: stroke hitam tebal konsisten (~2px pada skala mobile), fill flat tanpa gradient, sedikit cross-hatch/detail kecil (titik, garis halus) sebagai aksen.
- **Maskot**: karakter robot/kucing ungu — dipakai konsisten di setiap state penting (onboarding, loading, answer) sebagai brand anchor. Sebaiknya disiapkan sebagai SVG component reusable, bukan gambar statis, supaya bisa dipakai ulang di berbagai konteks (empty state, error state, dll).
- **Icon set untuk UI (bukan ilustrasi)**: gunakan [`lucide-react`](https://lucide.dev) — sudah jadi default shadcn, stroke-width 2 di lucide sudah cukup match dengan gaya outline di sini.
- **Sparkle/bintang accent**: dipakai sebagai dekorasi dekat heading & ilustrasi (menandakan "AI/magic"). Bisa dibuat jadi 1 SVG component kecil reusable (`<SparkleAccent />`).

---

## 8. Aksesibilitas & Kontras

- Kombinasi **teks hitam di atas pastel terang** (violet `#B69CE0`, lime `#D2EE3B`, pink `#FCE0F6`) secara umum aman dari sisi kontras — pertahankan pola ini, **jangan** ganti jadi teks putih di atas warna-warna ini.
- Untuk label berwarna (`Answer:` ungu tua, `Question:` lime tua) — kontrasnya terjaga karena dipakai versi **shade gelap** dari warna aksen, bukan warna aksen itu sendiri. Ikuti pola ini kalau menambah label warna baru: selalu pakai versi gelap (`*-foreground`) untuk teks, versi terang untuk background.
- Border hitam tebal di setiap elemen interaktif sebenarnya membantu visibility batas elemen (clickable area jadi jelas) — pertahankan saat membuat state `focus-visible` (misalnya `focus-visible:ring-2 focus-visible:ring-offset-2`).
- Perhatikan gradient pink di header Answer — pastikan icon putih/hitam di atasnya (back button, bookmark) tetap pakai background solid (card putih) di belakang icon, jangan ditaruh langsung di atas gradient tanpa container.

---

## 9. Struktur File yang Disarankan

```
src/
  styles/
    globals.css        # CSS variables (Bagian 3)
  components/
    ui/                # hasil generate shadcn (button, card, badge, progress, ...)
    brand/
      SparkleAccent.tsx
      MascotIllustration.tsx
      HighlightText.tsx
      PaginationDots.tsx
tailwind.config.ts      # Bagian 4
```

---

## 10. Catatan & Disclaimer

- Semua nilai hex di atas diambil dari **sampling piksel** pada file gambar yang diunggah (bukan dari file desain sumber/Figma), sehingga ada toleransi ±beberapa unit RGB akibat kompresi gambar (PNG) dan anti-aliasing teks.
- Ukuran font, spacing, dan radius adalah **estimasi proporsional** berdasarkan rasio terhadap lebar frame mobile standar (375–414pt) — sesuaikan lagi kalau sudah ada spek resmi dari desainer.
- Kalau proyek `Posyandu ILP Mapan` ini nantinya butuh dua design system terpisah (satu untuk dashboard web admin, satu untuk app mobile seperti referensi ini), sebaiknya file ini dipisah sebagai `design-system.mobile.md` agar tidak tercampur dengan token shadcn yang sudah dipakai di web monitoring.
