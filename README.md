# Tuxin YApi To Ts

## 简介

将 YApi 接口文档转换为 TypeScript 接口定义文件。

## 使用

#### 1. 安装

```bash
pnpm install
```

#### 2. 打包

```bash
pnpm run build
```

#### 3. 安装 chrome 扩展

将打包生成的`dist`目录拖到chrome扩展程序中进行安装，即可使用。

#### 4. 提取 YApi 接口文档类型

打开 YApi 接口页面，点击右上角插件图标，即可生成 TypeScript 接口定义文件。

## 自定义配置

如需自定义生成内容，可优先修改 `src/config/index.ts` 中的配置进行自定义，详细配置参考 `src/config/index.ts` 中的注释。

## 注意

- 每次更新代码，需要重新打包，并在chrome扩展程序中更新插件。
