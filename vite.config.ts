import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import {version} from "./package.json";

import react from "@vitejs/plugin-react";

/* https://vitejs.dev/config/ */
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  plugins: [react(), tsconfigPaths()],
  server: {
    allowedHosts: ["localhost", "lol"],
  },
});
