import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";

export default {
  input: "src/app.js", // replace with path to your main server file
  output: {
    file: "build/bundle.js",
    format: "cjs",
    sourcemap: true, // generate source maps
  },
  plugins: [
    externals(),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    babel({
      exclude: "node_modules/**",
    }),
  ],
};
