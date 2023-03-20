module.exports = {
  // Extends the previous ESLint configuration by adding `settings`
  // <--! Previous configuration comes here !-->
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
      '@typescript-eslint',
  ],
  extends: [
      'eslint:recommended'
  ],
  rules: {
    "no-unused-vars": "off",
    "no-undef": "off",
    "@typescript-eslint/no-unused-vars": ["error"]
  },
  parserOptions: {
      tsconfigRootDir: "./",
      project: "tsconfig.json",
  }
};

