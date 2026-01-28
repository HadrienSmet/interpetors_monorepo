import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
	{
		ignores: [
			"eslint.config.js",
			"**/dist/**",
			"**/build/**",
			"**/.turbo/**",
			"**/.next/**",
			"**/coverage/**",
			"**/node_modules/**",
			"**/out/**",
			"**/.vite/**",
		],
	},
	{
		files: ["**/*.{ts,tsx,js,jsx}"],
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended, 
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
		},
	},
	{
		files: ["src/**/*.{ts,tsx}"],
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ["./tsconfig.app.json"],
			},
		},
		extends: [
			...tseslint.configs.recommendedTypeChecked,
			...tseslint.configs.stylisticTypeChecked,
		],
		rules: {
			"react-hooks/exhaustive-deps": "off",
			"@typescript-eslint/array-type": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-floating-promises": "off",
			"@typescript-eslint/no-misused-promises": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
		},
	},
);
