import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(rootDir, "dist");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assetUrls(html) {
  return [...html.matchAll(/(?:href|src)="([^"?#]+\?v=[^"]+)"/g)].map((match) => `./${match[1]}`);
}

function testApp(relativeDir, cachePrefix) {
  const outputDir = join(distDir, relativeDir);
  const indexPath = join(outputDir, "index.html");
  const swPath = join(outputDir, "sw.js");
  assert(existsSync(indexPath), `${relativeDir}: built index.html is missing`);
  assert(existsSync(swPath), `${relativeDir}: built sw.js is missing`);
  const indexHtml = readFileSync(indexPath, "utf8");
  const serviceWorker = readFileSync(swPath, "utf8");
  for (const asset of assetUrls(indexHtml)) {
    assert(serviceWorker.includes(JSON.stringify(asset)), `${relativeDir}: precache is missing ${asset}`);
  }
  const appPath = join(outputDir, "app.js");
  if (existsSync(appPath)) {
    const app = readFileSync(appPath, "utf8");
    for (const match of app.matchAll(/from ["']\.\/(logic\.js\?v=[^"']+)["']/g)) {
      assert(serviceWorker.includes(JSON.stringify(`./${match[1]}`)), `${relativeDir}: precache is missing imported module ${match[1]}`);
    }
  }
  const usesDeclaredPrefix = serviceWorker.includes(`CACHE_PREFIX = "${cachePrefix}-"`) && serviceWorker.includes("key.startsWith(CACHE_PREFIX)");
  const usesInlinePrefix = serviceWorker.includes(`CACHE_NAME = "${cachePrefix}-`) && serviceWorker.includes(`key.startsWith("${cachePrefix}-")`);
  assert(usesDeclaredPrefix || usesInlinePrefix, `${relativeDir}: cache cleanup is not isolated`);
}

execFileSync(process.execPath, ["scripts/build.js"], { cwd: rootDir, stdio: "inherit" });
testApp(".", "math-sprint-v1");
assert(existsSync(join(distDir, "CNAME")), "CNAME was not preserved");
assert(
  readFileSync(join(distDir, "CNAME"), "utf8") === readFileSync(join(rootDir, "CNAME"), "utf8"),
  "CNAME changed during build",
);

if (existsSync(join(rootDir, "v2", "index.html"))) {
  testApp("v2", "math-sprint-v2");
  const manifest = JSON.parse(readFileSync(join(distDir, "v2", "manifest.json"), "utf8"));
  assert(manifest.scope === "./", "v2 manifest scope must be ./");
  assert(manifest.icons.length > 0, "v2 manifest needs installable icons");
  const v2Worker = readFileSync(join(distDir, "v2", "sw.js"), "utf8");
  for (const icon of manifest.icons) {
    assert(v2Worker.includes(JSON.stringify(`./${icon.src}`)), `v2: precache is missing manifest icon ${icon.src}`);
  }
}

console.log("Build artifact tests passed.");
