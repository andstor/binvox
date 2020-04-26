import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from "rollup-plugin-babel";
import { terser } from 'rollup-plugin-terser';

const pkg = require("./package.json");
const date = (new Date()).toDateString();

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}, ${pkg.license}
 */`;

const lib = {

  module: {
    input: "src/index.js",
    plugins: [resolve(), babel(), json()],
    output: {
      file: pkg.module,
      format: "esm",
      banner
    }
  },

  main: {
    input: "src/index.js",
    plugins: [resolve(), commonjs(), babel(), json()],
    output: {
      file: pkg.main,
      format: 'umd',
      name: pkg.name.replace(/-/g, "").toUpperCase(),
      sourcemap: true,
      banner
    }
  },

  min: {
    input: "src/index.js",
    plugins: [resolve(), commonjs(), babel(), json()],
    output: {
      file: pkg.main.replace(".js", ".min.js"),
      format: 'umd',
      name: pkg.name.replace(/-/g, "").toUpperCase(),
      plugins: [terser()],
      banner
    }
  }

};

export default [lib.module, lib.min, lib.main];
