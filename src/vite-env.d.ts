/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_ORG_ID: string;
  readonly VITE_OPENAI_PROJECT_ID: string;
  readonly VITE_OPENAI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.css" {
  const content: {[className: string]: string};
  export default content;
}

declare module "*.module.css" {
  const classes: {[key: string]: string};
  export default classes;
}

declare module "*.txt?raw" {
  const content: string;
  export default content;
}
