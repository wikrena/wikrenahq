# UI Context

## Design Language

Wikrena Academy uses a clean, professional light-to-dark design that feels modern and trustworthy — appropriate for an AI and data company. The visual identity centres on Navy (deep authority), Teal (growth and technology), and Coral (energy and action).

All colours, shadows, and animations are defined as Tailwind tokens in `tailwind.config.ts`. Components must use these tokens — no hardcoded hex values.

## Colour Palette

All colours are defined in `tailwind.config.ts` with 10 shades (50–900).

| Palette | Base hex | Use |
|---|---|---|
| **Navy** | `#0a192f` | Primary brand dark, backgrounds, navigation |
| **Teal** | `#2ec4b6` | Primary accent, interactive elements, progress indicators |
| **Coral** | `#ff6b3d` | Secondary accent, CTAs, highlights, warnings |
| **Neutral** | `#f5f7fa` | Text, borders, subtle backgrounds |

**Usage examples:**
- Page background (dark sections): `bg-navy-800` / `bg-navy-900`
- Primary CTA button: `bg-coral-500 hover:bg-coral-600`
- Accent / active state: `bg-teal-500` / `text-teal-500`
- Body text: `text-neutral-900` (light bg) / `text-neutral-100` (dark bg)
- Muted text: `text-neutral-500`
- Card background: `bg-white` or `bg-neutral-50` on light sections, `bg-navy-700` on dark sections
- Borders: `border-neutral-200` (light) / `border-navy-600` (dark)

## Typography

| Role | Font | Tailwind class |
|---|---|---|
| Display headings | Plus Jakarta Sans | `font-display` |
| Body / UI text | Inter | `font-body` / `font-sans` |
| Code / mono | System monospace | `font-mono` / `font-code` |

Fonts are loaded via `next/font/google` and applied as CSS variables on `<html>`. Default body uses Inter with `antialiased`.

## Border Radius Scale

| Context | Class |
|---|---|
| Inputs, badges, small elements | `rounded-xl` |
| Cards, panels, dropdowns | `rounded-2xl` |
| Modals, overlays, hero sections | `rounded-3xl` |

## Shadows

| Token | Use |
|---|---|
| `shadow-surface` | Subtle card lift on light backgrounds |
| `shadow-lift` | Hovered cards and interactive panels |
| `shadow-float` | Modals, popovers, floating elements |
| `shadow-card` | Default card shadow |
| `shadow-card-hover` | Card hover state |
| `shadow-teal-glow` | Teal accent glow on interactive elements |
| `shadow-coral-glow` | Coral accent glow on CTAs |

## Animations

| Token | Use |
|---|---|
| `animate-fade-up` | Page section entrances |
| `animate-fade-in` | Overlay and dialog appearances |
| `animate-slide-right` | Side panel slide-in |
| `animate-slide-down` | Dropdown appearances |
| `animate-float` | Hero decorative elements |
| `animate-shimmer` | Loading skeleton shimmer |
| `animate-pulse-dot` | Status indicators |

Use Framer Motion for complex, orchestrated animations (stagger effects, scroll-triggered reveals). Use Tailwind animation tokens for simple one-shot transitions.

## Component Library

shadcn/ui on top of Tailwind. Foundation components live in `components/ui/`. Use the `shadcn` CLI to add new components rather than writing from scratch.

Do not modify files in `components/ui/` directly. Apply feature-specific styling at the feature-component level by wrapping or composing the foundation components.

## Icons

Lucide React — stroke-based only, no filled variants.

| Context | Size |
|---|---|
| Inline text icons | `h-4 w-4` |
| Button icons | `h-5 w-5` |
| Feature / empty state icons | `h-8 w-8` |

## Layout Patterns

**Marketing pages:**
- Full-width sections with alternating light (`bg-white` / `bg-neutral-50`) and dark (`bg-navy-800` / `bg-navy-900`) backgrounds.
- Max content width via Tailwind `container` (centred, `2xl: 1400px`).
- Section padding: `py-16 md:py-24`.

**App layout (authenticated):**
- Sidebar navigation on the left (desktop), bottom nav or drawer on mobile.
- Main content area with `px-4 md:px-8` padding.
- Dashboard cards use `rounded-2xl shadow-card` with white/light backgrounds.

**Modals and dialogs:**
- Centred overlay, `rounded-3xl`, with backdrop blur.
- Use shadcn/ui `Dialog` component as the base.

**Navbar:**
- Top bar with Navy background and bottom border on dark pages.
- Transparent over hero sections on marketing pages, transitioning to solid on scroll.
