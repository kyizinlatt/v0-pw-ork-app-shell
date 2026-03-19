# PWORK Color Palette

## Overview
The PWORK design system uses **OKLch color space** for superior perceptual uniformity across light and dark modes. All colors are defined as CSS custom properties with semantic naming conventions.

---

## Core Colors

### Background & Surface
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--background` | White (oklch(1 0 0)) | Near-Black (oklch(0.145 0 0)) | Page/container background |
| `--card` | White (oklch(1 0 0)) | Near-Black (oklch(0.145 0 0)) | Card/panel backgrounds |
| `--popover` | White (oklch(1 0 0)) | Near-Black (oklch(0.145 0 0)) | Dropdown/tooltip backgrounds |

### Text & Foreground
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--foreground` | Near-Black (oklch(0.145 0 0)) | White (oklch(0.985 0 0)) | Primary text content |
| `--card-foreground` | Near-Black (oklch(0.145 0 0)) | White (oklch(0.985 0 0)) | Text on cards |
| `--popover-foreground` | Near-Black (oklch(0.145 0 0)) | White (oklch(0.985 0 0)) | Text in popovers |

### Interactive Elements
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--primary` | Dark Gray (oklch(0.205 0 0)) | White (oklch(0.985 0 0)) | Primary buttons, active states |
| `--primary-foreground` | White (oklch(0.985 0 0)) | Dark Gray (oklch(0.205 0 0)) | Text on primary buttons |
| `--secondary` | Light Gray (oklch(0.97 0 0)) | Charcoal (oklch(0.269 0 0)) | Secondary UI elements |
| `--secondary-foreground` | Dark Gray (oklch(0.205 0 0)) | White (oklch(0.985 0 0)) | Text on secondary elements |

### Status & Semantic
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--muted` | Light Gray (oklch(0.97 0 0)) | Charcoal (oklch(0.269 0 0)) | Disabled states, placeholders |
| `--muted-foreground` | Medium Gray (oklch(0.556 0 0)) | Light Gray (oklch(0.708 0 0)) | Secondary text, hints |
| `--accent` | Light Gray (oklch(0.97 0 0)) | Charcoal (oklch(0.269 0 0)) | Hover/focus states |
| `--accent-foreground` | Dark Gray (oklch(0.205 0 0)) | White (oklch(0.985 0 0)) | Text on accent backgrounds |
| `--destructive` | Red (oklch(0.577 0.245 27.325)) | Red (oklch(0.396 0.141 25.723)) | Error states, delete actions |

### Structural
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--border` | Very Light Gray (oklch(0.922 0 0)) | Dark Gray (oklch(0.269 0 0)) | Borders, dividers, lines |
| `--input` | Very Light Gray (oklch(0.922 0 0)) | Dark Gray (oklch(0.269 0 0)) | Input fields, form elements |
| `--ring` | Medium Gray (oklch(0.708 0 0)) | Medium Gray (oklch(0.439 0 0)) | Focus rings, selection outlines |

---

## Sidebar Colors

The sidebar has its own color scheme for visual distinction from main content.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--sidebar` | Off-White (oklch(0.985 0 0)) | Dark Gray (oklch(0.205 0 0)) | Sidebar background |
| `--sidebar-foreground` | Near-Black (oklch(0.145 0 0)) | Off-White (oklch(0.985 0 0)) | Sidebar text |
| `--sidebar-primary` | Dark Gray (oklch(0.205 0 0)) | Indigo (oklch(0.488 0.243 264.376)) | Active menu items |
| `--sidebar-primary-foreground` | Off-White (oklch(0.985 0 0)) | Off-White (oklch(0.985 0 0)) | Text on active items |
| `--sidebar-accent` | Light Gray (oklch(0.97 0 0)) | Charcoal (oklch(0.269 0 0)) | Hover/focus in sidebar |
| `--sidebar-accent-foreground` | Dark Gray (oklch(0.205 0 0)) | Off-White (oklch(0.985 0 0)) | Text on sidebar accent |
| `--sidebar-border` | Very Light Gray (oklch(0.922 0 0)) | Dark Gray (oklch(0.269 0 0)) | Sidebar dividers |
| `--sidebar-ring` | Medium Gray (oklch(0.708 0 0)) | Medium Gray (oklch(0.439 0 0)) | Sidebar focus rings |

