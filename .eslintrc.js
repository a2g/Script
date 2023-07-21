module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint"
  ],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  rules: {
    "restrict-template-expressions": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "max-line-length": [
      true,
      {
        "limit": 120,
        "ignore-pattern": "^import [^,]+ from |^export | implements"
      }
    ],
  },
};
