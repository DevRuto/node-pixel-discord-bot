module.exports = {
  env: {
    node: true,
    es6: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2021
  },
  rules: {
    'prefer-const': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  }
}
