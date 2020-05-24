module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier',  '@typescript-eslint/eslint-plugin'],
  extends: [
    'prettier',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'airbnb-base',
    'eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: { jest: true, browser: true, node: true },
  rules: {
    'no-console': 'warn',
    'import/extensions': 'off',
    'import/prefer-default-export':'off',
    'no-throw-literal': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'import/no-extraneous-dependencies': ['error', {'devDependencies': true}] //https://stackoverflow.com/questions/44939304/eslint-should-be-listed-in-the-projects-dependencies-not-devdependencies
   },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.ts'],
      },
    },
  },
};
