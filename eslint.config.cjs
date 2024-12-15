module.exports = [
  {
    files: ["**/*.js"], // Matches all JavaScript files
    ignores: ["babel.config.js"], // Excludes specific files
    languageOptions: {
      ecmaVersion: 2018, // Equivalent to "ecmaVersion: 2018"
      sourceType: "module", // Equivalent to "sourceType: 'module'"
      globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },
    },
    plugins: {
      jest: require("eslint-plugin-jest"), // Load the Jest plugin
    },
    rules: {
      "max-classes-per-file": "off",
      "no-underscore-dangle": "off",
      "no-console": "off",
      "no-shadow": "off",
      "no-restricted-syntax": [
        "error",
        "LabeledStatement",
        "WithStatement",
      ],
    },
    settings: {
      jest: {
        version: require("jest/package.json").version, // Ensure Jest plugin works correctly
      },
    },
  },
  {
    files: ["**/*.test.js", "**/__tests__/**/*.js"], // Apply these rules only to test files
    languageOptions: {
      globals: {
        jest: "readonly", // Add Jest globals for test files
      },
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
];
