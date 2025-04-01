# Tuxin YApi To Ts

## 简介

将 YApi 接口文档转换为 TypeScript 接口定义文件。

## 安装

```bash
pnpm install tuxin-yapi-to-ts
```

## 打包

```bash
pnpm run build
```

## 使用

- 将打包生成的dist目录拖到chrome扩展程序中，即可使用。
- 打开 YApi 接口页面，点击右上角插件图标，即可生成 TypeScript 接口定义文件。

## 自定义

如需自定义生成内容，可优先修改 `src/config/index.ts` 中的配置进行自定义。
