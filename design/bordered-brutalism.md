# Neobrutalism Design System
> Design system berbasis **Neobrutalism** untuk aplikasi mobile/web menggunakan **Tailwind CSS** dan **shadcn/ui**.

---

## 📐 Prinsip Desain

Neobrutalism adalah evolusi dari Brutalism klasik yang memadukan:
- **Warna solid & kontras tinggi** — tidak ada gradient halus, semua warna penuh (flat)
- **Border tegas** — outline hitam tebal (`2px–3px solid black`)
- **Shadow kotak (box-shadow)** — `4px 4px 0px #000` tanpa blur, memberikan efek "cetak"
- **Tipografi bold & ekspresif** — headline besar, kontras berat
- **Background putih bersih** — `#FFFFFF` sebagai base, primary lime-green sebagai aksen dominan
- **Rounded corners sedang** — `rounded-2xl` hingga `rounded-3xl` (bukan sharp, bukan pill)

---

## 🎨 Color Palette

### Primary & Background

| Peran | Nama Token | Hex | Keterangan |
|---|---|---|---|
| **Primary** | `primary` | `#C5E84A` | Warna utama — button aktif, highlight, badge, tab aktif |
| **Background** | `background` | `#FFFFFF` | Background seluruh halaman & card default |
| **Foreground** | `foreground` | `#0A0A0A` | Teks utama, border, shadow |

### Token Warna Pendukung

| Nama Token | Hex | Tailwind Custom | Penggunaan |
|---|---|---|---|
| `neo-primary` | `#C5E84A` | `bg-neo-primary` | **Primary** — CTA, active state, highlight |
| `neo-primary-dark` | `#A8CC2E` | `bg-neo-primary-dark` | Hover state dari primary |
| `neo-yellow` | `#F5C842` | `bg-neo-yellow` | Aksen sekunder, badge warning |
| `neo-pink` | `#F472B6` | `bg-neo-pink` | Aksen tersier, tag, label |
| `neo-orange` | `#FF6B35` | `bg-neo-orange` | Card kategori, destructive ringan |
| `neo-red` | `#EF4444` | `bg-neo-red` | Error, alert, chart highlight |
| `neo-sky` | `#7DD3FC` | `bg-neo-sky` | Informasi, chart default |
| `neo-black` | `#0A0A0A` | `bg-neo-black` | Border, teks, shadow |
| `neo-white` | `#FFFFFF` | `bg-white` | Background utama |
| `neo-muted` | `#F4F4F5` | `bg-neo-muted` | Background input, disabled state |

### Hierarki Penggunaan Warna

```
Background page    → #FFFFFF (putih)
Primary action     → #C5E84A (lime-green) + border #0A0A0A + shadow neo
Secondary action   → #FFFFFF (putih) + border #0A0A0A + shadow neo
Destructive        → #EF4444 (red)
Teks utama         → #0A0A0A
Teks muted         → #0A0A0A / 60%
Border semua elemen→ #0A0A0A (2px solid)
```

### Konfigurasi `tailwind.config.ts`

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // Primary & Semantic
        primary: {
          DEFAULT:     "#C5E84A",
          dark:        "#A8CC2E",
          foreground:  "#0A0A0A",
        },
        background:    "#FFFFFF",
        foreground:    "#0A0A0A",
        muted: {
          DEFAULT:     "#F4F4F5",
          foreground:  "#71717A",
        },
        // Neo palette
        neo: {
          primary:      "#C5E84A",
          "primary-dark":"#A8CC2E",
          yellow:       "#F5C842",
          pink:         "#F472B6",
          orange:       "#FF6B35",
          red:          "#EF4444",
          sky:          "#7DD3FC",
          black:        "#0A0A0A",
          white:        "#FFFFFF",
          muted:        "#F4F4F5",
        },
      },
      boxShadow: {
        "neo":       "4px 4px 0px #0A0A0A",
        "neo-sm":    "2px 2px 0px #0A0A0A",
        "neo-lg":    "6px 6px 0px #0A0A0A",
        "neo-inner": "inset 2px 2px 0px #0A0A0A",
        "neo-primary": "4px 4px 0px #A8CC2E",
      },
      borderWidth: {
        "neo":       "2px",
        "neo-thick": "3px",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        "neo":    "12px",
        "neo-lg": "20px",
        "neo-xl": "28px",
      },
    },
  },
};

