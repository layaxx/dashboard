module.exports = {
  extends: ["blitz", "plugin:tailwindcss/recommended", "plugin:unicorn/recommended"],
  ignorePatterns: ["*.d.ts"],
  plugins: ["classnames", "tailwindcss"],
  rules: {
    "classnames/no-unnecessary-whitespace": 2,
    "classnames/one-by-one-arguments": 2,
    "classnames/order-classnames": 2,
    "classnames/prefer-classnames-function": [2, { functionName: "clsx" }],
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
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-duplicate-imports": "error",
    "tailwindcss/no-custom-classname": [1, { whitelist: [".*\\-primary"] }],
    "unicorn/filename-case": "off",
    "unicorn/prefer-module": "off",
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
  },
}