---

## Chart & Data Visualization

| Token | Light | Dark | RGB Equivalent | Usage |
|-------|-------|------|-----------------|-------|
| `--chart-1` | Orange (oklch(0.646 0.222 41.116)) | Purple (oklch(0.488 0.243 264.376)) | Chart series 1 |
| `--chart-2` | Blue (oklch(0.6 0.118 184.704)) | Cyan (oklch(0.696 0.17 162.48)) | Chart series 2 |
| `--chart-3` | Indigo (oklch(0.398 0.07 227.392)) | Yellow (oklch(0.769 0.188 70.08)) | Chart series 3 |
| `--chart-4` | Yellow (oklch(0.828 0.189 84.429)) | Magenta (oklch(0.627 0.265 303.9)) | Chart series 4 |
| `--chart-5` | Green (oklch(0.769 0.188 70.08)) | Red (oklch(0.645 0.246 16.439)) | Chart series 5 |

---

## Brand Accent: Indigo

The primary interactive color used throughout the app for buttons, links, and highlights.

- **Light Mode:** Indigo-600 (used as `bg-indigo-600`)
- **Dark Mode:** Indigo-400 (used as `dark:bg-indigo-400`)
- **Usage:** Primary CTAs, active states, focus indicators, selected items

---

## Usage Guidelines

### Semantic Color Usage

```tsx
// Backgrounds
<div className="bg-background">       {/* Main content bg */}
<div className="bg-card">             {/* Card/panel bg */}
<div className="bg-muted">            {/* Disabled/secondary bg */}

// Text
<p className="text-foreground">       {/* Primary text */}
<p className="text-muted-foreground">{/* Secondary/helper text */}

// Interactive
<button className="bg-primary text-primary-foreground">  {/* Primary button */}
<button className="bg-secondary text-secondary-foreground">{/* Secondary button */}
<button className="bg-destructive text-destructive-foreground">{/* Danger button */}

// Borders & Structure
<div className="border border-border">              {/* Bordered element */}
<input className="border border-input">             {/* Form input */}
<div className="ring ring-offset-2 ring-ring">     {/* Focus ring */}

// Sidebar
<aside className="bg-sidebar text-sidebar-foreground">
  <button className="bg-sidebar-primary text-sidebar-primary-foreground">
```

### Status Indicators

```tsx
// Success (Green)
<Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">

// Warning (Amber)
<Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">

// Error (Red)
<Badge className="bg-destructive text-destructive-foreground">

// Info (Blue)
<Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">

// Indigo (Primary)
<Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
```

---

## OKLch Color Space

PWORK uses OKLch (Oklahoma Lightness, Chroma, Hue) for superior color consistency:

- **Lightness (L):** 0–1 (0 = black, 1 = white)
- **Chroma (C):** Saturation intensity
- **Hue (H):** Color angle (0–360°)

**Why OKLch?**
- Perceptually uniform (perceived brightness is consistent)
- Better for accessible contrast ratios
- Maintains color appearance across light/dark modes
- Easier to generate color harmonies

---

## Accessibility

All color combinations meet WCAG AA standards (4.5:1 contrast minimum for text, 3:1 for UI components):

- **Foreground on Background:** 10:1+ contrast
- **Text on Buttons:** 4.5:1+ contrast
- **Decorative Elements:** 3:1+ contrast

Never rely on color alone to convey information—always use text labels, icons, or patterns as well.

---

## CSS Variable Reference

All colors are defined in `/app/globals.css` and can be referenced using Tailwind classes or CSS variables:

```css
/* CSS Variable */
color: var(--foreground);
background: var(--background);
border-color: var(--border);

/* Tailwind Class */
className="text-foreground bg-background border-border"

/* Dark Mode Automatic */
/* Classes automatically switch values based on .dark class */
```

---

## Design Tokens Hierarchy

1. **Semantic tokens** (background, foreground, border) — Use these first
2. **Component tokens** (primary, secondary, muted) — Use for interactive elements
3. **Status tokens** (destructive, warning, success) — Use for specific states
4. **Chart tokens** (chart-1 through chart-5) — Use for data visualization
5. **Sidebar tokens** — Use only in sidebar component

Avoid hardcoding colors like `#000000`, `rgb(0,0,0)`, or `black`—always use semantic tokens for consistency and maintainability.
