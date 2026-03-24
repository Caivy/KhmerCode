# Quick start

```bash
# Development (with hot reload)
pnpm dev

# Desktop development
pnpm dev:desktop

# Desktop development on an isolated port set
KHMERCODE_DEV_INSTANCE=feature-xyz pnpm dev:desktop

# Production
pnpm build
pnpm start

# Build a shareable macOS .dmg (arm64 by default)
pnpm run dist:desktop:dmg

# Or from any project directory after publishing:
npx khmercode
```
