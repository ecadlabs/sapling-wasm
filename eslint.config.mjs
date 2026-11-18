import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/pkg/**',
      '**/pkg-web/**',
      '**/target/**',
      'packages/sapling-wasm/examples/**'
    ]
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    }
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    }
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    }
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['packages/sapling-wasm/src/**/*.ts']
  })),
  {
    files: ['packages/sapling-wasm/src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.es2021
      },
      parserOptions: {
        project: './packages/sapling-wasm/tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never'
        }
      ],
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            Buffer: {
              message: 'Use Uint8Array instead of Node Buffer.'
            },
            BigInt: {
              message: 'Use primitive bigint instead of BigInt.'
            }
          }
        }
      ],
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/unbound-method': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      'curly': 'error',
      'eqeqeq': ['error', 'smart'],
      'guard-for-in': 'error',
      'no-bitwise': 'off',
      'no-caller': 'error',
      'no-cond-assign': 'error',
      'no-debugger': 'error',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': 'error',
      'no-eval': 'error',
      'no-fallthrough': 'error',
      'no-implicit-coercion': 'error',
      'no-new-wrappers': 'error',
      'no-param-reassign': 'error',
      'no-redeclare': 'error',
      'no-restricted-globals': [
        'error',
        {
          name: 'Buffer',
          message: 'Use Uint8Array and DataView instead of Node Buffer.'
        }
      ],
      'no-return-await': 'off',
      'no-sequences': 'error',
      'no-shadow': ['error', { hoist: 'all' }],
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-throw-literal': 'error',
      'no-undef': 'off',
      'no-undef-init': 'error',
      'no-unsafe-finally': 'error',
      'no-unused-labels': 'error',
      'no-var': 'error',
      'no-void': 'error',
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'prefer-const': 'error',
      'prefer-template': 'error',
      'radix': 'error',
      'use-isnan': 'error',
      'yoda': 'error'
    }
  }
)
