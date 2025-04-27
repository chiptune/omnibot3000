import packageJson from "@root/package.json";

const VERSION = String(packageJson.version)
  .split(".")
  .map((v) => Number(v));

export const PACKAGE_VERSION = `${packageJson.name} version ${VERSION.join(".")}`;

export const displayPackageVersion = (): void => {
  const CHAR = "░";
  const len = PACKAGE_VERSION.length;

  const lines = [
    String(CHAR).repeat(len + 6),
    `${CHAR}${String(" ").repeat(len + 4)}${CHAR}`,
    `${CHAR}  ${PACKAGE_VERSION}  ${CHAR}`,
    `${CHAR}${String(" ").repeat(len + 4)}${CHAR}`,
    String(CHAR).repeat(len + 6),
  ];

  console.info(`%c${lines.join("\n")}`, "font:15px monospace;color:hsl(150 65 50);background:hsl(150 65 50 / 0.1)");
};

export default VERSION;
