import { spawnSync } from "node:child_process";

function exitWithUsage(code = 1) {
  console.error(
    [
      "Usage:",
      "  npm run supabase:admin:bootstrap:local -- you@example.com",
      "  npm run supabase:admin:bootstrap:linked -- you@example.com",
      "",
      "Optional flags:",
      '  --note "Initial admin"',
    ].join("\n"),
  );
  process.exit(code);
}

function quoteSql(value) {
  return `'${value.replaceAll("'", "''")}'`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
  exitWithUsage();
}

const mode = args[0];

if (mode !== "--local" && mode !== "--linked") {
  exitWithUsage();
}

const remaining = args.slice(1);
const email = remaining.find((arg) => !arg.startsWith("--"));

if (!email) {
  exitWithUsage();
}

let note = "Initial admin";

for (let index = 0; index < remaining.length; index += 1) {
  if (remaining[index] === "--note") {
    note = remaining[index + 1] ?? note;
  }
}

const sql = `select public.bootstrap_first_admin(${quoteSql(email)}, ${quoteSql(
  note,
)});`;

const result = spawnSync(
  "npx",
  ["supabase", "db", "query", sql, mode, "--output", "table", "--agent=no"],
  {
    stdio: "inherit",
  },
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
