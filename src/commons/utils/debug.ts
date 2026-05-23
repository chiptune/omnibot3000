export const log = (message: string, label?: string): void => {
  if (message.trim() === "") return;
  console.info(
    `%c${label ? `[${label.trim().toUpperCase()}] ` : ""}${message}`,
    "padding: 0.3rem; border-radius: 0.3rem; font: monospace; background-color: #000; color: #ccc",
  );
};