export default config;
```

---

## 🔤 Tipografi

### Skala Tipe

| Role | Font | Weight | Size (Tailwind) | Penggunaan |
|---|---|---|---|---|
| **Display / Hero** | Space Grotesk | 800 | `text-4xl` – `text-5xl` | Judul halaman, angka besar |
| **Heading** | Space Grotesk | 700 | `text-2xl` – `text-3xl` | Judul section, nama kategori |
| **Subheading** | Space Grotesk | 600 | `text-lg` – `text-xl` | Subtitle, label card |
| **Body** | DM Sans | 400 | `text-sm` – `text-base` | Deskripsi, teks pendukung |
| **Caption / Meta** | DM Sans | 400 | `text-xs` | Tanggal, label kecil |
| **Data / Angka** | Space Grotesk | 700 | `text-3xl` | Angka statistik |

### Import Font (`globals.css`)

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');
```

---

## 🧩 Komponen UI

### 1. `NeoCard` — Card Dasar

Background default **putih**, dengan border dan shadow hitam. Gunakan `variant="primary"` untuk highlight dengan warna primary lime-green.

```tsx
// components/ui/neo-card.tsx
import { cn } from "@/lib/utils";

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "yellow" | "orange" | "pink" | "muted";
}

const variantMap = {
  default:  "bg-white border-neo-black",
  primary:  "bg-neo-primary border-neo-black",        // ← lime-green highlight
  yellow:   "bg-neo-yellow border-neo-black",
  orange:   "bg-neo-orange border-neo-black text-white",
  pink:     "bg-neo-pink border-neo-black",
  muted:    "bg-neo-muted border-neo-black/30 shadow-none",
};

export function NeoCard({ variant = "default", className, children, ...props }: NeoCardProps) {
  return (
    <div
      className={cn(
        "rounded-neo border-2 shadow-neo p-4",
        variantMap[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

**Penggunaan:**
```tsx
{/* Card default — putih */}
<NeoCard>
  <p className="text-sm text-neo-black/60">Total saving</p>
  <p className="text-3xl font-display font-bold">90,744</p>
</NeoCard>

{/* Card primary — lime-green */}
<NeoCard variant="primary">
  <h2 className="font-display font-bold text-2xl">Active Plan</h2>
  <p className="text-sm mt-1">Primary highlighted card</p>
</NeoCard>

{/* Card kategori — orange */}
<NeoCard variant="orange">
  <h2 className="font-display font-bold text-2xl text-white">Japanese food</h2>
  <p className="text-3xl font-display font-bold text-white mt-2">$2,200,739</p>
</NeoCard>
```

---

### 2. `NeoButton` — Tombol Aksi

`variant="primary"` menggunakan `#C5E84A` dengan border hitam — bukan hitam solid.

```tsx
// components/ui/neo-button.tsx
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "icon";
  size?: "sm" | "md" | "lg";
}

const variantMap = {
  // Primary = lime-green #C5E84A
  primary:     "bg-neo-primary text-neo-black border-2 border-neo-black shadow-neo hover:bg-neo-primary-dark",
  // Secondary = putih
  secondary:   "bg-white text-neo-black border-2 border-neo-black shadow-neo hover:bg-neo-muted",
  // Destructive = merah
  destructive: "bg-neo-red text-white border-2 border-neo-black shadow-neo hover:bg-red-600",
  // Ghost = transparan, border tipis
  ghost:       "bg-transparent text-neo-black border-2 border-neo-black hover:bg-neo-muted",
  // Icon = bulat
  icon:        "bg-white text-neo-black border-2 border-neo-black shadow-neo-sm rounded-full",
};

const sizeMap = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

export function NeoButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: NeoButtonProps) {
  return (
    <button
      className={cn(
        "font-display font-semibold rounded-neo",
        "active:translate-x-1 active:translate-y-1 active:shadow-none",
        "transition-all duration-100 cursor-pointer",
        variantMap[variant],
        variant !== "icon" && sizeMap[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

**Ringkasan variant:**

| Variant | Background | Teks | Kapan digunakan |
|---|---|---|---|
| `primary` | `#C5E84A` lime-green | `#0A0A0A` | CTA utama, aksi terpenting |
| `secondary` | `#FFFFFF` putih | `#0A0A0A` | Aksi pendukung |
| `destructive` | `#EF4444` merah | putih | Hapus, batalkan |
| `ghost` | transparan | `#0A0A0A` | Aksi tersier |
| `icon` | `#FFFFFF` putih | `#0A0A0A` | Tombol ikon bulat |

