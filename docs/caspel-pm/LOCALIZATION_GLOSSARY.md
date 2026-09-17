# Localization glossary

## Brand-name grammar rules applied (all languages)

`Caspel PM` is never translated. Where the old name took inflection, the surrounding grammar was adjusted:

| Language | Rule | Example |
| --- | --- | --- |
| English | Plain substitution; possessive `Caspel PM’s` only in the Google disclosure | "Start using Caspel PM" |
| Russian | Name is indeclinable; used after the noun | "Учетная запись Caspel PM" |
| Turkish | Suffix after an apostrophe follows the pronunciation of "PM" (pi-em): `'i`, `'in` | "Caspel PM'i kullanmaya başla", "Caspel PM'in Google API'lerinden…" |
| Korean | "PM" (피엠) ends in a consonant: 을 / 이 / 은 / 과 | "Caspel PM을 처음 시작하는…", "Caspel PM이 Google API로부터…" |
| Portuguese (pt, pt-br) | Masculine product: `do` / `pelo Caspel PM` (was `da` / `pela Huly`) | "recebidas pelo Caspel PM" |
| Spanish | No article (`de Caspel PM`; was `de la Huly`) | "Guía de Caspel PM" |
| German | Hyphenated compounds use `Caspel-PM-` | "Caspel-PM-Konto", "Caspel-PM-Postfach" |
| French, Italian, Polish, Czech, Japanese, Chinese | Plain substitution; the name is invariant in these contexts | "Compte Caspel PM", "Caspel PMを使い始める" |

Native-speaker review is still recommended for tr, ko, pt and de (LOCALIZATION_STATUS.md).

## Azerbaijani (az): proposed project-management terms

**Status: proposal, not approved.** Needs review by a Caspel-designated Azerbaijani reviewer before any `az` resource is written.

| English (upstream term) | Azerbaijani (proposed) | Russian (upstream) | Notes |
| --- | --- | --- | --- |
| Workspace | İş sahəsi | Рабочее пространство | Canonical per master prompt |
| Create a workspace | İş sahəsi yaradın | Создать рабочее пространство | Canonical |
| Sign in to Caspel PM | Caspel PM-ə daxil olun | Войти в Caspel PM | Canonical |
| Welcome to Caspel PM | Caspel PM-ə xoş gəlmisiniz | Добро пожаловать в Caspel PM | Canonical |
| Project | Layihə | Проект | |
| Issue | Tapşırıq | Задача | Collides with "Task"; decide whether to distinguish (e.g. "Məsələ") |
| Task | Tapşırıq | Задача | See above |
| Sub-issue | Alt tapşırıq | Подзадача | |
| Milestone | Mərhələ | Веха | |
| Component | Komponent | Компонент | |
| Label | Etiket | Метка | |
| Status | Status | Статус | |
| Priority | Prioritet | Приоритет | |
| Assignee | İcraçı | Исполнитель | |
| Due date | Son tarix | Срок | |
| Document | Sənəd | Документ | |
| Teamspace | Komanda sahəsi | Командное пространство | |
| Inbox | Gələnlər qutusu | Входящие | |
| Channel | Kanal | Канал | |
| Direct message | Şəxsi mesaj | Личное сообщение | |
| Planner | Planlayıcı | Планировщик | |
| Settings | Parametrlər | Настройки | |
| Member | Üzv | Участник | |
| Guest | Qonaq | Гость | |
| Something went wrong. Try again or contact your administrator. | Xəta baş verdi. Yenidən cəhd edin və ya administratorla əlaqə saxlayın. | Произошла ошибка. Повторите попытку или обратитесь к администратору. | Canonical |

Azerbaijani suffix rule for the brand name: the suffix follows "PM" pronounced "pe-em", so it's `Caspel PM-ə` (dative) or `Caspel PM-in` (genitive), hyphenated.

## Invariants for all translators

- Keep `{placeholders}` byte-identical (e.g. `{ws}`, `{link}`, `{expHours}`, `{app}`, `{code}`).
- Keep HTML in email templates unchanged except for text nodes.
- Case-map with locale awareness: `i` becomes `İ` in az/tr (don't use naive `toUpperCase()`).
