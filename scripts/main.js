import { merge, print_level, print_leafs,  TreeNode } from "./tree.js";

let head = new TreeNode("https://");

function get_names(url) {
  // sperates domain into subdomains at '/'
  url = url.split("//");
  url = url.slice(-1);
  let names = url[0].split("/");
  return names;
}

function addElement(item) {
  // add link to the head
  let names = get_names(item.trim());
  let local_head = new TreeNode("https://")

  let last = local_head
  // create local tree of the url
  // then merge it into the head
  for (let i = 0; i < names.length; i++) {
    last.child = new TreeNode(names[i])
    last = last.child
  }
  merge(head, local_head)
}

function open(item) {
  // create a new chrome tab
  chrome.tabs.create({
    url: item 
  });
}

chrome.runtime.onMessage.addListener(
  // listens for msg to close port
  function(request, sender, sendResponse) {
    if (request.msg == "all links sent") {
      sendResponse({ resp: "ok" });
      //print_level(head);
      let prev = "";
      print_leafs(head, prev);
    }
  }
);

chrome.runtime.onConnect.addListener(function(port) {
  // listens links sent by content-script
  console.assert(port.name === "links");
  console.log("connected")
  port.onMessage.addListener(function(msg) {
    addElement(msg.link)
  });
});

