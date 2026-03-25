import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "yaml";

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const workspaceManifestPath = resolve(repoRoot, "pnpm-workspace.yaml");

interface WorkspaceManifest {
  readonly catalog?: unknown;
  readonly onlyBuiltDependencies?: unknown;
}

function readWorkspaceManifest(): WorkspaceManifest {
  const raw = readFileSync(workspaceManifestPath, "utf8");
  const parsed = parse(raw) as WorkspaceManifest | null;

  if (!parsed || typeof parsed !== "object") {
    throw new Error(`Expected ${workspaceManifestPath} to parse to an object.`);
  }

  return parsed;
}

export function readWorkspaceCatalog(): Record<string, unknown> {
  const parsed = readWorkspaceManifest();

  if (parsed.catalog === undefined) {
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

export function readWorkspaceOnlyBuiltDependencies(): string[] {
  const parsed = readWorkspaceManifest();
  const { onlyBuiltDependencies } = parsed;

  if (onlyBuiltDependencies === undefined) {
    return [];
  }

  if (!Array.isArray(onlyBuiltDependencies)) {
    throw new Error(`Expected 'onlyBuiltDependencies' in ${workspaceManifestPath} to be an array.`);
  }

  const invalidEntry = onlyBuiltDependencies.find((value) => typeof value !== "string");
  if (invalidEntry !== undefined) {
    throw new Error(
      `Expected every 'onlyBuiltDependencies' entry in ${workspaceManifestPath} to be a string.`,
    );
  }

  return [...onlyBuiltDependencies];
}
