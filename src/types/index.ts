type YApiResData = {
  query_path: {
    path: string;
    params: any[];
  };
  edit_uid: number;
  status: "undone" | "done"; // 可能还有其他状态
  type: "static" | "dynamic"; // 可能还有其他类型
  req_body_is_json_schema: boolean;
  res_body_is_json_schema: boolean;
  api_opened: boolean;
  index: number;
  tag: string[];
  _id: number;
  method: "GET" | "POST" | "PUT" | "DELETE";
  title: string;
  desc: string;
  path: string;
  req_params: YApiReqParams[];
  req_body_form: any[];
  req_headers: {
    required: string;
    _id: string;
    name: string;
    value: string;
  }[];
  req_query: YApiReqParams[];
  req_body_type: "json" | "form" | "file";
  res_body_type: "json" | "raw";
  res_body: string; // JSON Schema 字符串
  req_body_other: string; // JSON Schema 字符串
  project_id: number;
  catid: number;
  uid: number;
  add_time: number;
  up_time: number;
  __v: number;
  username: string;
};

type YApiReqParams = {
  name: string;
  desc?: string;
};

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type JsonSchema = Prettify<ObjectSchema | ArraySchema | PrimitiveSchema>;
type CommonSchema = {
  description?: string;
  required?: string[];
  $$ref?: string;
};
type ObjectSchema = CommonSchema & {
  type: "object";
  properties: {
    [key: string]: JsonSchema;
  };
};

type ArraySchema = CommonSchema & {
  type: "array";
  items: JsonSchema;
};

type PrimitiveSchema = CommonSchema & {
  type: "integer" | "number" | "boolean" | "string";
};
