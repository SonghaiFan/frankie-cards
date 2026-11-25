import { access, copyFile, cp, readdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const sourceIcon = resolve(projectRoot, "src-tauri/icons/frankcards-app-icon.png");
const iosSourceDirectory = resolve(projectRoot, "src-tauri/icons/ios");
const destinationDirectory = resolve(
  projectRoot,
  "src-tauri/gen/apple/Assets.xcassets/AppIcon.appiconset",
);

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status === 0) return result.stdout.trim();

  const detail = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
  throw new Error(`${command} failed${detail ? `:\n${detail}` : ""}`);
}

function renderOpaqueIcon(width, height, output) {
  run("ffmpeg", [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    sourceIcon,
    "-filter_complex",
    `[0:v]scale=${width}:${height}:flags=lanczos[icon];color=c=0xFFFFFF:s=${width}x${height}[background];[background][icon]overlay=0:0:format=auto,format=rgb24`,
    "-frames:v",
    "1",
    output,
  ]);
}

try {
  await access(destinationDirectory);
} catch {
  throw new Error("iOS project is missing. Run `npm run tauri ios init` before syncing icons.");
}

try {
  await access(sourceIcon);
} catch {
  throw new Error("The Frankie Cards PNG icon source is missing. Run `npm run icons:generate` first.");
}

const iconNames = (await readdir(iosSourceDirectory))
  .filter((name) => name.endsWith(".png"))
  .sort();

if (iconNames.length === 0) throw new Error("No iOS icon assets were found.");

for (const iconName of iconNames) {
  const sourceDestination = resolve(iosSourceDirectory, iconName);
  const destination = resolve(destinationDirectory, iconName);
  const dimensions = run("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "csv=s=x:p=0",
    sourceDestination,
  ]);
  const [width, height] = dimensions.split("x");

  for (const output of [sourceDestination, destination]) {
    renderOpaqueIcon(width, height, output);
  }
}

// Keep the fallback asset manifest reproducible after `tauri ios init`.
await copyFile(resolve(projectRoot, "src-tauri/icons/ios/Contents.json"), resolve(destinationDirectory, "Contents.json"));

// Generated Tauri projects are ignored. Re-add the tracked Composer document
// whenever the generated project is recreated, keeping app identifiers intact.
const appleProject = resolve(projectRoot, "src-tauri/gen/apple");
await cp(resolve(projectRoot, "src-tauri/icons/AppIcon.icon"), resolve(appleProject, "AppIcon.icon"), { recursive: true });
const specification = resolve(appleProject, "project.yml");
const current = await readFile(specification, "utf8");
if (!current.includes("- path: AppIcon.icon")) {
  if (!current.includes("- path: Assets.xcassets")) throw new Error("Cannot find the generated iOS assets entry in project.yml.");
  await writeFile(specification, current.replace("- path: Assets.xcassets", "- path: Assets.xcassets\n      - path: AppIcon.icon\n        type: file\n        buildPhase: resources"));
}
run("xcodegen", ["generate", "--spec", specification, "--project", appleProject]);
// XcodeGen 2.46 still maps .icon to the legacy Windows icon wrapper type.
// Xcode's native Composer type routes the package through the asset compiler.
const projectFile = resolve(appleProject, "conversation-cards.xcodeproj/project.pbxproj");
const project = await readFile(projectFile, "utf8");
await writeFile(projectFile, project.replace(/lastKnownFileType = wrapper\.icon; path = AppIcon\.icon;/g, "lastKnownFileType = folder.iconcomposer.icon; path = AppIcon.icon;"));
console.log(`Synced ${iconNames.length} opaque iOS fallbacks and the layered AppIcon.icon document.`);
