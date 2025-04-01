import chalk from "chalk";

export const logger = {
  log: (...args) => console.log(chalk.gray(...args)),
  message: (...args) => console.log(chalk.whiteBright(...args)),
  info: (...args) => console.log(chalk.blueBright(...args)),
  warning: (...args) => console.log(chalk.yellow(...args)),
  success: (...args) => console.log(chalk.green(...args)),
  highlight: (...args) => console.log(chalk.bgCyanBright(...args)),
  error: (...args) => console.log(chalk.redBright(...args)),
  debug: console.log,
};
