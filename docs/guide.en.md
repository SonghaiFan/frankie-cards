# Frankie Cards / Project guide

[← README](../README.md)

Complete setup, behavior and technical notes. Unless stated otherwise, run commands from the repository root.

Frankie Cards turns hard-to-ask questions into a paced, shared card experience. Pick a pack that fits the moment, place the screen between you, and begin with the first card. There are no correct answers, scores, or relationship diagnoses. The conversation that follows is the point.

[Use online](https://frank-cards.vercel.app/) · [中文](../README.md)

## Features

- **One pack is a complete conversation:** each pack has an opening, categories, card backs, and an ending, so the exchange can move naturally from light to meaningful.
- **Questions carry different energies:** rounded **Bouba** cards help people open up, while pointed **Kiki** cards cut through politeness and performance.
- **You are not limited to a fixed deck:** 22 built-in packs in English and Chinese cover partners, friends, family, self-reflection, and different situations. Filter and combine them into a set for this particular evening.
- **Create on the real cards:** edit the cover, questions, card backs, categories, and colors directly. What you see is what people will use, without a separate configuration form.

## Getting started

Requires Node.js 20+ and npm.

```sh
npm ci
npm run dev
```

See the local URL printed by Vite.

## Project notes

### Create your own conversation pack

Built-in packs work without an account. After signing in, create a private pack, return to edit it, or use it immediately. When you want to share it, submit it for review. Approved work appears only in **Community** inside Custom Mode and never mixes with official Frankie Cards content. Published packs remain editable, with updates returning to review.



### How to use Frankie Cards

Frankie Cards is currently available on the web; the iOS version will be released through the App Store. GitHub is used for source code and development collaboration, not desktop installer downloads.

<details>
<summary><strong>Run locally or contribute</strong></summary>

With Node.js 20+ and npm installed:

```bash
git clone https://github.com/SonghaiFan/frankie-cards.git
cd frankie-cards
npm ci
npm run dev
```

The desktop app uses Tauri 2. After installing Rust and the Tauri prerequisites:

```bash
npm run tauri dev
```

Accounts and user-created topics use Supabase; setup is documented in the [Supabase guide](../supabase/README.md). Frankie Cards uses React, TypeScript, Vite, Supabase, and Tauri, and is released under the [MIT License](../LICENSE). Read the [contribution guide](../CONTRIBUTING_GUIDE.md) before getting started.

</details>

<div align="center">

**Made for conversations that matter.**

</div>

## Development

```sh
npm run build
```

See the [development guide](../DEV-README.md), [contribution guide](../CONTRIBUTING_GUIDE.md), and [banner update instructions](readme/README.md).
