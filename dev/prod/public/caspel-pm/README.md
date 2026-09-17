# Caspel PM web identity assets

Everything the browser loads for Caspel PM identity lives in this folder. It is served at `/caspel-pm/`.

**All current files are derived directly from authentic Caspel corporate logo masters in `logos/` (`1705927011_caspel.png` and `footer_logo_16843049791615629263.png`).** No synthetic marks, AI artwork, or anniversary artwork are used.

| File | Size / format | Used by | Status |
| --- | --- | --- | --- |
| `favicon.svg` | SVG, square | `dev/prod/src/index.ejs` (first paint), `branding.json` icon link, manifest | Authentic Caspel mark |
| `favicon.ico` | ICO (16, 32, 48 PNG) | `branding.json` `shortcut icon` (legacy browsers) | Authentic Caspel derivative |
| `apple-touch-icon.png` | 180×180 PNG, opaque navy #0A2A3D | `branding.json` `apple-touch-icon` | Authentic Caspel derivative |
| `icon-192.png` | 192×192 PNG | manifest | Authentic Caspel derivative |
| `icon-512.png` | 512×512 PNG | manifest | Authentic Caspel derivative |
| `icon-1024.png` | 1024×1024 PNG | manifest | Authentic Caspel derivative |
| `icon-maskable-512.png` | 512×512 PNG, mark inside 80% safe zone | manifest (`purpose: maskable`) | Authentic Caspel derivative |
| `logo-light.png` | stacked logo for light backgrounds | About, email header, docs | Authentic Caspel master |
| `logo-dark.png` | stacked logo for dark backgrounds | login panel, dark theme | Authentic Caspel master |
| `site.webmanifest` | JSON | `branding.json` manifest link | Final structure (v=3) |

Source-embedded marks that must be replaced at the same time:

| Location | Purpose |
| --- | --- |
| `plugins/login-resources/src/components/icons/LoginIcon.svelte` | Login page mark |
| `plugins/onboard-resources/src/components/icons/OnboardIcon.svelte` | Onboarding page mark |
| `plugins/contact-assets/assets/icons.svg` symbol `#huly` | Built-in account identity icon (monochrome; keep the symbol id) |

Desktop icons (ICO/ICNS/Linux PNG, tray light/dark, installer) belong in `desktop-package/` and are out of first-release scope.

## Replacing with approved assets

1. Keep the file names above, or update every reference listed.
2. Brand rules: keep proportions, clear space ≥ 20% of logo height, no recolouring, dark/light variants matched to background, icon ≥ 50 px unless the brand owner approves a small-size favicon.
3. Regenerate PNG/ICO from the approved SVG master:
   ```sh
   node scripts/caspel-pm/render-icons.js path/to/approved-mark.svg
   ```
4. Bump the cache-busting query `?v=N` in `dev/prod/src/index.ejs`, `dev/prod/public/branding.json` and `site.webmanifest`. Also bump it in the production branding file.
5. Replace the three source-embedded marks.
6. Record provenance in `docs/caspel-pm/BRAND_ASSET_INVENTORY.md`.
7. Run `node scripts/caspel-pm/check-residual-brand.js`, then check the tab icon, PWA install and login page.
