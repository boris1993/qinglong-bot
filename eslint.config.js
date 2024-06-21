import eslint from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import globals from 'globals';

export default typescriptEslint.config(
    {
        ignores: [
            "dist/"
        ]
    },
    eslint.configs.recommended,
    ...typescriptEslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2024,
            },
        },
    }
);
