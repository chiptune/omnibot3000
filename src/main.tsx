import {StrictMode} from "react";
import {createRoot} from "react-dom/client";

import favIcon from "@commons/favicon";
import {displayPackageVersion} from "@utils/version";

import App from "@/App";
import {ErrorBoundary} from "@/Error";

import Config from "@console/config";
import {DebugProvider} from "@hooks/useDebug";

const config = new Config();
config.apply();

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <DebugProvider debug={config.config.debug}>
        <App />
      </DebugProvider>
    </ErrorBoundary>
  </StrictMode>,
);

window.addEventListener("DOMContentLoaded", () => {
  favIcon();
  displayPackageVersion();
  document.body.style.visibility = "visible";
});
