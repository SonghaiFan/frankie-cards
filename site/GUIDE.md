# Cards introduction maintenance / 介绍页维护

The introduction is a standalone static build at https://songhaifan.github.io/frankie-cards/. The app remains at https://frank-cards.vercel.app. English is the root; Chinese is `zh/`. This build does not load environment files, authenticate users, or call a model.

介绍页独立构建。英文为默认入口，中文位于 `zh/`；构建不读取密钥，不登录账号，也不调用模型。

## Content and live-data preview / 内容与真实数据预览

- `site/content.json`: maintain English and Chinese explanations together. The page does not infer its content by parsing README sections. / 双语说明独立维护，不再从 README 的位置推断内容。
- `site/build.py`: renders the shared overview → feature/concept → usage → gallery → setup structure and copies approved assets. `project.json` supplies repository, Pages URL and app URL; legacy `media`/`steps` keys are not used by this renderer. / 构建器使用项目配置中的仓库与链接；旧媒体列表与步骤字段不再控制页面。
- The small question explorer reads `public/games/en/confidence-boost.json` and `public/games/zh/confidence-boost-CN.json` at every build. It uses all non-ending questions and their actual `energy` values. Changes to those packs require only rebuilding. Changing the sample pack requires updating the two paths in `build.py` and the bilingual preview title. / 示例直接读取真实内置卡包，卡包问题更新后重新构建即可。
- `site/demo.js` is a lightweight question navigator, not the full React session. It stores no answers or preferences. Keep this distinction in the copy. / 示例不是完整游戏，不保存回答或偏好。

## Screenshot replacement map / 截图替换表

| Source file | Replace when | Actual app source |
| --- | --- | --- |
| `site/assets/question-current.png` | Question card, category palette, navigation or energy mark changes | `GamePlay.tsx`, `QuestionCard.tsx`, `Card.tsx`, `utils/gameTheme.ts` |
| `site/assets/library-current.png` | Guest library, pack cover or guest/account entry changes | `GameLibrary.tsx`, `App.tsx` |
| `site/assets/settings-current.png` | Language/theme/alternate-reader settings change | `SettingsMenu.tsx`, `hooks/useAppPreferences.ts` |
| `site/assets/demo.gif` | Actual card navigation changes | Record real settled guest interactions; the retained GIF is an earlier walkthrough and is labelled as such |
| `public/card-energy-shapes.png` | Bouba/Kiki source marks change | `CardEnergyIcon.tsx`, `App.css` shape masks |
| `docs/readme/banner.png` | Approved README banner is refreshed | Copied to `media/banner.png` for Open Graph |
| `docs/readme/assets/frankie.svg` | Approved signature changes | Copied into header |

New captures were made on 2026-11-06 from guest mode. Use harmless built-in questions, never personal topics, email addresses, keys, or avatars. Wait for transitions to finish before recording. The hero uses a CSS crop of `question-current.png`; retain the full real capture. If the card moves, adjust `.hero-screen img` rather than redrawing the UI. Add new screenshots to the explicit copy/gallery list in `build.py`, with bilingual captions in `content.json`.

新截图必须来自稳定后的真实界面，使用内置卡包，不包含私人话题或账号信息。主图只做 CSS 裁切；卡片位置变化时调整裁切，不能重绘截图。

## Behavior and visual changes / 行为与风格变化

Recheck account gating in `App.tsx`, custom question ordering in `GameController.tsx`, and editor capabilities in `components/account/TopicStudioPlay.tsx`. Guest mode is quick single-pack play; mixing/editing/Community interaction needs an account. Ending cards remain last even with Chaos Shuffle. Extra notes can flip; not every card has a reverse side. Reading-side rotation is a mobile preference.

行为变动时核对账号权限、排序与编辑器源码；不要把登录后的功能写成访客可用，也不要暗示每张卡都能翻面。

