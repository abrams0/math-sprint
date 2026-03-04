import { execSync } from "node:child_process";

const files = [
  "app.js",
  "logic.js",
  "logic.node.mjs",
  "tests/logic.test.js",
];

for (const file of files) {
  execSync(`node --check ${file}`, { stdio: "inherit" });
}

console.log("Lint OK.");
