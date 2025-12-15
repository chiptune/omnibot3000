#!/usr/bin/env node

import {spawn} from "child_process";
import path from "path";
import {fileURLToPath} from "url";
import process from "process";

const filename = fileURLToPath(import.meta.url);

const dir = path.dirname(filename);
const root = path.dirname(dir);

process.chdir(root);

const vite = spawn("pnpm", ["run", "start"], {stdio: "inherit"});

vite.on("close", (code) => {
  process.exit(code);
});
