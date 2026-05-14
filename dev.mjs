import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm run dev:client" : "npm";
const npmArgs = isWindows ? [] : ["run", "dev:client"];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverProcess = spawn(process.execPath, ["server.mjs"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: false,
});

const clientProcess = spawn(npmCommand, npmArgs, {
  cwd: __dirname,
  stdio: "inherit",
  shell: isWindows,
});

let isShuttingDown = false;

const shutdown = (exitCode = 0) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  if (!serverProcess.killed) serverProcess.kill("SIGTERM");
  if (!clientProcess.killed) clientProcess.kill("SIGTERM");

  if (exitCode) {
    process.exitCode = exitCode;
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

serverProcess.on("error", (error) => {
  console.error(`API server failed to start: ${error.message}`);
  shutdown(1);
});

clientProcess.on("error", (error) => {
  console.error(`Vite dev server failed to start: ${error.message}`);
  shutdown(1);
});

serverProcess.on("exit", (code) => {
  if (!isShuttingDown && code && code !== 0) {
    shutdown(code);
  }
});

clientProcess.on("exit", (code) => {
  if (!isShuttingDown && code && code !== 0) {
    shutdown(code);
  }
});
