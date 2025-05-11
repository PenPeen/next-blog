import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import esLintPluginGraphQL from '@graphql-eslint/eslint-plugin';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import { fixupPluginRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {
    env: {
      es2022: true,
      node: true,
      browser: true,
    },
  },
});

// GraphQLプラグインがESLint 9のフラット設定に完全に対応していないため
// メタデータを追加して対応
const graphqlPlugin = {
  ...fixupPluginRules(esLintPluginGraphQL),
  meta: {
    name: '@graphql-eslint/eslint-plugin',
  },
};

const eslintConfig = [
  // グローバルな無視設定
  {
    ignores: ['node_modules/**', 'dist/**', '.next/**', 'coverage/**']
  },

  // Next.js、TypeScript、ESLintの推奨設定
  ...compat.extends("next/core-web-vitals", "eslint:recommended", "plugin:@typescript-eslint/recommended"),

  // TypeScriptファイル用の設定
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // GraphQLファイル用の設定
  {
    files: ['src/**/*.graphql'],
    plugins: {
      '@graphql-eslint': graphqlPlugin,
    },
    languageOptions: {
      parser: graphqlPlugin.parser,
    },
    rules: {
      '@graphql-eslint/no-anonymous-operations': 'error',
    },
  },
];

export default eslintConfig;
