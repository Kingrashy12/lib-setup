import fs from "fs";
import { logger } from "./logger.js";
import path from "path";

export const folders = ["src", "scripts"];

export const createRootPath = async (folderName) => {
  const resolvedPath = path.resolve(folderName);

  try {
    if (!fs.existsSync(resolvedPath)) {
      fs.mkdirSync(folderName);
    } else if (folderName !== "./") {
      logger.error(
        `\nThe path '${folderName}' already exists. No action was taken.`
      );
      process.exit(1);
    }
  } catch (err) {
    logger.error(err.message);
  }
};

export const createPath = async (folderName) => {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    logger.error(err.message);
  }
};

export const createFile = async (name, content) => {
  try {
    if (!fs.existsSync(name)) {
      fs.writeFileSync(name, content);
    }
  } catch (err) {
    logger.warning(err);
  }
};
