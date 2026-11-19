# CalcDial Design System & Token Specification

> **Version:** 1.0.0 (MindCloud & Vibrant Design Alignment)  
> **Status:** Active & Enforced Across All Pages & Components  
> **Primary References:** MindCloud Typography & Radiant Horizon (`mindcloud.co`), Vibrant Design Pixel Physics (`vibrant.design`)

---

## 1. Visual Hierarchy & Philosophy

CalcDial blends high-trust financial clarity with a modern cosmic aesthetic:
1. **Cosmic Deep Atmosphere:** Deep navy atmosphere (`#010918`) with an electric blue horizon (`#0056ec` → `#1a6efc`) for high-impact hero headers.
2. **Crystal Clear White Workspace:** Calculator bodies, result cards, and tools rest on crisp, high-contrast white and zinc backgrounds (`#fcfdfd` to `#ffffff`) with zero visual fatigue.
3. **Tactile Interactive Accents:** Primary calls-to-action utilize the **Vibrant Design Pixel Matrix** (`#2b5cfd`) with real-time cursor light tracking, click ripples, and specular bevels.

---

## 2. Core Design Tokens

### A. Color Palette

| Token Name | Value | Usage |
| :--- | :--- | :--- |
| `--color-hero-bg` | `#010918` | Top header and cosmic hero base |
| `--color-horizon-start` | `#0056ec` | Center radiant light horizon start |
| `--color-horizon-end` | `#1a6efc` | Radiant electric blue gradient end |
| `--color-text-ice` | `#badfff` | Hero subheadings, secondary header text |
| `--color-pixel-accent` | `#2b5cfd` | Primary CTA buttons, interactive canvas |
| `--color-pixel-hover` | `#2554f6` | Button hover background |
| `--color-pixel-ring` | `#1b3cb5` | Inset border ring for pixel buttons |
| `--color-surface-card` | `#ffffff` | Clean white cards and floating search bar |
| `--color-surface-subtle` | `#f8fafc` | Input boxes, presets, inactive toggle backgrounds |
| `--color-border-card` | `rgba(228, 228, 231, 0.8)` | Subtle border (`border-zinc-200/80`) |
| `--color-profit-green` | `#059669` | Net profit text, positive margin pills (`emerald-600`) |
| `--color-fee-red` | `#dc2626` | Platform deductions, fee splits (`rose-600`) |

---

### B. Typography Tokens

We use Displaay Foundry's **Roobert** font for modern geometric precision across all headlines, complemented by clean monospace numbers.

