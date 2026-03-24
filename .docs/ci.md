# CI quality gates

- `.github/workflows/ci.yml` runs `pnpm lint`, `pnpm typecheck`, and `pnpm test` on pull requests and pushes to `main`.
- `.github/workflows/release.yml` builds macOS (`arm64` and `x64`), Linux (`x64`), and Windows (`x64`) desktop artifacts from a single `v*.*.*` tag and publishes one GitHub release.
- The release workflow auto-enables signing only when secrets are present: Apple credentials for macOS and Azure Trusted Signing credentials for Windows. Without secrets, it still releases unsigned artifacts.
- See `docs/release.md` for full release/signing setup checklist.
