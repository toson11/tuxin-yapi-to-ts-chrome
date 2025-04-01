/**
 * content.ts 在目标网页中执行，但与页面中的 js 是隔离的
 */

// 注入 inject.js
(function injectScript() {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL("inject.js");
  s.onload = function () {
    s.remove();
  };
  (document.head || document.documentElement).appendChild(s);
})();

// 监听来自 inject.js 的消息
window.addEventListener(
  "PassToContent",
  function (e) {
    // 发送给background.js
    chrome.runtime.sendMessage({
      action: "apiResponse",
      ...(e as any).detail,
      url: window.location.href,
    });
  },
  false
);