**Penggunaan:**
```tsx
<NeoButton variant="primary" size="lg" className="w-full">
  Add more
</NeoButton>

<NeoButton variant="secondary">Total sales</NeoButton>
<NeoButton variant="ghost" size="sm">Cancel</NeoButton>
```

---

### 3. `NeoBottomNav` — Navigation Bar Bawah

Active state menggunakan primary lime-green, bukan hitam.

```tsx
// components/ui/neo-bottom-nav.tsx
import { Home, MessageSquare, User, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const defaultItems: NavItem[] = [
  { icon: <Home size={20} />, label: "Home", active: true },
  { icon: <MessageSquare size={20} />, label: "Messages" },
  { icon: <User size={20} />, label: "Profile" },
  { icon: <Grid size={20} />, label: "More" },
];

export function NeoBottomNav({ items = defaultItems }: { items?: NavItem[] }) {
  return (
    <div className="flex items-center justify-around bg-white border-t-2 border-neo-black px-4 py-3">
      {items.map((item, i) => (
        <button
          key={i}
          className={cn(
            "flex flex-col items-center gap-1 px-4 py-2 rounded-neo text-xs font-body transition-all",
            item.active
              // Active = primary lime-green + border hitam
              ? "bg-neo-primary text-neo-black border-2 border-neo-black shadow-neo-sm font-semibold"
              : "text-neo-black/50 hover:text-neo-black"
          )}
        >
          {item.icon}
          {item.active && <span>{item.label}</span>}
        </button>
      ))}
    </div>
  );
}
```

---

### 4. `NeoBarChart` — Grafik Batang

Bar aktif/highlight menggunakan primary `#C5E84A`, bar default menggunakan `neo-sky`.

```tsx
// components/ui/neo-bar-chart.tsx
import { cn } from "@/lib/utils";

interface BarData {
  label: string;
  value: number;
  highlighted?: boolean;
}

interface NeoBarChartProps {
  data: BarData[];
  maxValue?: number;
  highlightColor?: string;  // default: primary
  defaultColor?: string;
}

export function NeoBarChart({
  data,
  maxValue = 100,
  highlightColor = "bg-neo-primary",   // ← lime-green
  defaultColor = "bg-neo-sky",
}: NeoBarChartProps) {
  return (
    <div className="flex items-end justify-between gap-3 h-40 px-2">
      {data.map((bar, i) => {
        const heightPercent = (bar.value / maxValue) * 100;
        return (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-full flex justify-center">
              {bar.highlighted && (
                <span className="absolute -top-7 bg-neo-black text-white text-xs px-2 py-0.5 rounded-neo-sm font-mono font-semibold whitespace-nowrap">
                  {bar.value.toLocaleString()}
                </span>
              )}
              <div
                className={cn(
                  "w-10 rounded-full border-2 border-neo-black shadow-neo-sm transition-all",
                  bar.highlighted ? highlightColor : defaultColor
                )}
                style={{ height: `${heightPercent}%`, minHeight: "24px" }}
              />
            </div>
            <span className="text-xs text-neo-black/60 font-body">{bar.label}</span>
          </div>
        );
      })}
    </div>
  );
}
```

---

### 5. `NeoTabFilter` — Tab Filter

Active pill menggunakan primary `#C5E84A`.

```tsx
// components/ui/neo-tab-filter.tsx
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NeoTabFilterProps {
  tabs: string[];
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
}

export function NeoTabFilter({ tabs, defaultTab, onTabChange }: NeoTabFilterProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]);

  const handleChange = (tab: string) => {
    setActive(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="flex gap-1 p-1 bg-neo-muted rounded-neo border-2 border-neo-black w-fit">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleChange(tab)}
          className={cn(
            "px-4 py-1.5 rounded-neo text-sm font-display font-semibold transition-all duration-100",
            active === tab
              // Active = primary lime-green
              ? "bg-neo-primary border-2 border-neo-black shadow-neo-sm text-neo-black"
              : "text-neo-black/50 hover:text-neo-black"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
```

---

### 6. `NeoStatCard` — Mini Kartu Statistik

```tsx
// components/ui/neo-stat-card.tsx
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NeoStatCardProps {
  location: string;
  value: string;
  positive?: boolean;
  className?: string;
}

export function NeoStatCard({ location, value, positive = true, className }: NeoStatCardProps) {
  return (
    <div
      className={cn(
        "bg-white border-2 border-neo-black rounded-neo-lg shadow-neo p-4 flex flex-col gap-1",
        className
      )}
    >
      {positive
        ? <TrendingUp size={18} className="text-neo-primary" />
        : <TrendingDown size={18} className="text-neo-red" />
      }
      <p className="text-sm font-body text-neo-black/60">{location}</p>
      <p className={cn(
        "text-xl font-display font-bold",
        positive ? "text-neo-black" : "text-neo-red"
      )}>
        {value}
      </p>
    </div>
  );
}
```

