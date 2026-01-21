import { includeIgnoreFile } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import classnames from "eslint-plugin-classnames"
import tailwindcss from "eslint-plugin-tailwindcss"
import eslintPluginUnicorn from "eslint-plugin-unicorn"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const maxLineCount = 200

const eslintConfig = [
  includeIgnoreFile(gitignorePath),
  { ignores: ["**/*.d.ts"] },
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),
  eslintPluginUnicorn.configs["flat/recommended"],
  ...tailwindcss.configs["flat/recommended"],
  {
    plugins: {
      classnames,
      tailwindcss,
    },

    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "classnames/no-unnecessary-whitespace": "error",
      "classnames/one-by-one-arguments": "error",
      "classnames/order-classnames": "error",
      "classnames/prefer-classnames-function": [
        "error",
        {
          functionName: "clsx",
        },
      ],

      eqeqeq: "error",
      "max-lines": ["warn", maxLineCount],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-lonely-if": "error",
      "no-magic-numbers": [
        "warn",
        {
          ignoreDefaultValues: true,
          ignore: [-1, 0, 1, 2, 100, 1000],
        },
      ],
      "no-nested-ternary": "warn",
      "no-unneeded-ternary": "warn",
      "no-unused-expressions": "error",
      "no-useless-computed-key": "warn",
      "no-throw-literal": "error",
      "no-useless-return": "warn",
      "prefer-arrow-callback": "warn",
      "prefer-object-spread": "warn",
      "prefer-destructuring": "warn",
      radix: "error",
      yoda: "warn",
      "prefer-const": "error",
      "no-var": "error",
      "default-param-last": "error",

      "import/newline-after-import": "error",
      "import/no-useless-path-segments": [
        "error",
        {
          noUselessIndex: true,
        },
      ],
      "import/order": [
        "error",
        {
          alphabetize: {
            caseInsensitive: true,
            order: "asc",
          },

          groups: ["external", "builtin", ["sibling", "parent"]],

          pathGroups: [
            {
              group: "external",
              pattern: "blitz",
              position: "before",
            },
            {
              group: "external",
              pattern: "react",
              position: "before",
            },
            {
              group: "internal",
              pattern: "~/**",
            },
          ],

          pathGroupsExcludedImportTypes: ["react"],
        },
      ],

      "no-alert": "error",
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "no-duplicate-imports": "error",
      "no-restricted-imports": ["error", "@prisma/client"],

      "tailwindcss/no-custom-classname": ["warn"],
      "tailwindcss/no-contradicting-classname": "error",
      "tailwindcss/enforces-shorthand": "warn",
      "tailwindcss/no-arbitrary-value": "error",

      "unicorn/filename-case": "off",
      "unicorn/prefer-module": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/no-array-callback-reference": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-useless-undefined": [
        "error",
        {
          checkArguments: false,
        },
      ],
      "unicorn/prefer-node-protocol": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          allowList: {
            Ctx: true,
            Props: true,
            getInitialProps: true,
            props: true,
          },
        },
      ],
      "unicorn/switch-case-braces": ["warn", "avoid"],
    },
  },
  { files: ["*.js"], rules: { "@typescript-eslint/no-require-imports": "off" } },
  { files: ["**/*test.ts"], rules: { "no-magic-numbers": "off" } },
]

export default eslintConfig
