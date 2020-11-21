import execa from "execa";

export const build = async (args: string[]): Promise<never> => {
  try {
    await execa("tsc", ["--build"], { preferLocal: true, stdio: "inherit" });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  try {
    await execa(
      "rollup",
      ["--config", require.resolve("../configs/rollup.js"), ...args],
      { preferLocal: true, stdio: "inherit" },
    );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  process.exit(0);
};
