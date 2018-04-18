module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'typescript-eslint-parser'
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0
  }
};
