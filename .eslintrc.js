module.exports = {
  "env": {
    "node": true,
    "es6": true,
    "jest": true, // Add Jest environment here
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:jest/recommended", // Add Jest recommended settings here
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
    "ecmaVersion": 2018,
    "sourceType": "module",
  },
  "plugins": [
    "react",
    "@typescript-eslint",
    "jest", // Add Jest plugin
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
};
