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
  ["02-kiki-card.svg", paths.slice(1, 2)],
  ["02-kiki-symbol.svg", paths.slice(2, 3)],
  ["03-bouba-card.svg", paths.slice(3, 4)],
  ["03-bouba-symbol.svg", paths.slice(4, 5)],
];
await writeFile(resolve(directory, "01-background.svg"), svg(paths.slice(0, 1)));
for (const [name, artwork] of layers) {
  await writeFile(resolve(directory, name), svg(artwork));
  await writeFile(resolve(document, "Assets", name), svg(artwork));
}
// Keep printed symbols crisp while the card surfaces receive native lighting.
await writeFile(resolve(document, "icon.json"), JSON.stringify({
  fill: { solid: "srgb:1.000000,1.000000,1.000000,1.000000" },
  // Composer stores the topmost group first, unlike SVG paint order.
  groups: ["02-kiki", "03-bouba"].map((stem, index) => ({
    name: index === 0 ? "Kiki / character green rear card" : "Bouba / character blue front card",
    layers: [
      { "image-name": `${stem}-symbol.svg`, name: `${stem}-symbol`, glass: false },
      {
        "image-name": `${stem}-card.svg`, name: `${stem}-card`, glass: true,
        fill: { "linear-gradient": index === 0
          ? ["srgb:0.705882,0.737255,0.600000,1.000000", "srgb:0.611765,0.635294,0.513725,1.000000"]
          : ["srgb:0.717647,0.803922,0.886275,1.000000", "srgb:0.603922,0.694118,0.800000,1.000000"] },
      },
    ],
    lighting: "combined",
    "blur-material": 0,
    shadow: { kind: "neutral", opacity: 0.35 },
    specular: true,
    translucency: { enabled: false, value: 0 },
  })).reverse(),
  "supported-platforms": { squares: "shared" },
}, null, 2) + "\n");
await writeFile(resolve(directory, "README.md"), `# Frankie Cards / character blue and green\n\nGenerated from \`../frankcards-app-icon.svg\`. Run \`npm run icons:composer\` after editing the master.\n\n- \`01-background.svg\`: opaque white icon canvas, #FFFFFF.\n- \`02-kiki-card.svg\` / \`02-kiki-symbol.svg\`: green rear card and original Kiki at its top right.\n- \`03-bouba-card.svg\` / \`03-bouba-symbol.svg\`: blue front card and original Bouba at its top right.\n\nCard colours come from the original FemaleFigure/MaleFigure clothing. The editable Icon Composer document is \`../AppIcon.icon\`. Card surfaces have native specular lighting, a neutral shadow (0.35), and a light-to-base gradient; symbols have glass disabled, and card translucency is disabled. The original paths are preserved and transformed only. Do not bake a rounded enclosure into the layers. The web logo is flat and transparent; the cropped \`public/frankie-cards-symbol.svg\` is used beside lowercase cards beneath the original signature.\n\nApple workflow: https://developer.apple.com/documentation/xcode/creating-your-app-icon-using-icon-composer\n`);
console.log(`Updated character-colour layers and ${document}.`);
