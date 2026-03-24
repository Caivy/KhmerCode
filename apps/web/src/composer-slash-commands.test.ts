import { describe, expect, it } from "vitest";

import { buildInitSlashCommandPrompt } from "./composer-slash-commands";

describe("buildInitSlashCommandPrompt", () => {
  it("targets AGENTS.md for codex", () => {
    const prompt = buildInitSlashCommandPrompt("codex");

    expect(prompt).toContain("create an AGENTS.md file");
    expect(prompt).toContain("If there's already an AGENTS.md in the repo directory, improve it.");
    expect(prompt).not.toContain("CLAUDE.md");
  });

  it("targets CLAUDE.md for Claude", () => {
    const prompt = buildInitSlashCommandPrompt("claudeAgent");

    expect(prompt).toContain("create a CLAUDE.md file");
    expect(prompt).toContain("If there's already a CLAUDE.md in the repo directory, improve it.");
    expect(prompt).not.toContain("AGENTS.md");
  });
});
