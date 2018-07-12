module.exports = {
  extends: 'eslint:recommended',
  env: {
    node: true,
    es6: true,
  },
  parser: 'babel-eslint',
  rules: {
    'no-console': 'off',
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'no-unused-vars': 'off'
  },
  parserOptions: {
    'ecmaVersion': 8,
  }
};
