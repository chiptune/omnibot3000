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
    host: true,
    port: 5173,
    allowedHosts: ["localhost", "omnibot"],
    watch: {
      usePolling: false /* speed up updates */,
      ignored: ["**/node_modules/**", "**/dist/**"],
    },
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: [] /* exclude heavy libs not much used */,
  },
});
