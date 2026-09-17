# Brand asset inventory

## Caspel PM assets in the repository

| Path | Kind | Provenance | Status |
| --- | --- | --- | --- |
| `dev/prod/public/caspel-pm/favicon.svg` | SVG favicon / PWA icon | Derived from `logos/1705927011_caspel.png` (authentic Caspel geometric mark) | **Integrated (Approved Master)** |
| `dev/prod/public/caspel-pm/site.webmanifest` | PWA manifest | This fork (`?v=3`) | **Final** |
| `dev/prod/public/caspel-pm/favicon.ico` | Multi-size ICO (16, 32, 48) | Rendered from authentic `logos/1705927011_caspel.png` mark | **Integrated (Approved Master)** |
| `dev/prod/public/caspel-pm/apple-touch-icon.png` | 180x180 PNG | Rendered with 80% safe zone on `#0A2A3D` navy background | **Integrated (Approved Master)** |
| `dev/prod/public/caspel-pm/icon-192.png`, `512.png`, `1024.png` | Standard PWA PNGs | Transparent authentic Caspel mark from `logos/1705927011_caspel.png` | **Integrated (Approved Master)** |
| `dev/prod/public/caspel-pm/icon-maskable-512.png` | Maskable PWA 512x512 | Authentic white Caspel mark on `#0A2A3D` navy background | **Integrated (Approved Master)** |
| `dev/prod/public/caspel-pm/mark-navy.png`, `mark-white.png` | Isolated raster marks | Extracted from `1705927011_caspel.png` and `footer_logo_*.png` | **Integrated (Approved Master)** |
| `dev/prod/public/caspel-pm/logo-light.png`, `logo-dark.png` | Stacked logos | Optimized web PNGs from authentic `logos/` masters | **Integrated (Approved Master)** |
| `plugins/onboard-resources/src/components/icons/OnboardIcon.svelte` | Onboarding mark | Authentic Caspel geometric mark embedded SVG | **Integrated (Approved Master)** |
| `plugins/login-resources/src/components/icons/LoginIcon.svelte` | Inline login mark | Authentic Caspel geometric mark embedded SVG | **Integrated (Approved Master)** |
| `packages/theme/styles/_caspel-pm.scss` | Colour tokens | Corporate palette (`#0A2A3D`, `#4CAF50`, `#236B8E`) | **Final** |

### Logo Source of Truth
The authentic assets inside `logos/` serve as the single source of truth:
1. `logos/1705927011_caspel.png` (2207x1990): Evergreen stacked logo with navy mark and wordmark for light backgrounds.
2. `logos/footer_logo_16843049791615629263.png` (1891x1491): Evergreen stacked logo with white mark and wordmark for dark backgrounds.
3. Excluded from permanent identity: `caspel_logo_no_bg.png` and `caspel_logo_no_bg-recolored.png` (these contain 20-year anniversary artwork and are strictly reserved for anniversary campaigns).

Processing performed:
- Exact bounding box extraction of mark components via `scripts/caspel-pm/measure-and-render.js`.
- Zero manual redrawing, zero synthetic interpretation, zero AI distortion.
- Derivatives generated using headless Puppeteer rendering at high DPI with transparent backgrounds.

## Upstream identity assets (retained, not referenced by Caspel PM)

| Path | Content | Referenced by |
| --- | --- | --- |
| `dev/prod/public/huly/*` | Upstream Huly icons | None for Caspel PM hosts |
| `plugins/login-resources/img/login_back*.{png,webp,avif}` | Blue abstract artwork | None (imports removed) |
| `plugins/login-resources/img/logo-dark.svg`, `logo-light.svg` | Upstream artwork | None in Caspel login flow |
| `plugins/contact-assets` `#huly` sprite icon | Social identity icon | `contact.icon.Huly` (E-002). Neutral monochrome placeholder; id kept for compatibility (E-029) |
| `desktop-package` icons, installers | Upstream desktop | Desktop out of scope |
