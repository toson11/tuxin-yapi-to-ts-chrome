import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { copyFileSync, rmSync, mkdirSync } from "fs";

// 清理 dist 目录的插件
const cleanDist = () => ({
  name: "clean-dist",
  buildStart() {
    rmSync("dist", { recursive: true, force: true });
    mkdirSync("dist", { recursive: true });
  },
});

// 复制静态文件的插件
const copyFiles = () => ({
  name: "copy-files",
  buildEnd() {
    copyFileSync("manifest.json", "dist/manifest.json");
    copyFileSync("src/popup.html", "dist/popup.html");
    copyFileSync("src/popup.css", "dist/popup.css");
  },
});

export default {
  input: {
    popup: "src/popup.ts",
    background: "src/background.ts",
    content: "src/content.ts",
    inject: "src/inject.ts",
  },
  output: {
    dir: "dist",
    format: "esm",
    entryFileNames: "[name].js",
    chunkFileNames: "[name]-[hash].js",
  },
  plugins: [
    cleanDist(),
    typescript(),
    copyFiles(),
    // 将 CommonJS 模块转换为 ES 模块
    nodeResolve(),
    commonjs(),
  ],
};
