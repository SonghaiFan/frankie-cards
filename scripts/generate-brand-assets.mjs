import { copyFile, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const master = resolve(root, "src-tauri/icons/frankcards-app-icon.svg");
const tauri = resolve(root, "node_modules/@tauri-apps/cli/tauri.js");
const temporary = await mkdtemp(resolve(tmpdir(), "frankie-cards-icons-"));
function run(args) {
  const result = spawnSync(process.execPath, [tauri, ...args], { cwd: root, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || "Icon generation failed.");
}
try {
  run(["icon", master, "--output", temporary, ...[1024, 512, 180, 32, 16].flatMap(size => ["--png", String(size)])]);
  for (const [size, names] of [
    [1024, ["app-icon.png", "src-tauri/icons/frankcards-app-icon.png"]],
    [512, ["public/icon.png", "docs/readme/assets/icon.png"]],
    [180, ["public/apple-touch-icon.png"]],
    [32, ["public/favicon-32.png"]],
    [16, ["public/favicon-16.png"]],
  ]) {
    for (const name of names) await copyFile(resolve(temporary, `${size}x${size}.png`), resolve(root, name));
  }
  const artwork = await readFile(master, "utf8");
  // The app uses the same artwork without the white application-icon canvas.
  const logo = artwork.replace(/^[ \t]*<path\b[^>]*\/>[ \t]*\r?\n/m, "");
  for (const name of ["public/frankie-cards-logo.svg", "public/card-icon.svg"]) {
    await writeFile(resolve(root, name), logo);
  }
  // The original handwritten wordmark is independent of the double-card icon.
  const signature = await readFile(resolve(root, "docs/readme/assets/frankie.svg"));
  for (const name of ["public/frankie-signature.svg", "public/frank-signature.svg"]) {
    await writeFile(resolve(root, name), signature);
  }
  run(["icon", master, "--output", resolve(root, "src-tauri/icons"), "--ios-color", "#FFFFFF"]);
  for (const name of ["public/frankie-signature-email.png", "public/frank-signature-email.png"]) {
    await copyFile(resolve(root, "public/icon.png"), resolve(root, name));
  }
  console.log("Generated transparent logos and white-background icons from the character blue/green SVG.");
} finally {
  await rm(temporary, { recursive: true, force: true });
}