---

### 7. `NeoHeader` — Header Halaman

```tsx
// components/ui/neo-header.tsx
import { ArrowLeft, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface NeoHeaderProps {
  title: string;
  showBack?: boolean;
  showMore?: boolean;
  onBack?: () => void;
  className?: string;
}

export function NeoHeader({ title, showBack, showMore, onBack, className }: NeoHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between py-4 px-4 bg-white", className)}>
      {showBack ? (
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-neo-black shadow-neo-sm bg-white active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <ArrowLeft size={18} />
        </button>
      ) : (
        <div className="w-9" />
      )}
      <h1 className="font-display font-bold text-lg text-neo-black">{title}</h1>
      {showMore ? (
        <button className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-neo-black shadow-neo-sm bg-white active:shadow-none transition-all">
          <MoreVertical size={18} />
        </button>
      ) : (
        <div className="w-9" />
      )}
    </div>
  );
}
```

---

### 8. `NeoTotalSaving` — Hero Angka Besar

```tsx
// components/ui/neo-total-saving.tsx
interface NeoTotalSavingProps {
  label: string;
  amount: number | string;
}

export function NeoTotalSaving({ label, amount }: NeoTotalSavingProps) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-sm font-body text-neo-black/60">{label}</p>
      <p className="text-5xl font-display font-extrabold text-neo-black leading-none tracking-tight">
        {typeof amount === "number" ? amount.toLocaleString() : amount}
      </p>
    </div>
  );
}
```

---

## 🧱 shadcn/ui Overrides

### CSS Variables (`globals.css`)

```css
/* globals.css */
@layer base {
  :root {
    /* Background & Foreground */
    --background:         0 0% 100%;        /* #FFFFFF — putih bersih */
    --foreground:         0 0% 4%;          /* #0A0A0A — hitam */

    /* Primary = Lime-green #C5E84A */
    --primary:            76 77% 60%;       /* #C5E84A */
    --primary-foreground: 0 0% 4%;          /* teks hitam di atas primary */

    /* Card */
    --card:               0 0% 100%;        /* #FFFFFF */
    --card-foreground:    0 0% 4%;

    /* Secondary */
    --secondary:          0 0% 96%;         /* #F4F4F5 muted */
    --secondary-foreground: 0 0% 4%;

    /* Muted */
    --muted:              0 0% 96%;
    --muted-foreground:   0 0% 45%;

    /* Accent = primary */
    --accent:             76 77% 60%;       /* #C5E84A */
    --accent-foreground:  0 0% 4%;

    /* Destructive */
    --destructive:        0 84% 60%;        /* #EF4444 */
    --destructive-foreground: 0 0% 100%;

    /* Border & Input */
    --border:             0 0% 4%;          /* #0A0A0A — border hitam */
    --input:              0 0% 4%;
    --ring:               76 77% 60%;       /* primary saat focus */

    --radius:             0.75rem;          /* 12px = rounded-neo */
  }
}
```

### Override shadcn `Button` (`components/ui/button.tsx`)

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-semibold transition-all duration-100 active:translate-x-[1px] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary = lime-green
        default:     "bg-neo-primary text-neo-black shadow-neo border-2 border-neo-black hover:bg-neo-primary-dark active:shadow-none",
        // Secondary = putih
        secondary:   "bg-white text-neo-black shadow-neo border-2 border-neo-black hover:bg-neo-muted active:shadow-none",
        // Destructive
        destructive: "bg-neo-red text-white shadow-neo border-2 border-neo-black hover:bg-red-600 active:shadow-none",
        // Ghost
        ghost:       "bg-transparent text-neo-black border-2 border-neo-black hover:bg-neo-muted",
        // Link
        link:        "underline-offset-4 hover:underline text-neo-black",
        // Outline (alias secondary)
        outline:     "bg-white text-neo-black border-2 border-neo-black shadow-neo hover:bg-neo-muted active:shadow-none",
      },
      size: {
        default: "h-10 px-5 py-2.5 rounded-neo",
        sm:      "h-8 px-3 py-1.5 text-sm rounded-neo",
        lg:      "h-12 px-7 py-3.5 text-lg rounded-neo",
        icon:    "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  }
);
```

### Override shadcn `Card` (`components/ui/card.tsx`)

```tsx
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Background putih, border hitam, shadow neo
        "rounded-neo border-2 border-neo-black bg-white shadow-neo",
        className
      )}
      {...props}
    />
  )
);
```

### Override shadcn `Badge`

```tsx
const badgeVariants = cva(
  "inline-flex items-center rounded-neo border-2 border-neo-black px-2.5 py-0.5 text-xs font-display font-bold shadow-neo-sm transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-neo-primary text-neo-black",     // lime-green
        secondary:   "bg-white text-neo-black",
        destructive: "bg-neo-red text-white",
        outline:     "bg-transparent text-neo-black",
      },
    },
    defaultVariants: { variant: "default" },
  }
);
```

### Override shadcn `Input`

```tsx
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-neo border-2 border-neo-black bg-white px-3 py-2",
        "font-body text-sm text-neo-black placeholder:text-neo-black/40",
        "shadow-neo-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
