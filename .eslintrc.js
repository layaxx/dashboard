module.exports = {
  extends: ["blitz"],
  rules: {
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
        groups: ["external", "builtin", ["sibling", "parent"]],
        pathGroups: [
          {
            pattern: "blitz",
            group: "external",
            position: "before",
          },
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
          {
            pattern: "~/**",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
}
