---
name: calcdial-design-system
description: Design tokens, typography guidelines, and component patterns for the CalcDial platform (MindCloud Roobert typography, cosmic navy atmosphere, vibrant.design interactive pixel buttons, rounded-xl cards).
---

# CalcDial Design System Skill

Use this skill whenever building, modifying, or styling UI components, calculators, hero sections, and navigation bars in the CalcDial codebase.

## 1. Core Visual Principles
- **Atmosphere:** Dark cosmic navy (`#010918`) header that seamlessly blends into electric blue horizon beams (`#0056ec` to `#1a6efc`).
- **Typography:** Strictly use Displaay's **Roobert** font (`font-sans`). Headings must use negative letter spacing (`tracking-[-1.5px]`). Subtitles must use soft icy blue (`#badfff`).
- **Interactive Accent:** Primary action buttons must use the **Vibrant Design Pixel Matrix** (`#2b5cfd` with specular bevel, interactive canvas hover glow, and ripple physics).
- **Border Radii Law:**
  - Cards, calculators, modals: `rounded-xl` (12px).
  - Search fields and floating shells: `rounded-2xl` (16px).
  - Never use `rounded-full` for main CTA buttons or tool cards.

## 2. Reusable Components
- `<PixelButton>` from `@/components/ui/PixelButton`: Use for primary submit/action buttons.
- `<PixelLink>` from `@/components/ui/PixelButton`: Use for primary navigational CTAs.
- `.hero-mindcloud-badge`: Glassmorphic trust pill with rainbow horizon glow.
- Ghost navigation buttons: No borders or backgrounds on navbar action icons.

## 3. Reference
Always consult `DESIGN.md` in the project root for the full token specification.
