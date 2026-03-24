#!/usr/bin/env node

import { execFileSync } from "node:child_process";

const legacyRuntime = ["b", "u", "n"].join("");
const pattern = [
  String.raw`\b${legacyRuntime}\b`,
  `${legacyRuntime}.lock`,
  `${legacyRuntime}fig`,
  "@types/" + legacyRuntime,
  "@effect/sql-sqlite-" + legacyRuntime,
  `process.versions.${legacyRuntime}`,
  `${legacyRuntime[0].toUpperCase()}${legacyRuntime.slice(1)}\\.`,
].join("|");

try {
  execFileSync(
    "rg",
    [
      "-n",
      "--hidden",
      "--glob",
      "!node_modules",
      "--glob",
      "!.git",
      "--glob",
      "!pnpm-lock.yaml",
      pattern,
      ".",
    ],
    { stdio: "inherit" },
  );
  process.exitCode = 1;
} catch (error) {
  if (typeof error === "object" && error !== null && "status" in error && error.status === 1) {
    process.exitCode = 0;
  } else {
    throw error;
  }
}
