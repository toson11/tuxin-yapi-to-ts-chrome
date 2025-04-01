import CodeGenerater from "./utils/codeGenerater";
import { formatCode } from "./utils/formatCode";

/**
 * 用户点击插件图标时，会触发 popup.html 页面，执行 popup.ts 脚本
 */
const init = () => {
  chrome.storage.local.get(["apiData"], (result) => {
    if (result.apiData) {
      console.log("获取到的数据:", result.apiData);
      setCode(result.apiData);
    }
  });

  const setCode = async ({ data, url }: { data: YApiResData; url: string }) => {
    let formattedCode = "";
    try {
      // 在 popup 中生成代码
      const codeGenerater = new CodeGenerater(data, url);
      formattedCode = await formatCode(codeGenerater.generateTSCode());
    } catch (error: any) {
      formattedCode = "❌ " + error.message;
    }

    const codeOutput = document.getElementById("code-output");
    if (codeOutput) {
      const pre = document.createElement("pre");
      const codeElement = document.createElement("code");
      codeElement.textContent = formattedCode || "暂无数据";
      pre.appendChild(codeElement);
      codeOutput.innerHTML = "";
      codeOutput.appendChild(pre);
    }
  };

  // 添加监听器以处理实时更新
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes.apiData) {
      console.log("数据更新:", changes.apiData);
      if (changes.apiData.newValue) {
        setCode(changes.apiData.newValue);
      }
    }
  });

  // 添加复制功能
  const copyButton = document.getElementById("copy-button");
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      const codeOutput = document.getElementById("code-output");
      if (codeOutput) {
        const code = codeOutput.textContent || "";
        await navigator.clipboard.writeText(code);

        const originalText = copyButton.textContent;
        copyButton.textContent = "已复制！";
        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 1500);
      }
    });
  }
};

init();