- **Primary Font Family:** `'Roobert', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Monospace Numbers:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

#### Type Scales:
- **Hero Title (H1):** `text-3xl sm:text-[44px] md:text-[48px] font-medium tracking-[-1.5px] leading-[1.15] sm:leading-[52px]`
- **Hero Subtitle:** `text-[15px] sm:text-[16px] text-[#badfff]/90 leading-[24px] tracking-[-0.16px] font-normal`
- **Section Heading (H2):** `text-xl sm:text-2xl font-bold tracking-tight text-zinc-950`
- **Eyebrow / Overline:** `text-[11px] font-bold uppercase tracking-wider text-blue-600`
- **Currency Outputs:** `font-bold font-mono text-2xl sm:text-3xl text-zinc-950 tracking-tight`
- **Button Labels:** `font-bold text-white text-sm sm:text-base [text-shadow:0_1px_2px_rgb(10_30_120/0.75)]`

---

### C. Border Radius Contract

To maintain architectural cohesion, CalcDial enforces a **strict radius scale**:

| Element Type | Tailwind Class | Pixel Value | Rule |
| :--- | :--- | :--- | :--- |
| **Main Cards & Calculators** | `rounded-xl` | `12px` | Mandatory for all tool and result modules |
| **Search Input & Outer Shells**| `rounded-2xl` | `16px` | Used for floating search card and outer modal |
| **Buttons & Controls** | `rounded-xl` or `rounded-lg` | `12px` / `8px` | **Never** use pill `rounded-full` for main CTA buttons |
| **Status Pills & Toggles** | `rounded-full` | `9999px` | Reserved exclusively for badges, switches, and margin pills |

---

### D. Elevation & Shadows

- **Floating Search Card:**
  `shadow-[0_12px_32px_rgba(0,0,0,0.18)] border border-white/80`
- **Pixel CTA Button:**
  `shadow-[inset_0_1px_0_0_rgb(255_255_255/0.4),inset_0_-1px_0_0_rgb(10_30_120/0.4),0_6px_16px_-6px_rgb(43_92_253/0.55),0_1px_2px_rgb(27_60_181/0.3)]`
- **Pixel CTA Hover:**
  `shadow-[inset_0_1px_0_0_rgb(255_255_255/0.5),inset_0_-1px_0_0_rgb(10_30_120/0.45),0_8px_22px_-4px_rgb(43_92_253/0.7),0_2px_4px_rgb(27_60_181/0.35)]`
- **Interactive Card Hover:**
  `shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-zinc-300 -translate-y-0.5`

---

## 3. Reusable Component Patterns

### 1. The Interactive Pixel Button (`<PixelButton>` / `<PixelLink>`)
All primary submission and navigational CTA buttons must use the pixel engine (`src/components/ui/PixelButton.tsx`):
- HTML5 Canvas overlay tracking real-time cursor position with animated pixel sparkle.
- Click water-ripple waves expanding across the button face.
- Top specular inset reflection highlight (`inset 0 1px 0 0 rgba(255,255,255,0.4)`).
- High contrast bold white typography with dark blue text shadow.

```tsx
import { PixelButton, PixelLink } from "@/components/ui/PixelButton";

<PixelButton type="submit" className="px-5 py-2.5 rounded-xl">
  Calculate Net Profit
</PixelButton>
```

### 2. Glassmorphic Trust Badge
Used above major titles for verification signals:
```html
<div class="hero-mindcloud-badge animate-hero-badge mb-6 select-none cursor-default">
  <span class="size-2 rounded-full bg-emerald-400 animate-pulse relative z-10" />
  <span class="relative z-10 opacity-90 text-[11px] sm:text-xs text-white">Official Rates Verified</span>
  <span class="w-px h-3.5 bg-white/20 relative z-10" />
  <span class="relative z-10 text-blue-200 font-semibold text-[11px] sm:text-xs">2026 Updated</span>
</div>
```

### 3. Ghost Navbar Action Buttons
Navigation actions (search, mobile menu) must remain clean ghost icon buttons without distracting boxy borders or solid backgrounds:
```tsx
<button
  type="button"
  className="flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer text-white/80 hover:text-white hover:bg-white/10"
  aria-label="Search"
>
  <Search className="size-5" />
</button>
```

---

## 4. Animation Guidelines (MindCloud Standard)

- **Entry Animations:** On load, hero elements follow staggered `hero-copy-in` (0.82s cubic-bezier(0.16, 1, 0.3, 1)):
  1. Badge: Delay `0.05s`
  2. Headline: Delay `0.18s`
  3. Subtitle: Delay `0.28s`
  4. Search CTA: Delay `0.38s` with `hero-cta-surface-in` and `hero-cta-bloom`
- **Zero Content Layout Shift (CLS):** Every interactive state, number update, and tab change must preserve bounding box layout to prevent Google AdSense and SEO penalties.

---

## 5. Anti-Slop Code Review Checklist

Before creating or editing any calculator or page, verify:
- [ ] Are buttons using `rounded-xl` instead of generic `rounded-full`?
- [ ] Is raw calculation math isolated into pure functions under `src/lib/`?
- [ ] Are input values and currency outputs using monospace numbers for crisp readability?
- [ ] Are primary CTAs using `<PixelButton>` or `<PixelLink>`?
- [ ] Does the navbar smoothly adapt between transparent on dark hero and frosted glass on light content?
