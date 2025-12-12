import {StrictMode} from "react";
import {createRoot} from "react-dom/client";

import {NAME} from "@commons/constants";
import favIcon from "@commons/favicon";
import {displayPackageVersion} from "@utils/version";

import {ConfigProvider} from "@hooks/useConfig";

import App from "@/App";
import ErrorBoundary from "@/Error";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </ErrorBoundary>
  </StrictMode>,
);

window.addEventListener("DOMContentLoaded", () => {
  favIcon();
  displayPackageVersion();
  document.title = NAME;
  document.body.style.visibility = "visible";
});

window.onscroll = () => {
  window.scrollTo(0, 0);
};
