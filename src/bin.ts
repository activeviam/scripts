import yargs from "yargs";
import { build } from "./scripts/build";
import { start } from "./scripts/start";
import { lint } from "./scripts/lint";
import { test } from "./scripts/test";
import { getArgs } from "./getArgs";

yargs
  .command(
    "build",
    "Build a package using Rollup.",
    (v) => v,
    async (options) => {
      await build(getArgs(options._[0]));
    },
  )
  .command(
    "start",
    "Start a package using Babel.",
    (v) => v,
    async (options) => {
      await start(getArgs(options._[0]));
    },
  )
  .command(
    "lint",
    "Lint a package using ESLint.",
    (v) => v,
    async (options) => {
      await lint(getArgs(options._[0]));
    },
  )
  .command(
    "test",
    "Test a package using Jest.",
    (v) => v,
    async (options) => {
      await test(getArgs(options._[0]));
    },
  )
  .demandCommand(1, "")
  .parse();
