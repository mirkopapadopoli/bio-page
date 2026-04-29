# Bio Page — Summary

## Overview
Personal bio/link page for Mirko Papadopoli, styled with a Cyberpunk Blu-Viola theme. The page is fully config-driven: all content (profile, social links, sections, settings) is defined in `config.js` and rendered dynamically by `script.js`.

## Architecture
- **Static vanilla app** (HTML + CSS + JS) — no build tools, no framework
- **Config-driven rendering**: `config.js` → `script.js` → DOM
- **Deployed on Vercel** (static hosting)
- **PWA-enabled**: manifest.json + service worker for offline support

## Key Features

### Tab System
Sections can be grouped into tabs via `CONFIG.tabbedSections` array. Currently two tabs:
- **"Link in Evidenza"** — featured/main links
- **"🔥 Migliori Offerte Selezionate"** — affiliate links

Non-tabbed sections (e.g., "Supporta il mio lavoro") render normally below the tabs.

### Card Styles
- `default` — standard cyberpunk card
- `featured` — blue-violet gradient, highlighted border
- `support` — red-orange gradient
- `deal` — golden/amber gradient for affiliate links

### Search
Cross-tab search: when searching, ALL tab panels are shown to display results from every section. Results are highlighted inline.

### View Toggle
List/grid toggle on tab sections (button in section header).

### Link Scheduling
Links can have a `schedule` property with `days`, `hours`, or `date` to control visibility.

### PWA
- `manifest.json` with app metadata and icons
- `sw.js` with Cache-First for assets, Network-First for HTML
- Apple mobile web app meta tags
- Offline fallback support

## File Responsibilities
| File | Role |
|---|---|
| `config.js` | All content configuration |
| `script.js` | DOM generation, tabs, search, animations, interactions |
| `style.css` | Cyberpunk theme, tab bar, card styles, responsive design |
| `index.html` | HTML shell with PWA meta tags |
| `manifest.json` | PWA manifest |
| `sw.js` | Service Worker |

## Design System
- **Colors**: `#0a0a1f` (bg), `#00d4ff` (primary/cyan), `#a78bfa` (secondary/violet)
- **Font**: `Courier New` monospace
- **Effects**: scan lines, pulse glow, typing effect, 3D hover, parallax scroll
- **Responsive**: media queries at 640px and 400px breakpoints
