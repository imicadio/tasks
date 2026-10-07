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
        },        {
          selector:
            "JSXExpressionContainer > ConditionalExpression:matches([consequent.type=/^JSX/], [alternate.type=/^JSX/])",
          message:
            "Don't choose between two JSX trees with a ternary — move the choice into a small component with early returns. See docs/ARCHITECTURE.md §6.",
        },
        {
          selector:
            "BinaryExpression[operator=/^[!=]==$/]:not(:has(UnaryExpression[operator='typeof'])) > Literal[value=/^[A-Za-z][\\w-]*$/]",
          message:
            "Compare against a named constant (e.g. `VEHICLE_TYPE.Other`), not a string literal. See docs/ARCHITECTURE.md §6.",
        },
        {
          selector: "SwitchCase > Literal.test",
          message:
            "Switch on named constants (`case SORT_FIELD.Name:`), not string literals. See docs/ARCHITECTURE.md §6.",
        },
        {
          selector: "TSTypeAliasDeclaration > TSUnionType > TSLiteralType:first-child > Literal[raw=/^[\"']/]",
          message:
            "Don't spell a union of string literals by hand — derive it from an `as const` map: `type X = ValueOf<typeof X_MAP>`. See docs/ARCHITECTURE.md §6.",
        },
        {
          selector:
            "VariableDeclarator[id.name=/^[A-Z]/] > ArrowFunctionExpression > ObjectPattern > TSTypeAnnotation TSTypeLiteral",
          message:
            "Don't type a component's props inline — declare `type Props = { … }` above the component and use `({ … }: Props)`. See docs/ARCHITECTURE.md §6.",
        },
      ],
      // Small files, one job each — see docs/ARCHITECTURE.md §6.
      "max-lines": ["error", { max: 100, skipBlankLines: true, skipComments: true }],
      "no-nested-ternary": "error",
    },
  },
  // Same literal rules for plain .ts files (the .tsx block above carries
  // them alongside its JSX rules — two no-restricted-syntax entries for one
  // file would override each other).
  {
    files: ["src/**/*.ts"],
    ignores: ["src/**/__tests__/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "BinaryExpression[operator=/^[!=]==$/]:not(:has(UnaryExpression[operator='typeof'])) > Literal[value=/^[A-Za-z][\\w-]*$/]",
          message:
            "Compare against a named constant (e.g. `VEHICLE_TYPE.Other`), not a string literal. See docs/ARCHITECTURE.md §6.",
        },
        {
          selector: "SwitchCase > Literal.test",
          message:
            "Switch on named constants (`case SORT_FIELD.Name:`), not string literals. See docs/ARCHITECTURE.md §6.",
        },
        {
          selector: "TSTypeAliasDeclaration > TSUnionType > TSLiteralType:first-child > Literal[raw=/^[\"']/]",
          message:
            "Don't spell a union of string literals by hand — derive it from an `as const` map: `type X = ValueOf<typeof X_MAP>`. See docs/ARCHITECTURE.md §6.",
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
