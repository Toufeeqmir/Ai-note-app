import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverProcess = spawn("node", ["server.mjs"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: false,
});

const clientProcess = spawn(npmCommand, ["run", "dev:client"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: false,
});

const shutdown = () => {
  serverProcess.kill("SIGTERM");
  clientProcess.kill("SIGTERM");
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

serverProcess.on("exit", (code) => {
  if (code && code !== 0) {
    process.exit(code);
  }
});

clientProcess.on("exit", (code) => {
  if (code && code !== 0) {
    process.exit(code);
  }
});
