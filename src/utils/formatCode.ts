import prettier from "prettier/standalone";
import typescriptPlugin from "prettier/plugins/typescript.js";
import estreePlugin from "prettier/plugins/estree.js";

/**
 * 格式化代码
 * @param code 代码
 * @returns 格式化后的代码
 */
export async function formatCode(code: string): Promise<string> {
  try {
    return prettier.format(code, {
      parser: "typescript",
      plugins: [typescriptPlugin, estreePlugin],
      singleQuote: true,
      semi: true,
      tabWidth: 2,
    });
  } catch (error: any) {
    throw new Error("格式化代码失败:" + error.message);
  }
}
