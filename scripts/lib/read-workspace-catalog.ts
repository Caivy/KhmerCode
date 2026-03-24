import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "yaml";

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const workspaceManifestPath = resolve(repoRoot, "pnpm-workspace.yaml");

export function readWorkspaceCatalog(): Record<string, unknown> {
  const raw = readFileSync(workspaceManifestPath, "utf8");
  const parsed = parse(raw) as { catalog?: unknown } | null;

  if (!parsed || typeof parsed !== "object" || parsed.catalog === undefined) {
    throw new Error(`Missing 'catalog' in ${workspaceManifestPath}.`);
  }

  if (
    typeof parsed.catalog !== "object" ||
    parsed.catalog === null ||
    Array.isArray(parsed.catalog)
  ) {
    throw new Error(`Expected 'catalog' in ${workspaceManifestPath} to be an object.`);
  }

  return parsed.catalog as Record<string, unknown>;
}
