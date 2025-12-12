import {defineConfig, loadEnv} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import pkg from "./package.json";

import react from "@vitejs/plugin-react";

/* https://vitejs.dev/config/ */
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), "");

  console.info(
    "\n\x1b[1m\x1b[32m%s\x1b[0m %s \x1b[32m%s\x1b[0m %s \x1b[36m%s\x1b[0m",
    "→",
    "Running",
    `${pkg["x-display-name"]} v${pkg.version}`,
    "dev server at",
    `http://${env.DOMAIN}:${env.DEV_PORT}`,
  );

  return {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __APP_NAME__: JSON.stringify(pkg["x-display-name"]),
      "import.meta.env.DOMAIN": JSON.stringify(env.DOMAIN),
      "import.meta.env.DEV_PORT": JSON.stringify(env.DEV_PORT),
      "import.meta.env.API_PORT": JSON.stringify(env.API_PORT),
      "import.meta.env.API_PATH": JSON.stringify(env.API_PATH),
      "import.meta.env.BASE_PATH": JSON.stringify(process.cwd()),
    },
    plugins: [react(), tsconfigPaths()],
    server: {
      host: true,
      port: 3000,
      allowedHosts: [env.DOMAIN],
      watch: {
        usePolling: false /* speed up updates */,
        ignored: ["**/node_modules/**", "**/dist/**"],
      },
      hmr: {
        protocol: "ws",
        host: env.DOMAIN,
        port: Number(env.DEV_PORT),
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
      exclude: [] /* exclude heavy libs not much used */,
    },
  };
});
