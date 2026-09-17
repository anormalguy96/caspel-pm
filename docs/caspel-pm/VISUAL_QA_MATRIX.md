# Visual QA matrix

Legend: ⬜ not run · ✅ pass · ❌ fail.

**2026-09-16 local run: results are recorded in [RUNTIME_QA_REPORT.md](RUNTIME_QA_REPORT.md) (Visual QA).** Covered: first paint, login, invalid login, recovery, signup, create workspace, workbench, tracker, issue detail, documents/editor, inbox, help popup, settings (calendar, backup), dark theme. The matrix below remains the template for owner design review (B-017); 200% zoom, mobile and empty/permission states are still ⬜.

## Six representative surfaces × states

| State \ Surface | Sign-in | Project list | Issue detail | Board / list | Document editor | Settings |
| --- | --- | --- | --- | --- | --- | --- |
| Normal (light) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Normal (dark) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Empty | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Loading | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Error / permission denied | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Offline / reconnecting | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Hover / focus / active on primary + secondary buttons | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Selected / checked (checkbox, radio, toggles) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Disabled / validation error | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Long content | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Russian | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Azerbaijani (after az exists) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 200% zoom | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

## Change-specific checks

| Check | Expected | Result |
| --- | --- | --- |
| Hard reload, network throttled: tab title/icon before JS | "Caspel PM" + placeholder icon; never Huly | ⬜ |
| After hydration on `huly.local:8087` | Title "Caspel PM", manifest `/caspel-pm/site.webmanifest?v=1` | ⬜ |
| Unknown host (e.g. `localhost:8087`) | Title "Caspel PM" | ⬜ |
| Login page ≥ 769 px | Navy gradient backdrop; navy panel; placeholder mark + "Caspel PM" | ⬜ |
| Login page ≤ 768 px | Navy full-screen panel, readable form | ⬜ |
| Login in light OS theme (`class:white`) | Panel/form readable | ⬜ |
| Help & Support popup, no support config | Settings + Shortcuts cards only; empty footer without layout gap | ⬜ |
| Help & Support popup, all four links configured | Docs card + three footer buttons; links open in new tab | ⬜ |
| Sidebar bottom, no support config | No "Contact us" item | ⬜ |
| Read-only guest toast / account menu, no `SIGNUP_URL` | No "Sign up" button/action | ⬜ |
| Primary buttons across tracker/documents/settings | Teal-navy, legible, distinct from positive (green) buttons | ⬜ |
| Secondary buttons | Pale blue-grey, legible | ⬜ |
| Checked checkbox/radio (`--selector-active-BackgroundColor`) | Teal-navy, visible in dark theme | ⬜ |
| Profile → social IDs | Label "Caspel PM"; icon still upstream glyph (known, B-004) | ⬜ |
| Invite / OTP / recovery emails | Navy header "Caspel PM", no "Huly" text | ⬜ |
| Service root pages (`GET /` on preview, link-preview, datalake, backup) | Caspel PM text + attribution | ⬜ |
