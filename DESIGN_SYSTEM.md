# VeilX — Design System

> Single source of truth for all UI tokens, components, and layout patterns.
> Templates in `templates/` use CSS custom properties defined here.

---

## 1. Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0a0a0a` | Page background |
| `--color-surface` | `#141414` | Cards, inputs, modals |
| `--color-surface-hover` | `#1a1a1a` | Hover state for surfaces |
| `--color-border` | `#262626` | Borders, dividers |
| `--color-text` | `#e5e5e5` | Primary text |
| `--color-text-muted` | `#a3a3a3` | Secondary/helper text |
| `--color-accent` | `#6366f1` | Buttons, links, active tabs |
| `--color-accent-hover` | `#818cf8` | Hover for accent elements |
| `--color-success` | `#22c55e` | Success toasts, active badge |
| `--color-error` | `#ef4444` | Error toasts, danger buttons |
| `--color-warning` | `#eab308` | Warning banners |

Theme: **dark only**. No light mode. No theme toggle.

---

## 2. Typography

| Property | Value |
|----------|-------|
| Font family | `Inter`, fallback `system-ui, sans-serif` |
| Base size | `16px` |
| Line height | `1.6` |
| Font smoothing | `-webkit-font-smoothing: antialiased` |

### Scale

| Class | Size | Weight | Usage |
|-------|------|--------|-------|
| `page__title` | `2rem` (32px) | 700 | Page headings |
| `page__subtitle` | `1.125rem` (18px) | 400 | Subheadings |
| `card__title` | `1.25rem` (20px) | 600 | Card headers |
| `section__title` | `1.5rem` (24px) | 700 | Landing sections |
| Body text | `1rem` (16px) | 400 | Paragraphs |
| Small/muted | `0.875rem` (14px) | 400 | Helpers, labels |

---

## 3. Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight gaps (icon padding) |
| `--space-sm` | `8px` | Inline gaps |
| `--space-md` | `16px` | Default padding |
| `--space-lg` | `24px` | Card padding, section gaps |
| `--space-xl` | `32px` | Section margins |
| `--space-2xl` | `48px` | Page top/bottom |
| `--space-3xl` | `64px` | Hero spacing |

---

## 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `8px` | Inputs, small buttons |
| `--radius-md` | `12px` | Cards, modals |
| `--radius-lg` | `16px` | Hero blocks |

---

## 5. Layout

| Property | Value |
|----------|-------|
| Approach | Mobile-first |
| Container max-width | `1024px` |
| Container narrow | `640px` |
| Container padding | `16px` (mobile), `24px` (desktop) |
| Breakpoint sm | `640px` |
| Breakpoint md | `768px` |
| Breakpoint lg | `1024px` |

---

## 6. Components

### 6.1 Button (`.btn`)

| Variant | BG | Text | Border |
|---------|----|------|--------|
| `btn--primary` | `--color-accent` | `#fff` | none |
| `btn--secondary` | transparent | `--color-text` | `--color-border` |
| `btn--danger` | `--color-error` | `#fff` | none |
| `btn--success` | `--color-success` | `#fff` | none (transient) |

States: hover (lighten bg), disabled (opacity 0.5, no pointer), loading (show `.spinner`).
Modifier: `btn--full` = width 100%.

### 6.2 Card (`.card`)

- Background: `--color-surface`
- Border: 1px `--color-border`
- Radius: `--radius-md`
- Padding: `--space-lg`
- Modifier: `card--muted` (dimmer bg), `card--center` (text-align center)

### 6.3 Badge (`.badge`)

| Variant | Color | Dot |
|---------|-------|-----|
| `badge--active` | `--color-success` | green circle |
| `badge--disabled` | `--color-text-muted` | gray circle |

### 6.4 Tabs (`.tabs` / `.tab`)

- Container: flex row, gap `--space-xs`, border-bottom `--color-border`
- Tab: padding `--space-sm --space-md`, text `--color-text-muted`
- Active tab: text `--color-accent`, border-bottom 2px `--color-accent`
- ARIA: `role="tablist"` / `role="tab"` / `role="tabpanel"`

### 6.5 Form Input (`.form-input`)

- BG: `--color-surface`
- Border: 1px `--color-border`
- Radius: `--radius-sm`
- Padding: `--space-sm --space-md`
- Focus: border `--color-accent`, outline none

### 6.6 Table (`.table`)

- Full-width, border-collapse
- Header: text `--color-text-muted`, font-weight 500, uppercase small
- Rows: border-bottom `--color-border`
- Mobile: `overflow-x: auto` wrapper (`.table-wrap`)

### 6.7 Modal (`.modal-overlay` / `.modal`)

- Overlay: fixed inset-0, bg `rgba(0,0,0,0.6)`, backdrop-blur 4px
- Desktop (md+): `--color-surface`, `--radius-md`, max-width 400px, centered
- Mobile (<md): bottom-sheet — width 100%, border-radius top only, padding `--space-lg`
- Transition: overlay fade-in 150ms, content slide-up 200ms ease-out
- Keyboard: Esc to close, focus trap inside modal

### 6.8 Toast (`.toast`)

- Desktop (md+): fixed bottom-right, max-width 360px
- Mobile (<md): fixed bottom-center, width `calc(100% - 32px)`
- Auto-dismiss: 3 seconds
- Transition: slide-in from right 200ms, fade-out 150ms
- `toast--success`: left border `--color-success`
- `toast--error`: left border `--color-error`

### 6.9 Alert Banner (`.alert`)

- Full-width, padding `--space-sm --space-md`
- `alert--warning`: bg `--color-warning` at 10% opacity, text `--color-warning`

### 6.10 Skeleton (`.skeleton`)

- Animated gray pulse bars
- Variants: `skeleton--text` (60% width), `skeleton--badge` (48px), `skeleton--actions` (120px)

### 6.11 Spinner (`.spinner`)

- 16x16 border spinner, `--color-accent`
- Inline display next to button text

---

## 6.12 Transitions

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Button | `background-color, opacity` | `150ms` | `ease` |
| Modal overlay | `opacity` | `150ms` | `ease` |
| Modal content | `transform (translateY)` | `200ms` | `ease-out` |
| Toast | `transform (translateX), opacity` | `200ms / 150ms` | `ease-out` |
| Tab underline | `left, width` | `150ms` | `ease` |
| Skeleton pulse | `opacity` | `1.5s` | `ease-in-out` (infinite) |

---

## 7. Templates Map

| File | Route | Description |
|------|-------|-------------|
| `templates/index.html` | `/` | Landing — hero, steps, features |
| `templates/setup.html` | `/setup` | Platform instructions with tabs |
| `templates/config.html` | `/c/{token}` | Personal config (3 states: active/disabled/404) |
| `templates/admin.html` | `/admin` | Login + dashboard (invite, table, modal, toast) |

---

## 8. Accessibility

- All interactive elements are keyboard-accessible
- ARIA roles on tabs, modals, toasts (`aria-live="polite"`)
- SVG icons use `aria-hidden="true"`, meaningful icons have `aria-label`
- Color contrast ratio > 4.5:1 for all text on bg
- Focus indicators: 2px outline `--color-accent` with offset

---

## 9. Meta

| Property | Value |
|----------|-------|
| `<title>` | `VeilX — приватный VPN` |
| `robots` | `noindex,nofollow` |
| `lang` | `ru` |
| Favicon | Shield SVG + PNG 32x32 fallback |
