import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import { sentryRollupPlugin } from "@sentry/rollup-plugin";

export default {
  input: "src/app.js", // replace with path to your main server file
  output: {
    file: "build/bundle.js",
    format: "cjs",
    sourcemap: true, // generate source maps
  },
  plugins: [
    commonjs(),
    json(),
    babel({
      exclude: ["node_modules/**", "**/_test/**"],
    }),
    terser(),
    sentryRollupPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "tanbo",
      project: "node",
    }),
  ],
  external: ["cloudflare:sockets", "aws-sdk", "mock-aws-s3", "nock"],
};
