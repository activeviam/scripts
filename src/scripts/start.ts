import execa from "execa";
import { extensionsWithDot } from "../extensions";

export const start = async (args: string[]): Promise<void> => {
  execa(
    "babel",
    [
      "src",
      "--out-dir",
      "dist/esm",
      "--watch",
      "--no-babelrc",
      "--extensions",
      extensionsWithDot.join(","),
      "--config-file",
      require.resolve("../configs/babel.js"),
      ...args,
    ],
    {
      preferLocal: true,
      stdio: "inherit",
    },
  );
};
