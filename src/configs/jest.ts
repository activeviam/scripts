import path from "path";
import pkgDir from "pkg-dir";
import { extensions } from "../extensions";

const root = pkgDir.sync();

if (!root) {
  throw new Error("Could not find root.");
}

const ignores = [
  "/node_modules/",
  "/__fixtures__/",
  "/fixtures/",
  "/__tests__/helpers/",
  "/__tests__/utils/",
  "__mocks__",
];

export default {
  roots: [path.join(root, "src")],
  testEnvironment: "jsdom",
  moduleFileExtensions: extensions,
  collectCoverageFrom: [`src/**/*.+(${extensions.join("|")})`],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores],
  testMatch: [`**/*.test.(${extensions.join("|")})`],
  transformIgnorePatterns: [
    `[/\\\\]node_modules[/\\\\].+\\.(${extensions.join("|")})$`,
  ],
  transform: {
    "^.+\\.[jt]sx?$": require.resolve("./jestBabelTransform.js"),
  },
};
