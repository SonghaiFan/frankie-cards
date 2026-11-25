import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const directory = resolve(root, "src-tauri/icons/icon-composer");
const document = resolve(root, "src-tauri/icons/AppIcon.icon");
const master = await readFile(resolve(root, "src-tauri/icons/frankcards-app-icon.svg"), "utf8");
const paths = master.match(/<path\b[^>]*\/>/g);
if (paths?.length !== 5 || !master.includes('viewBox="0 0 256 256"')) {
  throw new Error("Expected the double-card master: background, Kiki card/mark, Bouba card/mark.");
}

function svg(artwork) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 256 256">\n${artwork.join("\n")}\n</svg>\n`;
}

await mkdir(directory, { recursive: true });
await mkdir(resolve(document, "Assets"), { recursive: true });
for (const legacy of ["02-conversation-card.svg", "03-female.svg", "04-hands-and-coffee.svg"]) {
  await rm(resolve(directory, legacy), { force: true });
}
const layers = [
  ["02-kiki-card.svg", paths.slice(1, 3)],
  ["03-bouba-card.svg", paths.slice(3, 5)],
];
await writeFile(resolve(directory, "01-background.svg"), svg(paths.slice(0, 1)));
for (const [name, artwork] of layers) {
  await writeFile(resolve(directory, name), svg(artwork));
  await writeFile(resolve(document, "Assets", name), svg(artwork));
}
// Preserve the approved flat artwork; the platform supplies its own enclosure.
await writeFile(resolve(document, "icon.json"), JSON.stringify({
  fill: { solid: "srgb:1.000000,1.000000,1.000000,1.000000" },
  // Composer stores the topmost group first, unlike SVG paint order.
  groups: layers.map(([name], index) => ({
    name: index === 0 ? "Kiki / character green rear card" : "Bouba / character blue front card",
    layers: [{ "image-name": name, name: name.replace(/\.svg$/, ""), glass: false }],
    shadow: { kind: "none", opacity: 0 },
    specular: false,
    translucency: { enabled: false, value: 0 },
  })).reverse(),
  "supported-platforms": { squares: "shared" },
}, null, 2) + "\n");
await writeFile(resolve(directory, "README.md"), `# Frankie Cards / character blue and green\n\nGenerated from \`../frankcards-app-icon.svg\`. Run \`npm run icons:composer\` after editing the master.\n\n- \`01-background.svg\`: opaque white icon canvas, #FFFFFF.\n- \`02-kiki-card.svg\`: original Kiki on the rear green card, #9CA283.\n- \`03-bouba-card.svg\`: original Bouba on the front blue card, #9AB1CC.\n\nCard colours come from the original FemaleFigure/MaleFigure clothing. The editable Icon Composer document is \`../AppIcon.icon\`. It uses an opaque solid background and two separate card groups. Glass effects are off to preserve the design. Do not redraw the original Bouba/Kiki paths or bake a rounded icon mask into any layer. The system supplies the icon enclosure. The web logo omits the white canvas.\n\nApple workflow: https://developer.apple.com/documentation/xcode/creating-your-app-icon-using-icon-composer\n`);
console.log(`Updated character-colour layers and ${document}.`);
