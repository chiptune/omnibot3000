import {StrictMode} from "react";
import {createRoot} from "react-dom/client";

import favIcon from "@commons/favicon";
import {displayPackageVersion} from "@utils/version";

import App from "@/App";
import {ErrorBoundary} from "@/Error";

import {DebugProvider} from "@hooks/useDebug";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <DebugProvider>
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
