import { RollupOptions } from "rollup";
import * as fs from "fs";
import * as path from "path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import babelConfig from "./babel";
import pkgDir from "pkg-dir";
import json from "@rollup/plugin-json";
import { extensions, extensionsWithDot } from "../extensions";

const root = pkgDir.sync();

if (typeof root !== "string") {
  throw new Error("Could not find root.");
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(path.join(root, "package.json"));

// Allow an input file with any of our supported extensions.
const inputFilePath = extensions
  .map((ext) => path.join(root, "src", `index.${ext}`))
  .find((p) => fs.existsSync(p));

if (!inputFilePath) {
  throw new Error("No input file.");
}

const inputFilePathRelative = path.relative(root, inputFilePath);

const getPathToDirectory = (pathToFile: string) =>
  pathToFile.split("/").slice(0, -1).join("/");

export const config: RollupOptions = {
  input: inputFilePathRelative,
  output: [
    pkg.main && {
      dir: getPathToDirectory(pkg.main),
      format: "cjs" as const,
    },
    pkg.module && {
      dir: getPathToDirectory(pkg.module),
      format: "esm" as const,
    },
  ].filter(Boolean),
  plugins: [
    // @ts-expect-error
    peerDepsExternal(),
    postcss({
      extract: false,
      modules: false,
      use: ["sass"],
    }),
    json(),
    babel({
      babelrc: false,
      babelHelpers: "runtime",
      extensions: extensionsWithDot,
      ...babelConfig,
    }),
    resolve({ extensions: extensionsWithDot }),
    commonjs({ extensions: extensionsWithDot }),
  ],
};

module.exports = config;
