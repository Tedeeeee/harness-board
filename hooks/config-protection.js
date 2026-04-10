/**
 * PreToolUse hook: Block modifications to linter/formatter config files.
 * Steers the agent to fix code instead of weakening configs.
 *
 * Reads tool input from stdin (JSON), checks if the target file is a
 * protected config file, and exits with code 2 to block the action.
 */
const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(0, "utf8");
const data = JSON.parse(input);

const filePath = (data.tool_input?.file_path || "").replace(/\\/g, "/");
const base = path.basename(filePath);

const blocked = [
  ".eslintrc",
  ".prettierrc",
  "biome.json",
  "biome.jsonc",
  ".stylelintrc",
  "tsconfig.json",
  ".eslintignore",
  ".prettierignore",
];

const isBlocked = blocked.some(
  (pattern) => base === pattern || base.startsWith(pattern.replace("*", ""))
);

if (isBlocked) {
  process.stderr.write(
    `BLOCKED: Do not modify linter/formatter config (${base}). Fix the code instead.`
  );
  process.exit(2);
}

process.stdout.write(input);
