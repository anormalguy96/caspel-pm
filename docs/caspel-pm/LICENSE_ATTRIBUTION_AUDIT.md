# License and attribution audit

| Item | Status |
| --- | --- |
| `LICENSE` (Eclipse Public License 2.0) | Unchanged |
| Source copyright headers (`Hardcore Engineering Inc.`, `Anticrm Platform Contributors`, `Huly Platform Contributors`) | Unchanged in every edited file |
| New files authored by this fork | Headed `Copyright © 2026 Caspel PM contributors` with EPL-2.0 notice (`_caspel-pm.scss`, `check-residual-brand.js`). Placeholder SVGs and docs carry no header |
| Service root pages | Product identity "Caspel PM <service> service", plus "Based on the open-source Huly® Platform (EPL-2.0), © <year> Huly Labs". Upstream attribution preserved and not converted to a Caspel claim. The ® mark is kept as used upstream |
| README | Upstream README kept; fork notice added stating Caspel PM is a fork of the open-source Huly Platform under EPL-2.0 |
| Email footers "© Caspel PM — All rights reserved" | Refers to the email/product identity, not the source code. **Legal review required** (B-012) |
| "Caspel PM’s use and transfer of information received from Google APIs…" | Legal disclosure now names Caspel PM. Only valid if Caspel operates its own Google OAuth app. **Legal review required** (B-012) |
| Fonts | IBM Plex Sans (IBM, SIL OFL 1.1) and Noto Color Emoji (Google, OFL 1.1) bundled upstream. **No OFL licence text next to the font files in `packages/theme/fonts`.** Add `OFL.txt` before distributing builds (recommended; not done, as the prompt asks not to alter upstream licensing without review) |
| Gilroy | Not bundled |
| Caspel logo | Not used (no approved files); placeholder mark only |
| Third-party notices for npm dependencies | Not generated. Recommend a licence report from the production bundle (e.g. `license-checker`) as part of release |

EPL-2.0 obligations to confirm with legal before distribution: availability of Source Code for modified files (this fork's repository), retention of notices, and no removal of copyright statements. None were removed.
