import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Feature-based architecture boundaries — see docs/ARCHITECTURE.md.
//
// A feature's public API is its `index.ts`; everything else in
// `src/features/<name>/` is private. Code inside a feature uses relative
// imports (`./server/queries`) among its own files, so these rules — which
// only match the `@/...` path-alias form — restrict cross-module imports
// without restricting a feature's own internals.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/**"],
              message:
                "Import a feature's public API only (`@/features/<name>`, its index.ts). Deep imports into another feature's internals are not allowed — see docs/ARCHITECTURE.md.",
            },
            {
              group: ["@/app/**/_*/**", "@/app/**/_*"],
              message:
                "Don't import another route segment's private (_folder) files. Promote shared code to src/features or src/shared.",
            },
          ],
        },
      ],
    },
  },
  // src/shared must stay generic: no dependency on features or app.
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/**"],
              message:
                "src/shared must not depend on any feature — see docs/ARCHITECTURE.md.",
            },
            {
              group: ["@/app/**"],
              message:
                "src/shared must not depend on src/app — see docs/ARCHITECTURE.md.",
            },
          ],
        },
      ],
    },
  },
  // src/features must not depend on the routing layer.
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**"],
              message:
                "Features must not depend on src/app — see docs/ARCHITECTURE.md.",
            },
          ],
        },
      ],
    },
  },
  // Components are arrow functions — see docs/ARCHITECTURE.md §6.
  // shadcn-generated primitives are exempt: `shadcn add` regenerates them.
  {
    files: ["src/**/*.tsx"],
    ignores: [
      "src/**/__tests__/**",
      "src/shared/ui/{badge,button,input,scroll-area,select,separator,sheet,sidebar,skeleton,switch,tooltip}.tsx",
    ],
    rules: {
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      // No functions written inline in JSX (props or render-prop children):
      // name them as handlers in the component body, or as utils — see
      // docs/ARCHITECTURE.md §6. `.map(...)` callbacks are fine.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXExpressionContainer > :matches(ArrowFunctionExpression, FunctionExpression)",
          message:
            "Don't write functions inline in JSX — extract a named handler (`const handleX = …`) or a util. See docs/ARCHITECTURE.md §6.",
        },
        {
          selector:
            "JSXExpressionContainer > :matches(ConditionalExpression, LogicalExpression) > :matches(ArrowFunctionExpression, FunctionExpression)",
          message:
            "Don't write functions inline in JSX — extract a named handler (`const handleX = …`) or a util. See docs/ARCHITECTURE.md §6.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
