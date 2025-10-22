import http from "http";
import fs from "fs";
import path from "path";
import {exec} from "child_process";

export const API_PATH = "/api";
export const API_PORT = 3001;
export const BASE_PATH = process.cwd();

function getFolderSize(folder) {
  console.log(folder);
  let total = 0;
  try {
    fs.accessSync(folder, fs.constants.R_OK);
  } catch (err) {
    return total;
  }
  const files = fs.readdirSync(folder, {withFileTypes: true});
  for (const file of files) {
    const fullPath = path.join(folder, file.name);
    if (file.isDirectory()) total += getFolderSize(fullPath);
    else total += fs.statSync(fullPath).size;
  }
  return total;
}

const server = http.createServer((req, res) => {
  if (req.url === `${API_PATH}/packages`) {
    exec("npm list --json --depth=0", (err, stdout) => {
      if (err) {
        res.writeHead(500, {"Content-Type": "application/json"});
        res.end(JSON.stringify({error: "Failed to get packages"}));
        return;
      }
      const json = JSON.parse(stdout);
      const data = json?.dependencies || {};
      const list = Object.keys(data)
        .map((key) => {
          const dir = data[key].resolved.replace("file:", "");
          return {
            name: key,
            version: data[key].version,
            size: getFolderSize(path.join(BASE_PATH, "node_modules", dir)),
          };
        })
        .sort((a, b) => (a.name < b.name ? -1 : 1));
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify(list));
    });
  } else {
    res.writeHead(404);
    res.end("nothing to see here");
  }
});

server.listen(API_PORT, () => {
  console.log(`> http://localhost:${API_PORT}${API_PATH}/packages running`);
  console.log(`> path: ${BASE_PATH}`);
});
