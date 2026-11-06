# Cards introduction audit

## Design read

Reading this as an explanatory product introduction for people choosing a face-to-face conversation pack, preserving the actual app's paper-card material language. Design variance 5, motion intensity 2, density 4. Native CSS, no new UI framework or dependencies. The existing generic red-accent README mirror was replaced with paper surfaces, soft card edges, understated system/Inter typography and the actual Confidence Boost category orange.

## Actual app inspection: 2026-11-06

Opened https://frank-cards.vercel.app in guest mode in the shared Ego workspace. Browsed the library, opened Confidence Boost, read a real prompt, tried question keyboard navigation and Exit, and opened Settings. The captured settings show English/Chinese, appearance and Alternate card direction. No account was created, no personal topic opened, and no AI/provider request was made.

Settled captures are `site/assets/question-current.png`, `library-current.png`, and `settings-current.png`. The hero is a CSS crop of the real full screenshot. The existing recorded GIF is retained with wording distinguishing it as an earlier recording. The source app and its stored preferences were not changed.

## Code read and resulting explanation

- `src/App.css`: paper tokens `#f2f2ef`, `#fbfbf7`, `#fdfdfa`; ink `#171715`; dark paper tokens. Matched the site surface, corners and typography to these rather than the previous template's palette.
- `src/App.tsx`: `handleSwitchToCustom` gates Customize through authentication. Guest quick single-pack play is described separately from mixing and editing.
- `src/components/GameController.tsx`: quick questions shuffled within categories; custom category/percentage selection; multi-pack merging; Chaos Shuffle rearranges non-ending questions, with ending cards appended last.
- `src/components/GameSettings.tsx`, `TimePercentageSlider.tsx`: categories, proportion, Chaos Shuffle controls. The page does not mislabel question proportion as a fixed-duration timer.
- `src/components/GamePlay.tsx`, `QuestionCard.tsx`: Previous/Next and keyboard controls, touch swiping, flip only when extra content exists, alternate reader rotation. Intro does not promise reverse-side notes on every card.
- `src/hooks/useAppPreferences.ts`: mobile alternate-side preference persists locally.
- `src/components/account/TopicStudioPlay.tsx`: card-based editing, category color, energy, questions, reverse-side notes, closing card, and optional AI drafting.
- `src/ExternalSite.tsx`, `src/data/topics/catalog.ts`, `src/data/topics/SupabaseTopicRepository.ts`: guest versus account features, Supabase topics/Community, private draft and reviewed publication; privacy/support links retained rather than rewritten.
- `src/i18n/locales/en.json`, `CardEnergyIcon.tsx`: Bouba maps to Open, Kiki to Pierce. `public/card-energy-shapes.png` is reused unchanged.
- `public/games/en/confidence-boost.json`, `public/games/zh/confidence-boost-CN.json`: actual sample content and category orange. The renderer extracts non-ending questions at build time; `demo.js` cycles through them with their actual energy labels. This is an explicitly labelled independent preview, not an embedded full React game.

## Concept reference

Ćwiek et al., [The bouba/kiki effect is robust across cultures and writing systems](https://doi.org/10.1098/rstb.2020.0390), published online 2021. Primary experiment investigating sound-shape association across languages. The intro paraphrases the rounded/pointed association and explicitly separates the app's use of it as a conversation-energy metaphor from a tested relationship intervention. No efficacy claims are made.

## Checks

- `python3 site/build.py --out /tmp/cards-intro-preview`: successful standard-library build, English root plus `zh/`.
- Coordinating local asset/link checker: two HTML pages, zero issues. Every linked local image/source file exists.
- `node --check site/demo.js` and `git diff --check`: pass.
- Opened local EN desktop, EN mobile and Chinese mobile at 390×844; `scrollWidth === innerWidth === 390` in both languages. Desktop no overflow. Screenshots visually reviewed.
- Tested Next question with actual data and ten successive clicks returning to `1 / 10`.
- Tested dark media emulation: background `rgb(13,13,12)`, ink `rgb(243,242,236)`; dark screenshot captured. Per-page media and device overrides cleared afterward.
- No Lighthouse score claimed; validation covered build, semantics/assets, actual interaction, desktop/mobile and theme rendering.

Only `site/` and the Pages workflow's relevant source-watch paths changed. No app code, packages, secrets, account data, or unrelated work changed. No commit or push made by the project agent.


## Shared public-page styling

The introduction copies `public/frankcards-site.css` into the build as `brand.css`, sharing the Privacy, Support and Marketing pages’ palette, system type, background and public-page components. `site/style.css` adds the explanatory layout and real orange question-card preview. Update the shared file for brand-wide changes, then rebuild both languages. Existing policy text and routes are unchanged.
