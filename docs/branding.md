# Frankie Cards logo and application icons

Selected A geometry, refinement v2, with the user's 2026-11-25 colour update: the original characters' blue and green, a white app-icon canvas, and a transparent in-app logo. The original app-derived Bouba and Kiki contours, ±15° card angles, card proportions and overlap are preserved. The app's question-energy mask remains unchanged.

## Source and palette

The canonical master is `src-tauri/icons/frankcards-app-icon.svg` (256 × 256 viewBox, square full-bleed white background). Only the selected design's fills have changed.

| Use | Colour |
| --- | --- |
| Icon background | `#FFFFFF` |
| Symbols | `#272723` |
| Front Bouba card | `#9AB1CC` |
| Rear Kiki card | `#9CA283` |

Blue comes from `MaleFigure.tsx`'s default clothing colour; green comes from `FemaleFigure.tsx`. `public/frankie-cards-logo.svg` omits the background and is used by the app header, loading states, settings and public-page headers. The PNG icons retain white, without transparency. The legacy `card-icon.svg` URL is a copy of the transparent double-card artwork. Email PNGs and local template sources are updated together; no hosted provider configuration is changed by these files.

The landing page and library loading state keep the original handwritten **Frankie** signature followed by **Cards** beneath the logo. The signature master is `docs/readme/assets/frankie.svg` (481 × 164 viewBox), restored unchanged from `cbfce05`. `public/frankie-signature.svg` and `public/frank-signature.svg` are copies of that signature. The icon generator must preserve this independent wordmark rather than overwrite it with double-card artwork.

## Regenerate assets

```sh
npm run icons:generate
npm run ios:sync-icons
```

The first command uses the installed Tauri CLI to generate web favicon sizes (16/32px), the 180px Apple touch icon, 512px web icon, 1024px master, desktop bundles, mobile sizes and editable Composer layers. It requires `npm ci`, without adding an image-library dependency.

The second command also syncs the local generated iOS project after `npm run tauri ios init`. It requires macOS, Xcode, XcodeGen, ffmpeg and ffprobe. It writes opaque RGB fallback PNGs and their tracked `Contents.json`, copies the Composer document, adds it to `project.yml`, regenerates the Xcode project, and corrects XcodeGen 2.46's legacy `.icon` file type to `folder.iconcomposer.icon`. App identifiers, signing settings and deployment targets are retained.

`src-tauri/gen/` is ignored; changes there alone are not the source of truth. Re-run sync after recreating the native project or running XcodeGen directly.

## Icon Composer

Open `src-tauri/icons/AppIcon.icon` in Icon Composer. It contains a solid background and separate front Bouba / rear Kiki groups. Composer stores groups in front-to-back order. Glass effects, shadows and translucency on the card groups are disabled to preserve the approved design; Apple supplies the enclosure and system appearance treatment. No rounded canvas mask is embedded in the source layers.

The local Apple `ictool` renderer verified Default, Dark and TintedDark. Xcode `actool` successfully compiled the Composer document together with the fallback catalog for iPhone/iPad, minimum iOS 15. The 18 fallback slots were checked against their sizes/scales and have no alpha channel. This is icon-asset validation, not a signed iOS build or App Store submission.

See Apple's [Icon Composer workflow](https://developer.apple.com/documentation/xcode/creating-your-app-icon-using-icon-composer).
