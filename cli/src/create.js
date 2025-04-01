#!/usr/bin/env node

import { Command } from "commander";
import { createPackage } from "./app/input.js";

const program = new Command();

program
  .name("lib-setup")
  .description(
    "CLI tool for setting up starter files and configurations for a Rollup-based package."
  )
  .version("0.1.0");

program
  .command("init")
  .description("Setup a new package")
  .action(createPackage);
