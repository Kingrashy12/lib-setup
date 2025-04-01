import { cancel, isCancel, log, select, spinner, text } from "@clack/prompts";
import "./global.js";
import { fetchFiles } from "./fetch-template.js";
import { createFile, createPath, createRootPath, folders } from "./file.js";
import { logger } from "./logger.js";
import chalk from "chalk";
import { changeAppName } from "./utils.js";

const Spinner = spinner();

class AppInput {
  packageType = "plain";
  packageName = "";

  async #getPackageName() {
    const name = await text({
      message: "What is your package name?",
      placeholder: "my-package",
      defaultValue: "my-package",
    });
    this.packageName = name;
  }

  async #getPackageType() {
    const anwser = await select({
      message: "What package are you creating?",
      options: [
        { value: "react", label: "React Package" },
        { value: "plain", label: "Plain", hint: "Default" },
      ],
    });
    this.packageType = anwser;
  }

  async #downloadBoilerPlates() {
    const boilerplates = await fetchFiles();
    globalThis.templates = boilerplates;
  }

  createDir = async (sub) => {
    try {
      for (const dir of folders) {
        createPath(`${sub}/${dir}`);
      }
      logger.log("\nfolders:\n");
      for (const dir of folders) {
        log.message(chalk.blueBright(`/${dir}`));
      }
    } catch (error) {
      logger.error(error);
    }
  };

  async #handleDir() {
    await createRootPath(this.packageName);
    await this.createDir(this.packageName);
  }

  async #createTemplate() {
    const { common } = globalThis.templates;
    const name = this.packageName;
    await createFile(
      `${name}/package.json`,
      changeAppName(name, common.package)
    );
    await createFile(`${name}/.gitignore`, common.gitignore);
    await createFile(`${name}/rollup.config.js`, common["rollup-config"]);
    await createFile(`${name}/tsconfig.json`, common.tsconfig);
    await createFile(`${name}/src/index.ts`, "// Entry file");
    const files = [
      "package.json",
      ".gitignore",
      "rollup.config.js",
      "tsconfig.json",
      "src/index.ts",
    ];

    logger.log("\nfiles:\n");
    for (const file of files) {
      log.message(chalk.blueBright(`/${file}`));
    }
  }
  async #createReactTemplate() {
    const { react, common } = globalThis.templates;
    const name = this.packageName;
    await createFile(
      `${name}/package.json`,
      changeAppName(name, react.package)
    );
    await createFile(`${name}/.gitignore`, common.gitignore);
    await createFile(`${name}/rollup.config.js`, react["rollup-config"]);
    await createFile(`${name}/tsconfig.json`, react.tsconfig);
    await createFile(`${name}/src/index.ts`, "// Entry file");
    const files = [
      "package.json",
      ".gitignore",
      "rollup.config.js",
      "tsconfig.json",
      "src/index.ts",
    ];

    logger.log("\nfiles:\n");
    for (const file of files) {
      log.message(chalk.blueBright(`/${file}`));
    }
  }

  async #create() {
    if (this.packageType === "react") {
      await this.#createReactTemplate();
    } else await this.#createTemplate();
  }

  async init() {
    try {
      log.info(chalk.green("🚀 Starting package creation..."));

      await this.#getPackageName();

      if (isCancel(this.packageName)) {
        cancel(
          chalk.red("❌ Process closed: Package name input was cancelled.")
        );
        process.exit(0);
      }

      await this.#getPackageType();

      if (isCancel(this.packageType)) {
        cancel(chalk.red("❌ Process closed: Type selection was cancelled."));
        process.exit(0);
      }

      await this.#downloadBoilerPlates();
      await this.#handleDir();

      Spinner.start(
        `📂 Creating project: ${chalk.blueBright(this.packageName)}...`
      );

      await this.#create();

      Spinner.stop(
        chalk.green(`✅ Project "${this.packageName}" created successfully 🎉`)
      );
    } catch (error) {
      Spinner.stop(chalk.red("❌ Something went wrong.", error.message));
      log.error(chalk.red(`▲ Error: ${error}`));
      process.exit(1);
    }
  }
}

export const createPackage = new AppInput().init();
