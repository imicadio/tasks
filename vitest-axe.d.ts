// jest-axe ships Jest-flavored matcher types (augmenting jest.Matchers),
// not vitest's `Assertion` interface, even though the matcher itself
// (registered in vitest.setup.ts via expect.extend) works fine under
// vitest. This augments vitest's own types so `toHaveNoViolations()` type-checks.
import "vitest";

interface CustomMatchers<R = unknown> {
  toHaveNoViolations(): R;
}

declare module "vitest" {
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
