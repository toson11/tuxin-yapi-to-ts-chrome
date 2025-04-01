import { TypeType } from "../utils/codeBaseGenerater";

export type CustomConfig = {
  httpImportPath: string;
  /** 支持自定义请求参数类型名称、响应参数类型名称及接口名称 */
  customName?: (path: string, type: TypeType) => string;
  /** 支持自定义接口代码, 返回接口代码定义 */
  customApiCode?: (yapiResData: YApiResData, hasReqParams: boolean) => string;
};
/**
 * 自定义配置项
 */
export const config: CustomConfig = {
  httpImportPath: "@/core/http",
};
