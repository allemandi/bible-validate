import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["dist/", "coverage/", "node_modules/"]),
    { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
    { files: ["**/*.js"], languageOptions: { sourceType: "module" } },
    { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
    { languageOptions: { globals: { ...globals.browser, ...globals.jest } } },
]);
