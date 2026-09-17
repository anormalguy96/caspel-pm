# PWA and desktop audit

## Browser / PWA (in scope, changed)

| Item | Before | After |
| --- | --- | --- |
| Static `<title>` before JS | `Huly` | `Caspel PM` (`dev/prod/src/index.ejs`) |
| Static favicon before JS | `/huly/favicon.ico` | `/caspel-pm/favicon.svg?v=2` (`type=image/svg+xml`, `id=default-favicon` kept for the Safari removal logic) |
| Runtime title when host not in branding map | `Platform` | `Caspel PM` |
| Branding links for `huly.local:8080` / `:8087` | `/huly/site.webmanifest`, `/huly/favicon.svg`, `/huly/favicon.ico`, `/huly/apple-touch-icon.png` | `/caspel-pm/site.webmanifest?v=2`, `favicon.svg?v=2`, `favicon.ico?v=2`, `apple-touch-icon.png?v=2` |
| Manifest `name` / `short_name` | `huly` / — | `Caspel PM` / `Caspel PM` |
| Manifest icons | `/icon-192.png` etc. at site root (those paths don't exist at root upstream) | `/caspel-pm/favicon.svg` (any) + PNG 192/512/1024 + maskable 512 |
| `theme_color` / `background_color` | — | `#0A2A3D` / `#FFFFFF` |
| `start_url`, `scope`, `display` | `/`, `/`, `standalone` | unchanged |
| Cache busting | — | `?v=3` query on icon and manifest links. Bump it when assets change. |

`dev/prod/webpack.config.js` serves `dev/prod/public` at `/`, so the new folder needs no build-copy change.

Update 2026-09-17: Authentic Caspel evergreen geometric mark derivative set (`favicon.ico` multi-size, `favicon.svg`, `apple-touch-icon.png`, `icon-192/512/1024.png`, `icon-maskable-512.png`, `mark-navy/white.png`, `logo-light/dark.png`) generated and linked with `?v=3`. B-004 resolved. All return 200 at runtime. Chromium accepts SVG manifest icons. iOS home-screen icons and install prompts have valid PNGs.

No service worker registration was found in `dev/prod/src`, so there's no SW cache to invalidate. Browsers still cache favicons aggressively; the `?v=` query handles that.

Runtime verified (2026-09-17): raw HTML title/favicon before hydration and runtime links (`?v=3`) on the production bundle. Not verified: installed-PWA name/icon on native mobile devices, mobile home screen, high-DPI rendering.

## Desktop / Electron: OUT OF FIRST-RELEASE SCOPE (B-008)

Current upstream identity that would reach users if desktop is distributed:

| Item | Location | Value |
| --- | --- | --- |
| productName | `desktop-package/package.json` | `Huly Desktop` / build `productName: Huly` |
| appId | `desktop-package/package.json` | `hc.hcengineering.Huly` |
| Update feed | `desktop-package/package.json` publish, `desktop/src/main/start.ts` | `https://dist.huly.io` |
| CLI name | `desktop/src/main/args.ts` | `Huly` |
| Tray title | `desktop/src/main/tray.ts` | `Huly` (test `desktop/src/__test__/main/trayUtils.test.ts` asserts it) |
| Window caption | `desktop/src/ui/index.ejs` | `Huly` |
| Title fallback | `desktop/src/ui/platform.ts` | `Huly Desktop` |
| Signup fallback | `desktop/src/ui/platform.ts` | `https://huly.io/signup` |
| Support link defaults | `desktop/src/ui/platform.ts` | Now empty via `@hcengineering/support` constants; the desktop UI shares the workbench components, so empty links are hidden |
| QMS desktop | `qms-desktop-package` | Separate upstream product; untouched |

If desktop becomes in scope:
1. Changing `appId` creates a new user-data profile (users log in again) and breaks auto-update from existing installs.
2. Point the update feed at Caspel-owned signed storage, or disable auto-update until it exists (hard stop).
3. Never reuse upstream signing identities.
4. Update the tray test together with `BASE_TITLE`.
