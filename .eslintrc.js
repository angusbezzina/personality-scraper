module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["plugin:react-hooks/recommended"],
  plugins: ["simple-import-sort", "import"],
  rules: {
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Side effect imports ie. import "styles.css"
          ["^\\u0000"],
          // External dependencies
          ["^react$", "^next", "^[a-z]", "^@?\\w"],
          // Internal dependencies
          ["^@personality-scraper/"],
          // Relative internal dependencies
          ["^\\./", "^\\.\\./"],
          // Internal type imports
          ["^@personality-scraper/.*\\.d\\.ts$"],
          ["^@/\\w"],
        ],
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  ignorePatterns: ["node_modules", "dist", "build", "out", ".next", "*.cjs", "*.js", "*.json"],
};
