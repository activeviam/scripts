import execa from "execa";
import { extensions } from "../extensions";
import pkgDir from "pkg-dir";

export const lint = async (args: string[]): Promise<never> => {
  const root = pkgDir.sync();

  if (!root) {
    throw new Error("Could not find root.");
  }

  const fix = args.includes("--fix");

  const sortPackageJson = async (fix: boolean) => {
    const args = fix ? [] : ["--check"];
    await execa("sort-package-json", args, {
      stdio: "inherit",
      preferLocal: true,
    });
  };

  const useBuiltinIgnore = !args.includes("--ignore-path");

  const lintFilesArgs = ["src"];

  const extensionArgs = extensions.flatMap((e) => ["--ext", e]);

  // sort-package-json
  try {
    await sortPackageJson(fix);
  } catch (e) {
    console.error(e);
    console.log('You can run "yarn lint --fix" to resolve this.');
    process.exit(1);
  }

  // We use these for ESLint and Prettier.
  const ignoreArgs = useBuiltinIgnore
    ? ["--ignore-path", require.resolve("../../ignore")]
    : [];

  // Prettier
  try {
    const inputGlob = `src/**/*.{${extensions.join(",")}}`;
    const fixArgs = fix ? ["--write"] : ["--check"];
    await execa("prettier", [...ignoreArgs, inputGlob, ...fixArgs], {
      preferLocal: true,
      stdio: "inherit",
    });
  } catch (e) {
    console.error(e);
    console.log('You can run "yarn lint --fix" to resolve this.');
    process.exit(1);
  }

  // ESLint
  try {
    await execa(
      "eslint",
      [
        "--max-warnings",
        "0",
        ...ignoreArgs,
        ...extensionArgs,
        ...lintFilesArgs,
        ...args,
      ],
      {
        preferLocal: true,
        stdio: "inherit",
      },
    );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  process.exit(0);
};
