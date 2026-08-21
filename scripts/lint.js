import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const files = [
  "app.js",
  "logic.js",
  "logic.node.mjs",
  "scripts/build.js",
  "scripts/lint.js",
  "tests/logic.test.js",
  "tests/build.test.js",
  "v2/app.js",
  "v2/logic.js",
  "v2/sw.js",
];

for (const file of files) {
  if (existsSync(file)) execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
}

console.log("Lint OK.");
