(() => {
  // scripts/content.js
  console.log("Get Links script loaded!");
  var href = document.querySelectorAll("a");
  function sendMessage(item) {
    if (!item.href.trim().includes("google")) {
      port.postMessage({ link: item.href.trim() });
      console.log(item.href.trim());
      console.log("message sent");
    }
  }
  if (href) {
    port = chrome.runtime.connect({ name: "links" });
    href.forEach(sendMessage);
    (async () => {
      const response = await chrome.runtime.sendMessage({ msg: "all links sent" });
      if (response.resp == "ok") {
        port.disconnect();
        console.log("Port Disconnected");
      }
    })();
  }
  var port;
})();
