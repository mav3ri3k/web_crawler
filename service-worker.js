(() => {
  // scripts/tree.js
  var TreeNode = class {
    constructor(value) {
      this.value = value;
      this.sibling = null;
      this.child = null;
      this.visited = false;
    }
  };
  function bfs(head2, name) {
    while (head2.sibling != null) {
      if (head2.value == name) {
        return head2;
      } else {
        head2 = head2.sibling;
      }
    }
    return head2;
  }
  function merge(head2, parent) {
    let local_head = bfs(head2, parent.value);
    if (local_head.value == parent.value) {
      if (parent.child != null) {
        if (local_head.child != null) {
          merge(local_head.child, parent.child);
        } else {
          local_head.child = parent.child;
        }
      }
    } else {
      local_head.sibling = parent;
    }
  }
  function open(item) {
    chrome.tabs.create({
      url: item
    });
  }
  function print_leafs(head2, prev) {
    if (head2 != null) {
      print_leafs(head2.sibling, prev);
      if (head2.value == "https://") {
        prev = "https://";
      } else if (head2.value != "") {
        prev = prev + "/" + head2.value;
      }
      print_leafs(head2.child, prev);
      if (!head2.visited) {
        console.log(prev);
        open(prev);
        head2.visited = true;
      }
    }
  }

  // scripts/main.js
  var head = new TreeNode("https://");
  function get_names(url) {
    url = url.split("//");
    url = url.slice(-1);
    let names = url[0].split("/");
    return names;
  }
  function addElement(item) {
    let names = get_names(item.trim());
    let local_head = new TreeNode("https://");
    let last = local_head;
    for (let i = 0; i < names.length; i++) {
      last.child = new TreeNode(names[i]);
      last = last.child;
    }
    merge(head, local_head);
  }
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.msg == "all links sent") {
        sendResponse({ resp: "ok" });
        let prev = "";
        print_leafs(head, prev);
      }
    }
  );
  chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "links");
    console.log("connected");
    port.onMessage.addListener(function(msg) {
      addElement(msg.link);
    });
  });
})();
