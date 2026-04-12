import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const STATE_FILE = path.join(ROOT_DIR, ".scalzo-dev-servers.json");
const WEB_ENV_FILE = path.join(ROOT_DIR, "apps/web/.env.local");
const ROOT_ENV_FILE = path.join(ROOT_DIR, ".env.local");
const NPM_COMMAND = process.platform === "win32" ? "npm.cmd" : "npm";
const NPX_COMMAND = process.platform === "win32" ? "npx.cmd" : "npx";
const NEXT_WORKSPACE_ARGS = ["run", "dev", "--workspace", "@scalzo/web"];
const SUPABASE_START_ARGS = ["supabase", "start"];
const SUPABASE_STOP_ARGS = ["supabase", "stop"];
const SUPABASE_STATUS_ARGS = ["supabase", "status", "-o", "json"];

function log(message) {
  console.log(`[dev-servers] ${message}`);
}

function error(message) {
  console.error(`[dev-servers] ${message}`);
}

function exitWithUsage(code = 1) {
  const usage = [
    "Usage:",
    "  npm run dev:local",
    "  npm run dev:local:stop",
  ].join("\n");

  if (code === 0) {
    console.log(usage);
  } else {
    console.error(usage);
  }

  process.exit(code);
}

function readState() {
  try {
    return JSON.parse(readFileSync(STATE_FILE, "utf8"));
  } catch {
    return null;
  }
}

function writeState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function removeState() {
  rmSync(STATE_FILE, { force: true });
}

function isProcessRunning(pid) {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch (error_) {
    return error_.code === "EPERM";
  }
}

function runCommand(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: ROOT_DIR,
    stdio: "inherit",
    ...options,
  });
}

function runCommandForJson(command, args) {
  return spawnSync(command, args, {
    cwd: ROOT_DIR,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
  });
}

function getSupabaseStatus() {
  const result = runCommandForJson(NPX_COMMAND, SUPABASE_STATUS_ARGS);

  if ((result.status ?? 1) !== 0) {
    const stderr = result.stderr?.trim();

    if (stderr) {
      error(stderr);
    }

    process.exit(result.status ?? 1);
  }

  try {
    return JSON.parse(result.stdout);
  } catch (error_) {
    error(`Failed to parse Supabase status JSON: ${error_.message}`);
    process.exit(1);
  }
}

function upsertEnvVars(filePath, updates) {
  const existingContent = existsSync(filePath)
    ? readFileSync(filePath, "utf8")
    : "";
  const lines = existingContent === "" ? [] : existingContent.split(/\r?\n/);
  const pending = new Map(Object.entries(updates));

  const nextLines = lines.map((line) => {
    const match = line.match(/^([A-Z0-9_]+)=/);

    if (!match) {
      return line;
    }

    const key = match[1];

    if (!pending.has(key)) {
      return line;
    }

    const value = pending.get(key);
    pending.delete(key);
    return `${key}=${value}`;
  });

  for (const [key, value] of pending) {
    nextLines.push(`${key}=${value}`);
  }

  writeFileSync(filePath, `${nextLines.join("\n").replace(/\n*$/, "")}\n`);
}

function syncSupabaseEnvFiles(status) {
  const envUpdates = {
    NEXT_PUBLIC_SUPABASE_URL: status.API_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: status.PUBLISHABLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY: status.SECRET_KEY,
  };

  upsertEnvVars(WEB_ENV_FILE, envUpdates);
  upsertEnvVars(ROOT_ENV_FILE, envUpdates);

  log(`Synced local Supabase env values from live status: ${status.API_URL}`);
}

function cleanupStaleState() {
  const state = readState();

  if (!state) {
    return null;
  }

  if (isProcessRunning(state.managerPid)) {
    return state;
  }

  removeState();
  return null;
}

async function waitForProcessExit(pid, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (!isProcessRunning(pid)) {
      return true;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
  }

  return !isProcessRunning(pid);
}

