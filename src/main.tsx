import {StrictMode} from "react";
import {createRoot} from "react-dom/client";

import favIcon from "@commons/favicon";

import App from "@/App";
import {ErrorBoundary} from "@/Error";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

window.addEventListener("DOMContentLoaded", () => {
  favIcon();
  document.body.style.visibility = "visible";
});
