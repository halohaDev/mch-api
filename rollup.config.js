import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/app.js", // replace with path to your main server file
  output: {
    file: "build/bundle.js",
    format: "cjs",
    sourcemap: true, // generate source maps
  },
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    babel({
      exclude: ["node_modules/**", "**/_test/**"],
    }),
    json(),
    terser(),
  ],
  external: ["aws-sdk", "nock", "mock-aws-s3", "cloudflare:sockets"],
};