async function stop() {
  const state = cleanupStaleState();

  if (state?.managerPid && isProcessRunning(state.managerPid)) {
    log(`Stopping local manager process ${state.managerPid}.`);
    process.kill(state.managerPid, "SIGTERM");

    const managerStopped = await waitForProcessExit(state.managerPid);

    if (!managerStopped) {
      error(
        `Manager process ${state.managerPid} did not exit in time. Check the terminal running npm run dev:local.`,
      );
      process.exit(1);
    }

    return;
  }

  if (state?.nextPid && isProcessRunning(state.nextPid)) {
    log(`Stopping Next.js process ${state.nextPid}.`);
    process.kill(state.nextPid, "SIGTERM");
    await waitForProcessExit(state.nextPid);
  }

  log("Stopping local Supabase services.");
  const result = runCommand(NPX_COMMAND, SUPABASE_STOP_ARGS);
  removeState();
  process.exit(result.status ?? 0);
}

async function start() {
  const existingState = cleanupStaleState();

  if (existingState) {
    error(
      `Local dev servers are already running under manager process ${existingState.managerPid}. Use npm run dev:local:stop first.`,
    );
    process.exit(1);
  }

  log("Starting local Supabase services.");
  const supabaseResult = runCommand(NPX_COMMAND, SUPABASE_START_ARGS);

  if ((supabaseResult.status ?? 1) !== 0) {
    process.exit(supabaseResult.status ?? 1);
  }

  const supabaseStatus = getSupabaseStatus();
  syncSupabaseEnvFiles(supabaseStatus);

  log("Starting Next.js dev server. Its output will stream below.");
  const nextProcess = spawn(NPM_COMMAND, NEXT_WORKSPACE_ARGS, {
    cwd: ROOT_DIR,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: supabaseStatus.API_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: supabaseStatus.PUBLISHABLE_KEY,
      SUPABASE_SERVICE_ROLE_KEY: supabaseStatus.SECRET_KEY,
    },
  });

  if (nextProcess.pid) {
    writeState({
      managerPid: process.pid,
      nextPid: nextProcess.pid,
      startedAt: new Date().toISOString(),
    });
  }

  let shuttingDown = false;

  async function shutdown({ signal, exitCode = 0, stopNext = true } = {}) {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;

    if (signal) {
      log(`Received ${signal}. Stopping local dev servers.`);
    } else {
      log("Stopping local dev servers.");
    }

    removeState();

    if (stopNext && nextProcess.pid && isProcessRunning(nextProcess.pid)) {
      nextProcess.kill("SIGTERM");
      const nextExited = await waitForProcessExit(nextProcess.pid, 5_000);

      if (!nextExited && isProcessRunning(nextProcess.pid)) {
        nextProcess.kill("SIGKILL");
        await waitForProcessExit(nextProcess.pid, 2_000);
      }
    }

    const stopResult = runCommand(NPX_COMMAND, SUPABASE_STOP_ARGS);
    process.exit(exitCode || stopResult.status || 0);
  }

  process.on("SIGINT", () => {
    void shutdown({ signal: "SIGINT" });
  });

  process.on("SIGTERM", () => {
    void shutdown({ signal: "SIGTERM" });
  });

  process.on("SIGHUP", () => {
    void shutdown({ signal: "SIGHUP" });
  });

  process.on("uncaughtException", (error_) => {
    console.error(error_);
    void shutdown({ signal: "uncaughtException", exitCode: 1 });
  });

  process.on("unhandledRejection", (reason) => {
    console.error(reason);
    void shutdown({ signal: "unhandledRejection", exitCode: 1 });
  });

  nextProcess.on("error", (error_) => {
    console.error(error_);
    void shutdown({ exitCode: 1 });
  });

  nextProcess.on("exit", (code, signal) => {
    void shutdown({
      signal: signal ? `next:${signal}` : undefined,
      exitCode: code ?? 0,
      stopNext: false,
    });
  });
}

const mode = process.argv[2];

if (!mode) {
  exitWithUsage();
}

if (mode === "start") {
  await start();
} else if (mode === "stop") {
  await stop();
} else if (mode === "--help" || mode === "-h") {
  exitWithUsage(0);
} else {
  exitWithUsage();
}
