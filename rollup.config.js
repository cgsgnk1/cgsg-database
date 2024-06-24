import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-import-css";

// It seems that this is not used

export default {
  input: "./server.ts",
  output: {
    dir: "./",
    format: "iife",
    name: "XXX",
    sourcemap: "inline",
  },
  plugins: [css(), typescript(), json(), nodeResolve(), commonjs(), replace({
    preventAssignment: false,
    "process.env.NODE_ENV": '"development"',
  })]
};
