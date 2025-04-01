/**
 * 后台脚本，不在html页面中执行
 * 1. 监听来自 content.ts 和 popup.ts 的消息
 * 2. 进行跨域请求
 * 3. 将请求结果返回给 content.ts 和 popup.ts
 */
chrome.runtime.onInstalled.addListener(() => {
  console.log("Tuxin YAPI to TS 扩展已安装");
});

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener(
  async (message, _sender, _sendResponse) => {
    // 如果消息类型为 apiResponse，则进行处理
    if (message.action === "apiResponse") {
      const { data } = message.data || {};
      if (!data) return;

      chrome.storage?.local.set({ apiData: { data, url: message.url } });
      return true;
    }
  }
);
