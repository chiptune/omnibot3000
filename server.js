import { createServer } from "http";
import { accessSync, readdirSync, statSync, constants as FS } from "fs";
import path from "path";
import { exec } from "child_process";
export const API_PATH = "/api";
export const API_PORT = 3001;
export const BASE_PATH = process.cwd();
const getFolderSize = (folder) => {
    let total = 0;
    try {
        accessSync(folder, FS.R_OK);
    }
    catch (err) {
        return total;
    }
    const files = readdirSync(folder, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(folder, file.name);
        if (file.isDirectory())
            total += getFolderSize(fullPath);
        else
            total += statSync(fullPath).size;
    }
    return total;
};
const server = createServer((req, res) => {
    if (req.url === `${API_PATH}/packages`) {
        exec("npm list --json --depth=0", (err, stdout) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Failed to get packages" }));
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
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(list));
        });
    }
    else {
        res.writeHead(404);
        res.end("nothing to see here");
    }
});
server.listen(API_PORT, () => {
    console.log(`> http://localhost:${API_PORT}${API_PATH}/packages running`);
    console.log(`> path: ${BASE_PATH}`);
});
