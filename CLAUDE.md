# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KhmerCode is a minimal web GUI for coding agents (Codex, Claude). It runs as a Node.js WebSocket server + React frontend, with an optional Electron desktop shell. Very early WIP — sweeping maintainability improvements are encouraged.

## Commands

```bash
# Development (hot reload)
pnpm dev                # Full stack
pnpm dev:server         # Server only
pnpm dev:web            # Web only
pnpm dev:desktop        # Desktop app

# Isolated desktop dev instance
KHMERCODE_DEV_INSTANCE=feature-xyz pnpm dev:desktop

# Build & run production
pnpm build
pnpm start

# Quality gates (ALL must pass before task completion)
pnpm fmt                # Format (oxfmt)
pnpm fmt:check          # Check formatting
pnpm lint               # Lint (oxlint)
pnpm typecheck          # TypeScript strict checking
pnpm test               # Vitest

# Desktop distribution
pnpm dist:desktop:dmg   # macOS
pnpm dist:desktop:linux # Linux AppImage
pnpm dist:desktop:win   # Windows NSIS
```

## Architecture

**Monorepo** managed by pnpm workspaces + Turborepo. TypeScript throughout.

### Apps

- **`apps/server`** — Node.js WebSocket server. Wraps `codex app-server` (JSON-RPC over stdio) per provider session, serves the React web app, streams structured events to browser. Key files: `wsServer.ts` (WS routing), `codexAppServerManager.ts` (session lifecycle), `providerManager.ts` (event coordination).
- **`apps/web`** — React 19 + Vite 8 UI. TanStack Router, Zustand state, Tailwind CSS v4, Lexical editor. Connects to server via WebSocket. Key files: `store.ts` (global state), `wsNativeApi.ts` (WS client API).
- **`apps/desktop`** — Electron 40 shell. Spawns the server process, loads web app in BrowserWindow.
- **`apps/marketing`** — Astro static site.

### Packages

- **`packages/contracts`** — Effect/Schema schemas and TypeScript types. **Schema-only — no runtime logic.**
- **`packages/shared`** — Shared runtime utilities. Uses explicit subpath exports (`@khmercode/shared/git`, `@khmercode/shared/logging`) — **no barrel index**.

### Event Flow

Browser → WebSocket → Server → `codex app-server` (JSON-RPC/stdio) → runtime events → normalized to orchestration events → ServerPushBus → WebSocket push → Browser state hydration.

Web app consumes orchestration domain events via WebSocket push on channel `orchestration.domainEvent`.

### Build Dependencies

Contracts must build before dev/test (`turbo.json` enforces this). When modifying contracts, rebuild before testing downstream consumers.

## Tooling

- **Runtime**: Node.js 24.13.1, pnpm 10.6.5 (via `.mise.toml`)
- **Bundling**: tsdown (server/packages), Vite 8 (web)
- **Formatting**: oxfmt (not prettier)
- **Linting**: oxlint (not eslint)
- **Testing**: Vitest + Playwright for browser tests
- **Functional**: Effect library used extensively in server and contracts

## Core Priorities

1. Performance first
2. Reliability first
3. Predictable under load and failures (reconnects, partial streams, session restarts)
4. Correctness and robustness over short-term convenience

## Maintainability Rules

- Extract shared logic to separate modules — duplicate logic across files is a code smell
- Don't take shortcuts by adding local logic when shared abstractions exist
- Don't be afraid to change existing code

## Reference

- Codex App Server docs: https://developers.openai.com/codex/sdk/#app-server
- Codex repo: https://github.com/openai/codex
- Codex-Monitor (Tauri reference impl): https://github.com/Dimillian/CodexMonitor
