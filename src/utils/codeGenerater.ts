import { config } from "../config";
import BaseCodeGenerater, { TypeType } from "./codeBaseGenerater";
class CodeGenerater extends BaseCodeGenerater {
  constructor(data: YApiResData, url: string) {
    super(data, url, {
      customApiConfig: config.customApiConfig,
    });
  }

  generateTypeName(path: string, type: TypeType) {
    if (typeof config.customName === "function") {
      return config.customName(path, type);
    }
    return super.generateTypeName(path, type);
  }

  generateApiCode(yapiResData: YApiResData, hasReqParams: boolean) {
    if (typeof config.customApiCode === "function") {
      return config.customApiCode(yapiResData, hasReqParams);
    }
    return super.generateApiCode(yapiResData, hasReqParams);
  }
}

export default CodeGenerater;