`site/style.css` inherits paper tokens from `src/App.css` and the sample pack’s category orange. Match changes to the real app’s surfaces, shapes, typography and dark theme. The Bouba/Kiki paragraph links to the primary cross-language sound-symbolism paper; its application to question energy is an explicit design metaphor, not a relationship-outcome claim.

## Build and verify / 构建与检查

```sh
python3 site/build.py
python3 -m http.server 8080 --directory _site --bind 127.0.0.1
node --check site/demo.js
```

Open `/` and `/zh/` at desktop and 390px width. Try Next question through every built-in prompt and verify it cycles; inspect all images after scrolling. Check light/dark modes, keyboard focus, no horizontal overflow, and all CTA links. English and Chinese source packs may use different wording; do not invent translations of app data in the renderer.

检查双语、桌面与手机、亮暗模式，以及问题切换、键盘焦点、图片与链接。

## Publish / 发布

Commit only reviewed `site/` changes and push `main`; `.github/workflows/pages.yml` publishes `_site`. The question-source JSON paths are also watched so a pack update refreshes its introduction preview. App deployment is independent. Do not include `.env` files or unrelated changes. Existing privacy/support pages on the app are linked, not rewritten.

只提交审核后的介绍页改动；应用部署保持独立，不包含密钥和其他未完成代码。隐私与帮助页只保留链接，不在本次重写。


## Shared public-page styling

The introduction copies `public/frankcards-site.css` into the build as `brand.css`, sharing the Privacy, Support and Marketing pages’ palette, system type, background and public-page components. `site/style.css` adds the explanatory layout and real orange question-card preview. Update the shared file for brand-wide changes, then rebuild both languages. Existing policy text and routes are unchanged.

## Frankie brand source / Frankie 品牌来源

The approved wordmark is `docs/readme/assets/frankie.svg`, copied to `public/frankie-signature.svg`. The legacy `public/frank-signature.svg` path also carries the approved artwork for compatibility. App headers use `.frankie-signature` in `src/App.css`, `GameIntroPanel.tsx` and `GameLibrary.tsx`; public pages use the same SVG in both `src/ExternalSite.tsx` and `public/{marketing,privacy,support}/index.html`. Preserve auth storage keys, application identifiers, domains and support addresses when changing visible branding.

品牌字标来自已确认的 Frankie SVG。更新视觉品牌时，不要改动账号存储键、应用标识、服务域名或支持邮箱。

The existing icon illustration source is `src-tauri/icons/frankcards-app-icon.svg`. Its signature is the approved Frankie path. Render it at 1024×1024 with CairoSVG to `src-tauri/icons/frankcards-app-icon.png` and `app-icon.png`, then resize a 512×512 version to `public/icon.png` and `docs/readme/assets/icon.png`. Run `npm run icons:generate`, then `node scripts/sync-ios-icons.mjs` if the generated iOS project exists. The latter updates local ignored generated assets as well as tracked source icon sizes. Browser icon references in `index.html` use a version query to invalidate the former Frank artwork. Native product/window names already say Frankie Cards; identifiers intentionally retain their existing values.

品牌图标保留已有插画，替换签名字形后按现有命令生成各尺寸；浏览器图标版本参数用于刷新旧缓存。

After a visible header or icon change, recapture `site/assets/library-current.png`, `site/assets/settings-current.png` and `docs/readme/assets/ui.png` from the local guest app. Update crop/source dimensions and provenance in `docs/readme/banner.json` and `source-version.json`, then rebuild that one banner with `python3 docs/readme/build.py docs/readme/banner.json --png` (CairoSVG and Cairo required). The 2026-11-06 refresh replaces embedded old Frank branding without changing the approved banner layout.

Email source templates under `supabase/templates/` use `public/frankie-signature-email.png`, rendered from the approved Frankie SVG. The legacy email-image path is a compatibility copy. Deploy the app asset first, then manually sync provider templates if their hosted copies are stale. Updating these source files does not change Supabase settings or send any email. / 邮件模板源码更新不等于部署服务商模板；先发布图片，再按需同步托管模板。
