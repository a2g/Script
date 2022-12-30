module.exports = {
  // Extends the previous ESLint configuration by adding `settings`
  // <--! Previous configuration comes here !-->
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
};