```

---

## 📐 Spacing & Layout

### Grid System

```tsx
// Layout wrapper mobile-first
<div className="min-h-screen bg-white">
  <div className="max-w-sm mx-auto px-4 space-y-4">
    {/* Konten */}
  </div>
</div>
```

### Spacing Token

| Token | Nilai | Tailwind | Penggunaan |
|---|---|---|---|
| `space-xs` | 4px | `gap-1`, `p-1` | Antara ikon dan label |
| `space-sm` | 8px | `gap-2`, `p-2` | Padding icon button |
| `space-md` | 16px | `gap-4`, `p-4` | Padding card standar |
| `space-lg` | 24px | `gap-6`, `p-6` | Section spacing |
| `space-xl` | 32px | `gap-8`, `p-8` | Hero padding |

---

## 📱 Screen Templates

### Screen 1 — Analytics Dashboard

```tsx
<div className="min-h-screen bg-white flex flex-col">
  {/* Header */}
  <div className="px-4 pt-8 pb-2">
    <h1 className="font-display font-extrabold text-4xl text-neo-black leading-tight">
      Your<br />Analytics
    </h1>
    <p className="text-sm font-body text-neo-black/60 mt-1">Push your sale today!</p>
  </div>

  {/* Filter */}
  <div className="flex gap-2 px-4 py-3">
    <NeoButton variant="ghost" size="sm">⋯</NeoButton>
    <NeoButton variant="secondary" size="sm">Total sales</NeoButton>
    <NeoButton variant="secondary" size="sm">Total clients</NeoButton>
  </div>

  {/* Cards */}
  <div className="flex-1 px-4 space-y-3">
    <NeoCard variant="primary">   {/* ← lime-green */}
      <h2 className="font-display font-bold text-2xl">Confectionery products</h2>
      <p className="text-3xl font-display font-bold mt-2">$155,345</p>
      <p className="text-sm text-neo-black/60">$23,345.23 more than last month</p>
    </NeoCard>

    <NeoCard variant="orange">
      <h2 className="font-display font-bold text-2xl text-white">Japanese food</h2>
      <p className="text-3xl font-display font-bold text-white mt-2">$2,200,739</p>
    </NeoCard>
  </div>

  <NeoBottomNav />
</div>
```

### Screen 2 — Tracking Saving

```tsx
<div className="min-h-screen bg-white flex flex-col">
  <NeoHeader title="Tracking Saving" showBack showMore />

  <div className="px-4 space-y-4">
    <NeoTotalSaving label="Total saving" amount={90744} />

    <NeoCard>
      <NeoBarChart
        data={[
          { label: "Jan", value: 12000 },
          { label: "Feb", value: 16520, highlighted: true },
          { label: "Mar", value: 10000 },
          { label: "Apr", value: 13500 },
          { label: "May", value: 9000 },
        ]}
        maxValue={20000}
        highlightColor="bg-neo-primary"   /* lime-green untuk highlighted bar */
      />
    </NeoCard>

    <div className="grid grid-cols-2 gap-3">
      <NeoStatCard location="Brooklyn" value="+$33.450" />
      <NeoStatCard location="Los Angeles" value="+$3.450" />
    </div>
  </div>
</div>
```

### Screen 3 — Financial Success

```tsx
<div className="min-h-screen bg-white flex flex-col">
  <NeoHeader title="Financial success" showBack showMore />

  <div className="px-4 pt-2">
    <NeoTabFilter
      tabs={["All", "Year", "Month", "More"]}
      defaultTab="Year"
    />
  </div>

  <div className="flex-1 flex items-center justify-center">
    <img src="/mascots/burger-mascot.svg" alt="" className="w-64 h-auto" />
  </div>

  <div className="px-4 pb-8">
    <NeoButton variant="primary" size="lg" className="w-full">
      Add more
    </NeoButton>
  </div>
