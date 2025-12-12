import {exec} from "child_process";
import {
  accessSync,
  constants as FS,
  Dirent,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";
import {createServer, IncomingMessage, ServerResponse} from "http";
import path from "path";

import "dotenv/config";
import OpenAI from "openai";
import type {ChatCompletionChunk} from "openai/resources/index.mjs";
import type {Stream} from "openai/streaming";

type Package = {
  name: string;
  version: [number, number, number];
  size: number;
};

const DOMAIN = process.env.DOMAIN || "localhost";
const API_PATH = process.env.API_PATH || "/api";
const API_PORT = process.env.API_PORT || 3001;
const BASE_PATH = process.cwd();
const JSON_PATH = path.join(BASE_PATH, "dist", "packages.json");

const getFolderSize = (folder: string): number => {
  let total = 0;
  try {
    accessSync(folder, FS.R_OK);
  } catch {
    return total;
  }
  const files: Dirent[] = readdirSync(folder, {withFileTypes: true});
  for (const file of files) {
    const fullPath = path.join(folder, file.name);
    if (file.isDirectory()) total += getFolderSize(fullPath);
    else total += statSync(fullPath).size;
  }
  return total;
};

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  /* CORS headers */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  /* preflight requests */
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url || "";

  if (url.startsWith(`${API_PATH}/completion`)) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const {messages, stream} = JSON.parse(body);

        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          organization: process.env.OPENAI_ORG_ID,
          project: process.env.OPENAI_PROJECT_ID,
        });

        const response = await openai.chat.completions.create({
          /* https://openai.com/api/pricing/ */
          model: "gpt-4.1-mini",
          messages,
          max_completion_tokens: 1000,
          temperature: 1.0, // lower temperature to get stricter completion (good for code)
          //reasoning: {effort: "high"},
          stream,
        });

        if (stream) {
          /* server-sent events headers */
          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          });
          /* forward chunks to browser as SSE */
          for await (const chunk of response as unknown as Stream<ChatCompletionChunk>) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
          }
          /* end the SSE stream */
          res.write("data: [DONE]\n\n");
          res.end();
        } else {
          res.writeHead(200, {"Content-Type": "application/json"});
          res.end(JSON.stringify(response));
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : "unknown error";
        res.writeHead(500, {"Content-Type": "application/json"});
        res.end(JSON.stringify({error}));
      }
    });
  } else if (url.startsWith(`${API_PATH}/packages`)) {
    exec("npm list --json --depth=0 --silent", (err, stdout) => {
      if (err) {
        const error = err instanceof Error ? err.message : "unknown error";
        res.writeHead(500, {"Content-Type": "application/json"});
        res.end(JSON.stringify({error}));
        return;
      }
      const json = JSON.parse(stdout);
      const data = json?.dependencies || {};
      const list = Object.keys(data)
        .map((key) => {
          const dir = data[key].resolved.replace("file:", "");
          return {
            name: key,
            version: data[key].version.split(".") as Package["version"],
            size: getFolderSize(path.join(BASE_PATH, "node_modules", dir)),
          };
        })
        .sort((a, b) => (a.name < b.name ? -1 : 1));
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify(list));
      writeFileSync(JSON_PATH, JSON.stringify(list, null, 2));
    });
  } else {
    res.writeHead(404);
    res.end("nothing to see here");
  }
});

server.listen(API_PORT, () => {
  console.log(
    "\n\x1b[1m\x1b[32m%s\x1b[0m %s \x1b[36m%s\x1b[0m",
    "  →",
    "API running at",
    `http://${DOMAIN}${API_PATH}/`,
  );
  console.log(
    "\x1b[1m\x1b[32m%s\x1b[0m %s \x1b[36m%s\x1b[0m\n",
    "  →",
    "path:",
    BASE_PATH,
  );
});
