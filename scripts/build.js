import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "dist");

const appJs = readFileSync(join(root, "app.js"), "utf8");
const versionMatch = appJs.match(/APP_VERSION\s*=\s*"([^"]+)"/);
const version = versionMatch ? versionMatch[1] : "dev";

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const files = [
  "index.html",
  "styles.css",
  "app.js",
  "logic.js",
  "manifest.json",
  "sw.js",
  "favicon.svg",
  "favicon.ico",
  "apple-touch-icon.png",
];

for (const file of files) {
  copyFileSync(join(root, file), join(dist, file));
}

// Cache-bust assets in dist/index.html
const indexPath = join(dist, "index.html");
let indexHtml = readFileSync(indexPath, "utf8");
indexHtml = indexHtml
  .replace(/styles\.css/g, `styles.css?v=${version}`)
  .replace(/logic\.js/g, `logic.js?v=${version}`)
  .replace(/app\.js/g, `app.js?v=${version}`)
  .replace(/manifest\.json/g, `manifest.json?v=${version}`)
  .replace(/sw\.js/g, `sw.js?v=${version}`)
  .replace(/favicon\.svg/g, `favicon.svg?v=${version}`)
  .replace(/favicon\.ico/g, `favicon.ico?v=${version}`)
  .replace(/apple-touch-icon\.png/g, `apple-touch-icon.png?v=${version}`);
writeFileSync(indexPath, indexHtml);

// Inject version into service worker cache name
const swPath = join(dist, "sw.js");
let sw = readFileSync(swPath, "utf8");
sw = sw.replace(/CACHE_NAME = "math-sprint-__APP_VERSION__"/, `CACHE_NAME = "math-sprint-${version}"`);
writeFileSync(swPath, sw);

console.log(`Build complete: dist (version ${version})`);
