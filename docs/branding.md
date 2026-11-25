# Frankie Cards logo and application icons

Selected A geometry, refinement v2, with the user's 2026-11-25 colour update: the original characters' blue and green, a white app-icon canvas, and a transparent in-app logo. The original app-derived Bouba and Kiki contours, ±15° card angles, card proportions and overlap are preserved. The app's question-energy mask remains unchanged.

## Source and palette

The canonical master is `src-tauri/icons/frankcards-app-icon.svg` (256 × 256 viewBox, square full-bleed white background). Every original path is preserved. Per the user's visual references, each symbol is scaled to 28/64 of its previous size and moved to the upper-right corner of its card (local centre 25, -50 on a 98 × 148 card).

| Use | Colour |
| --- | --- |
| Icon background | `#FFFFFF` |
| Symbols | `#272723` |
| Front Bouba card | `#9AB1CC` |
| Rear Kiki card | `#9CA283` |

Blue comes from `MaleFigure.tsx`'s default clothing colour; green comes from `FemaleFigure.tsx`. `public/frankie-cards-logo.svg` is the transparent square version used by settings, account loading states and public-page headers. `public/frankie-cards-symbol.svg` crops the same paths to a 202 × 166 viewBox for the landing-page lockup. The PNG icons retain white, without transparency. The legacy `card-icon.svg` URL is a copy of the transparent double-card artwork. Email PNGs and local template sources are updated together; no hosted provider configuration is changed by these files.

The landing page and library loading state share `FrankieBrand.tsx`: the original handwritten **Frankie** signature above lowercase **cards**, with the cropped double-card symbol at the right of that lower row. This follows the supplied image as a layout reference, without substituting its raster shapes. The signature master is `docs/readme/assets/frankie.svg` (481 × 164 viewBox), restored unchanged from `cbfce05`. `public/frankie-signature.svg` and `public/frank-signature.svg` are copies of that signature. The icon generator must preserve this independent wordmark rather than overwrite it with double-card artwork.

## Typography

The logo's lowercase `cards` and the app's default Latin text use [Allo](https://allo.joshpuckett.me/), version 1.1.0 by Josh Puckett. The official Friendly variable WOFF2 fixes roundness at the font's default 50 and retains variable weight (100–900) and optical size. The logo uses weight 900, automatic optical sizing and -0.02em tracking. Existing UI weights are preserved. The Frankie signature remains the original vector artwork, reduced to 3.65em × 1.245em (about 85% of the word `cards`' width).

Files are self-hosted under `public/fonts/allo/`: Friendly variable, regular/bold obliques, CSS, the original SIL OFL 1.1 license, and a source/version/SHA256 record. The normal font is preloaded once; no external font service is required. Chinese characters fall back to system CJK fonts. Monospace/code fonts are unchanged. Public information pages and the bilingual introduction load the same family using relative asset paths.

## Regenerate assets

```sh
npm run icons:generate
npm run ios:sync-icons
```

The first command uses the installed Tauri CLI to generate web favicon sizes (16/32px), the 180px Apple touch icon, 512px web icon, 1024px master, desktop bundles, mobile sizes and editable Composer layers. It requires `npm ci`, without adding an image-library dependency.

The second command also syncs the local generated iOS project after `npm run tauri ios init`. It requires macOS, Xcode, XcodeGen, ffmpeg and ffprobe. It writes opaque RGB fallback PNGs and their tracked `Contents.json`, copies the Composer document, adds it to `project.yml`, regenerates the Xcode project, and corrects XcodeGen 2.46's legacy `.icon` file type to `folder.iconcomposer.icon`. App identifiers, signing settings and deployment targets are retained.

`src-tauri/gen/` is ignored; changes there alone are not the source of truth. Re-run sync after recreating the native project or running XcodeGen directly.

## Icon Composer

Open `src-tauri/icons/AppIcon.icon` in Icon Composer. It contains a solid background and separate front Bouba / rear Kiki groups. Composer stores groups and layers in front-to-back order. Each group has an independent printed-symbol layer with glass disabled, plus a card surface with native specular highlights, a neutral shadow (0.35) and a light-to-base colour gradient. Translucency remains disabled. This gives the native icon restrained depth while the in-app SVG remains flat. Apple supplies the enclosure; no rounded canvas mask is embedded in the source layers. Older raster fallback icons remain flat.

The local Apple `ictool` renderer verified system appearances. Xcode `actool` successfully compiled the Composer document together with the fallback catalog for iPhone/iPad, minimum iOS 15. Both symbols fit within their own cards and Kiki is unobscured by the front card. The 18 fallback slots were checked against their sizes/scales and have no alpha channel. Tiny favicons preserve the double-card silhouette and colours; their corner symbols are not reliably distinguishable. This is icon-asset validation, not a signed iOS build or App Store submission.

See Apple's [Icon Composer workflow](https://developer.apple.com/documentation/xcode/creating-your-app-icon-using-icon-composer).
