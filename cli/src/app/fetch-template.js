import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spinner } from "@clack/prompts";
import chalk from "chalk";
import { logger } from "./logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = JSON.parse(
  readFileSync(path.resolve(__dirname, "url.json"), "utf-8")
);

const Spinner = spinner();

export const fetchFiles = async () => {
  const fetchRecursive = async (obj) => {
    const entries = await Promise.all(
      Object.entries(obj).map(async ([key, value]) => {
        if (typeof value === "object") {
          return [key, await fetchRecursive(value)];
        } else {
          const response = await fetch(value);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${value}`);
          }
          const content = await response.text();
          return [key, content];
        }
      })
    );
    return Object.fromEntries(entries);
  };

  try {
    Spinner.start(chalk.blueBright("Downloading boilerplate...."));
    const downloadedFiles = await fetchRecursive(config);
    Spinner.stop(chalk.greenBright("✅ Boilerplate downloaded successfully!"));
    return downloadedFiles;
  } catch (error) {
    Spinner.stop(chalk.redBright("❌ Failed to download"));
    logger("Error fetching files:", error);
  }
};
