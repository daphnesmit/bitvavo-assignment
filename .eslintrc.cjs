module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
		"plugin:jsx-a11y/recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'prettier.config.cjs', 'jest.config.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@tanstack/query'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/display-name' : 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
  },
}
