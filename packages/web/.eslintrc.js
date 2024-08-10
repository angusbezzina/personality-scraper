const path = require("node:path");

module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "../../.eslintrc.js"],
  rules: {
    "@next/next/no-img-element": "off",
    "@next/next/no-html-link-for-pages": ["error", path.join(__dirname, "src/app")],
  },
  ignorePatterns: ["./next.config.js"],
};
