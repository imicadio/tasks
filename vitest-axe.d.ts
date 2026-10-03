// jest-axe ships Jest-flavored matcher types (augmenting jest.Matchers),
// not vitest's `Assertion` interface, even though the matcher itself
// (registered in vitest.setup.ts via expect.extend) works fine under
// vitest. This augments vitest's own types so `toHaveNoViolations()` type-checks.
import "vitest";

declare module "vitest" {
  interface Assertion<T = unknown> {
    toHaveNoViolations(): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
