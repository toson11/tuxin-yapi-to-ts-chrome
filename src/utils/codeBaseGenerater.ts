/**
 * 生成 TypeScript 代码
 * ！！！如需自定义，通过继承CodeGenerater类重写方法
 */
/**
 * TS类型的类型，是请求体、响应体还是接口
 */
export enum TypeType {
  req = "req",
  res = "res",
  api = "api",
}
export type CodeGeneraterOptions = {
  /** 自定义http导入路径 */
  httpImportPath?: string;
};

class BaseCodeGenerater {
  /** yapi 接口数据 */
  private yapiResData: YApiResData;
  /** 网页地址 */
  private url: string;
  /** 选项 */
  private options?: CodeGeneraterOptions;
  constructor(data: YApiResData, url: string, options?: CodeGeneraterOptions) {
    this.yapiResData = data;
    this.url = url;
    this.options = options;
  }

  /**
   * 生成 TypeScript 代码
   * @returns TypeScript 代码
   */
  generateTSCode = () => {
    const {
      req_body_is_json_schema,
      req_body_other,
      res_body_is_json_schema,
      res_body,
      path,
    } = this.yapiResData;
    let reqTypeCode = "";
    let resTypeCode = "";
    if (req_body_is_json_schema && req_body_other) {
      // 请求体数据类型
      const reqType = this.bodyJsonToTsCode(req_body_other);
      if (reqType) {
        reqTypeCode = `export type ${this.generateTypeName(path, TypeType.req)} = ${reqType}`;
      }
    }
    if (res_body_is_json_schema && res_body) {
      // 响应体数据类型
      const resType = this.bodyJsonToTsCode(res_body, "data");
      if (resType) {
        resTypeCode = `export type ${this.generateTypeName(path, TypeType.res)} = ${resType}`;
      }
    }
    // 接口代码
    const code = `${this.generateApiCode(this.yapiResData, !!reqTypeCode)}`;

    return `${code}\n\n${reqTypeCode}\n\n${resTypeCode}`;
  };

  /**
   * 将请求体或响应体转换为 TypeScript 类型
   * @param jsonSchema JSON Schema 字符串
   * @param key 最外层无需处理，只需处理指定key
   * @returns TypeScript 类型
   */
  bodyJsonToTsCode = (jsonSchema: string, key?: string) => {
    const jsonSchemaObject = JSON.parse(jsonSchema) as ObjectSchema;
    if (jsonSchemaObject.type === "object") {
      const { properties } = jsonSchemaObject;
      // 最外层无需处理，只需处理data
      return this.generateTypeValue(key ? properties[key] : jsonSchemaObject);
    }
    return "";
  };

  /**
   * 生成类型名称，如需自定义，通过继承CodeGenerater类重写
   * @param path 路径
   * @param type 类型
   * @returns 类型名称
   */
  public generateTypeName(path: string, type: TypeType) {
    // 默认类型名称
    const typeName = path
      // 去掉路径中的params参数
      .replace(/\{\w+\}/g, "")
      // 通过-或/分割路径
      .split(/[-/]/)
      // 将每个单词的首字母大写
      .map((item) => item.replace(/^\w/, (char) => char.toUpperCase()))
      .join("");
    if (type === TypeType.req) {
      // 请求参数类型名称
      return `${typeName}Req`;
    }
    if (type === TypeType.res) {
      // 响应参数类型名称
      return `${typeName}Res`;
    }
    if (type === TypeType.api) {
      // 接口名称
      return `fetch${typeName}`;
    }
    return typeName;
  }

  /**
   * 生成类型值
   * @param jsonSchema JSON Schema 字符串
   * @returns TypeScript 类型
   */
  generateTypeValue(jsonSchema: JsonSchema) {
    if (!jsonSchema) return "";
    let code = "";
    if (jsonSchema.type === "object") {
      code += this.generatePropertiesJson(jsonSchema.properties);
    } else if (jsonSchema.type === "array") {
      code += `${this.generateTypeValue(jsonSchema.items)}[]`;
    } else {
      code += `${jsonSchema.type === "integer" ? "number" : jsonSchema.type}`;
    }
    return code;
  }

  /**
   * 生成接口注释
   * @param title 标题
   * @param url 请求地址
   * @returns 接口注释
   */
  public generateTypeDesc(params?: { name: string; desc?: string }[]) {
    let comment = `/**\n* ${this.yapiResData.title}\n`;
    params?.forEach((item) => {
      comment += ` * @param ${item.name} ${item.desc}\n`;
    });
    comment += ` * @see ${this.url}\n`;
    comment += `*/`;
    return comment;
  }

  /**
   * 生成对象类型
   * @param properties 对象属性
   * @returns 对象类型
   */
  generatePropertiesJson(properties: ObjectSchema["properties"]) {
    if (!Object.keys(properties)?.length) return "";
    const code = Object.entries(properties)
      .map(([key, value]) => {
        const isRequired = value.required;
        let desc = value.description ? `/** ${value.description} */\n` : "";
        return `${desc}${key}${isRequired ? "?" : ""}: ${this.generateTypeValue(value)}`;
      })
      .join("\n");
    return `{
    ${code}
  }`;
  }

  /**
   * 生成接口代码，如需自定义，通过继承CodeGenerater类重写
   * @param data 接口数据
   * @param hasReqParams 是否存在请求参数
   * @returns 接口代码
   */
  public generateApiCode(yapiResData: YApiResData, hasReqParams: boolean) {
    const { path, method, req_params, req_query } = yapiResData;
    // 请求参数类型
    let paramsType = "";
    // 请求参数key
    let dataKey = "";
    if (hasReqParams) {
      paramsType = this.generateTypeName(path, TypeType.req);
      dataKey = method === "GET" ? "params" : "data";
    }

    // 接口参数
    let paramsStr = "";
    if (req_params.length) {
      // 处理路径params参数
      req_params.forEach((item) => {
        paramsStr += `${item.name}: string | number`;
      });
    }

    if (req_query.length) {
      // 处理路径query参数
      req_query.forEach((item) => {
        paramsStr += `, ${item.name}: string | number`;
      });
    }

    if (paramsType) {
      // 处理请求体参数
      paramsStr += `${paramsStr ? ", " : ""}params: ${paramsType}`;
    }

    // 生成接口注释
    const typeDesc = this.generateTypeDesc(req_params);
    const apiTypeName = this.generateTypeName(path, TypeType.api);
    const resTypeName = this.generateTypeName(path, TypeType.res);
    const url = this.handlePath(path, req_params, req_query);
    const importCode = this.options?.httpImportPath
      ? `import http from "${this.options.httpImportPath}";`
      : "";

    return `${importCode}\n\n${typeDesc}
    export const ${apiTypeName} = (${paramsStr}) => {
    return http.${method.toLowerCase()}<${resTypeName}>({
      url: \`"${url}"${dataKey ? `,\n${dataKey}: params,` : ""}\`
    });
  };`;
  }

  /**
   * 处理路径，添加params和query参数
   * @param path 路径
   * @param req_params 请求参数
   * @param req_query 请求查询参数
   * @returns 处理后的路径
   */
  public handlePath(
    path: string,
    req_params: YApiReqParams[],
    req_query: YApiReqParams[]
  ) {
    let url = path;
    req_params?.forEach((item) => {
      url = url.replace(`{${item.name}}`, `\${${item.name}}`);
    });
    req_query?.forEach((item) => {
      url += `${url.includes("?") ? "&" : "?"}${item.name}=\${${item.name}}`;
    });
    return url;
  }
}

export default BaseCodeGenerater;
