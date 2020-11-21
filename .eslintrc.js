module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    // Gives false positives. Let TypeScript handle it.
    "import/default": "off",
    // Gives false positives. Let TypeScript handle it.
    "import/named": "off",
    "import/no-extraneous-dependencies": "error"
  }
};
