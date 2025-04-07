import { TypeType } from "../utils/codeBaseGenerater";
import Prettier from "prettier";

export type CustomConfig = {
  /** 自定义http实例的导入路径，没有则不导入，即 http.post 的 http引入路径 */
  httpImportPath?: string;
  /** 支持自定义请求参数类型名称、响应参数类型名称及接口名称 */
  customName?: (path: string, type: TypeType) => string;
  /** 自定义请求配置，如 loading: true 等 */
  customApiConfig?: Record<string, string>;
  /** 支持自定义接口代码, 返回接口代码定义 */
  customApiCode?: (yapiResData: YApiResData, hasReqParams: boolean) => string;
  /** 支持自定义代码格式化规则：prettier 配置 */
  prettierConfig?: Prettier.Options;
};
/**
 * 自定义配置项
 */
export const config: CustomConfig = {
  // httpImportPath: "@/core/http",
  customApiConfig: {
    loading: "true",
  },
  prettierConfig: {
    singleQuote: true,
    semi: true,
    tabWidth: 2,
  },
};
