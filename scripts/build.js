import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(scriptsDir, "..");
const distDir = join(rootDir, "dist");
const sharedIcons = ["favicon.svg", "favicon.ico", "apple-touch-icon.png"];

function readVersion(appDir) {
  const appPath = join(appDir, "app.js");
  if (!existsSync(appPath)) return "dev";
  return readFileSync(appPath, "utf8").match(/APP_VERSION\s*=\s*["']([^"']+)["']/)?.[1] ?? "dev";
}

function copyFiles(sourceDir, outputDir, files) {
  for (const file of files) {
    const source = join(sourceDir, file);
    if (!existsSync(source)) {
      console.warn(`Skipping missing file: ${source}`);
      continue;
    }
    copyFileSync(source, join(outputDir, file));
  }
}

function cacheBustHtml(html, version) {
  const query = `?v=${version}`;
  return html
    .replace(/styles\.css(?:\?v=[^"']+)?/g, `styles.css${query}`)
    .replace(/logic\.js(?:\?v=[^"']+)?/g, `logic.js${query}`)
    .replace(/app\.js(?:\?v=[^"']+)?/g, `app.js${query}`)
    .replace(/manifest\.json(?:\?v=[^"']+)?/g, `manifest.json${query}`)
    .replace(/sw\.js(?:\?v=[^"']+)?/g, `sw.js${query}`)
    .replace(/(?:\.\.\/)?favicon\.svg(?:\?v=[^"']+)?/g, `favicon.svg${query}`)
    .replace(/(?:\.\.\/)?favicon\.ico(?:\?v=[^"']+)?/g, `favicon.ico${query}`)
    .replace(/(?:\.\.\/)?apple-touch-icon\.png(?:\?v=[^"']+)?/g, `apple-touch-icon.png${query}`);
}

function cacheBustManifest(path, version) {
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  if (Array.isArray(manifest.icons)) {
    manifest.icons = manifest.icons.map((icon) => ({
      ...icon,
      src: icon.src.includes("?") ? icon.src : `${icon.src}?v=${version}`,
    }));
  }
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
}

function writeServiceWorker(outputDir, version, cachePrefix) {
  const swPath = join(outputDir, "sw.js");
  if (!existsSync(swPath)) return;
  const assets = [
    `./?v=${version}`,
    `./index.html?v=${version}`,
    `./styles.css?v=${version}`,
    `./app.js?v=${version}`,
    `./logic.js?v=${version}`,
    `./manifest.json?v=${version}`,
    `./favicon.svg?v=${version}`,
    `./favicon.ico?v=${version}`,
    `./apple-touch-icon.png?v=${version}`,
  ];
  let serviceWorker = readFileSync(swPath, "utf8")
    .replace(/CACHE_NAME = "[^"]+"/, `CACHE_NAME = "${cachePrefix}-${version}"`)
    .replace(/CACHE_NAME = `\$\{CACHE_PREFIX\}[^`]+`/, `CACHE_NAME = \`\${CACHE_PREFIX}${version}\``)
    .replace(/const ASSETS = \[[\s\S]*?\];/, `const ASSETS = ${JSON.stringify(assets, null, 2)};`);
  serviceWorker = serviceWorker.replace(
    /keys\.map\(\(key\) => \(key === CACHE_NAME \? null : caches\.delete\(key\)\)\)/,
    `keys.map((key) => (key.startsWith("${cachePrefix}-") && key !== CACHE_NAME ? caches.delete(key) : null))`,
  );
  writeFileSync(swPath, serviceWorker);
}

function buildApp(relativeDir, cachePrefix) {
  const appDir = join(rootDir, relativeDir);
  const outputDir = join(distDir, relativeDir);
  if (!existsSync(join(appDir, "index.html"))) {
    console.warn(`Skipping missing app: ${join(appDir, "index.html")}`);
    return;
  }
  mkdirSync(outputDir, { recursive: true });
  copyFiles(appDir, outputDir, ["index.html", "styles.css", "app.js", "logic.js", "manifest.json", "sw.js"]);
  copyFiles(rootDir, outputDir, sharedIcons);
  const version = readVersion(appDir);
  const indexPath = join(outputDir, "index.html");
  writeFileSync(indexPath, cacheBustHtml(readFileSync(indexPath, "utf8"), version));
  cacheBustManifest(join(outputDir, "manifest.json"), version);
  const appPath = join(outputDir, "app.js");
  if (existsSync(appPath)) {
    const builtApp = readFileSync(appPath, "utf8")
      .replace(/(["'])\.\/sw\.js\1/g, `$1./sw.js?v=${version}$1`)
      .replace(/from (["'])\.\/logic\.js\1/g, `from $1./logic.js?v=${version}$1`);
    writeFileSync(appPath, builtApp);
  }
  writeServiceWorker(outputDir, version, cachePrefix);
}

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });
buildApp(".", "math-sprint-v1");
buildApp("v2", "math-sprint-v2");
copyFiles(rootDir, distDir, ["CNAME"]);

console.log("Build complete: dist");