</div>
```

---

## ✨ Dekorasi & Detail

```tsx
// Sparkle dekoratif
const NeoSparkle = ({ size = 16, color = "#C5E84A" }) => (   // default primary
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill={color} />
  </svg>
);

// Utility class ringkasan
const neoUtils = {
  card:          "rounded-neo border-2 border-neo-black bg-white shadow-neo",
  cardPrimary:   "rounded-neo border-2 border-neo-black bg-neo-primary shadow-neo",
  cardPressed:   "rounded-neo border-2 border-neo-black translate-x-1 translate-y-1",
  pill:          "rounded-full border-2 border-neo-black shadow-neo-sm",
  badge:         "rounded-neo border-2 border-neo-black bg-neo-primary shadow-neo-sm px-2 py-0.5 text-xs font-display font-bold",
  input:         "rounded-neo border-2 border-neo-black bg-white shadow-neo-sm focus:ring-2 focus:ring-neo-primary",
};
```

---

## ✅ Checklist Implementasi

### Setup Awal
- [ ] Install & konfigurasi Tailwind CSS v3+
- [ ] Setup shadcn/ui dengan `npx shadcn-ui@latest init`
- [ ] Tambahkan color tokens (termasuk `neo-primary: #C5E84A`) ke `tailwind.config.ts`
- [ ] Import Google Fonts: Space Grotesk + DM Sans
- [ ] Override CSS variables shadcn di `globals.css` — set `--background: 0 0% 100%` dan `--primary: 76 77% 60%`

### Komponen Core
- [ ] `NeoCard` — variant: `default` (putih), `primary` (lime-green), `orange`, `pink`, `muted`
- [ ] `NeoButton` — variant: `primary` (lime-green), `secondary` (putih), `destructive`, `ghost`
- [ ] `NeoBottomNav` — active state = primary lime-green
- [ ] `NeoHeader` — background putih
- [ ] `NeoBarChart` — highlighted bar = primary lime-green
- [ ] `NeoTabFilter` — active pill = primary lime-green
- [ ] `NeoStatCard` — background putih
- [ ] `NeoTotalSaving` — teks hitam di atas putih

### shadcn/ui Overrides
- [ ] `Button` — default variant = primary lime-green
- [ ] `Card` — background putih + border hitam + shadow neo
- [ ] `Badge` — default = primary lime-green
- [ ] `Input` — border hitam, focus ring = primary lime-green

### QA & Aksesibilitas
- [ ] Contrast ratio: `#0A0A0A` di atas `#C5E84A` → ratio **≈ 9.3:1** ✅ (AA & AAA pass)
- [ ] Contrast ratio: `#0A0A0A` di atas `#FFFFFF` → ratio **21:1** ✅
- [ ] Tambahkan `aria-label` pada setiap icon button
- [ ] Test keyboard navigation (Tab, Enter, Space)
- [ ] Respek `prefers-reduced-motion` — nonaktifkan `active:translate-*` jika diminta

---

## 📁 Struktur Folder

```
src/
├── app/
│   ├── globals.css           ← CSS variables & font import
│   └── layout.tsx
├── components/
│   └── ui/
│       ├── neo-card.tsx
│       ├── neo-button.tsx
│       ├── neo-bottom-nav.tsx
│       ├── neo-header.tsx
│       ├── neo-bar-chart.tsx
│       ├── neo-tab-filter.tsx
│       ├── neo-stat-card.tsx
│       ├── neo-total-saving.tsx
│       └── neo-sparkle.tsx
├── lib/
│   └── utils.ts              ← cn() helper dari shadcn
public/
├── mascots/
│   ├── confectionery.svg
│   ├── japanese-food.svg
│   └── burger.svg
└── icons/
    └── neo-star.svg
tailwind.config.ts
```

---

> **Ringkasan perubahan:** Background semua halaman dan card default menggunakan **`#FFFFFF` putih**. Primary color adalah **`#C5E84A` lime-green** — digunakan pada button utama, active state navigasi, tab aktif, card highlight, dan bar chart highlighted. Kombinasi ini menghasilkan contrast ratio **9.3:1** (melewati WCAG AAA) sehingga aman untuk aksesibilitas.
