// Vitest doesn't set the "react-server" resolve condition Next.js uses to
// pick the no-op build of the real `server-only` package, so importing it
// under test throws. This stub replaces it via the alias in vitest.config.ts.
export {};
