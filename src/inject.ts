/**
 * 注入到目标网页中，拦截 XMLHttpRequest 请求
 */
function injectScript() {
  var XHR = XMLHttpRequest.prototype;
  var send = XHR.send;
  var open = XHR.open;

  // 拦截 open 方法，获取请求的 URL 和方法
  XHR.open = function (_method: string, url: string) {
    (this as any)._url = url;
    return open.apply(this, arguments as any);
  };

  // 拦截 send 方法，获取响应数据
  XHR.send = function () {
    this.addEventListener("load", function () {
      if (this.responseType != "blob" && this.responseText) {
        const _url = (this as any)._url;
        try {
          // 只发送和当前页面相同id的请求
          if (getUrlId() === getAjaxId(_url)) {
            const jRes = JSON.parse(this.responseText);
            // 发送自定义事件给content.js
            var event = new CustomEvent("PassToContent", {
              detail: { data: jRes, url: _url, id: getUrlId() },
            });
            window.dispatchEvent(event);
          }
        } catch (e) {
          console.error("响应解析错误:", e);
        }
      }
    });
    return send.apply(this, arguments as any);
  };

  // 获取浏览器上URL的接口id
  const getUrlId = function () {
    const pathArr = window.location.href.split("/");
    const id = pathArr[pathArr.length - 1];
    return id;
  };

  // 获取ajax请求的id
  const getAjaxId = function (url: string) {
    const id = url.split("?id=")[1];
    return id;
  };
}

const isYAPIPage = () => {
  return window.location.hostname.includes("yapi");
};

if (isYAPIPage()) {
  injectScript();
}
