export class TreeNode {
  constructor(value) {
    this.value = value;
    this.sibling = null;
    this.child = null;
    this.visited = false;
  }
}

function bfs(head, name) {
  // seraches for node.value of given name in breadth of given head
  // returns node if node.value == name or last node
  while (head.sibling != null) {
    if (head.value == name) {
      return head
    } else {
      head = head.sibling
    }
  }
  return head
}

export function merge(head, parent) {
  // check if current branch contains parent
  // else apply merge for next child in head and parent
  let local_head = bfs(head, parent.value) 
  if (local_head.value == parent.value) {
    if (parent.child != null) {
      if (local_head.child != null) {
        merge(local_head.child, parent.child)
      } else {
        local_head.child = parent.child
      }
    }
  } else {
    local_head.sibling = parent
  }
}

export function print_level(head) {
  // print following bfs
  if (head != null) {
    let next_level = [];
    while (head.sibling != null) {
      // print value
      console.log(head.value);

      // check for child
      if (head.child != null) {
        next_level.push(head.child);
      }

      //move to next
      head = head.sibling;
    }

    //repeat for last
    console.log(head.value);
    if (head.child != null) {
      next_level.push(head.child);
    }

    next_level.forEach(print_level);
  }
}

function open(item) {
  // create new chrome tab with given link(item)
  chrome.tabs.create({
    url: item 
  });
}

export function print_leafs(head, prev) {
  // prints prev + head.value if last node
  // or recisrively call function again where, prev += head.value
  if (head != null) {
    print_leafs(head.sibling, prev)

    if (head.value == "https://") {
      prev = "https://"
    } else if (head.value != "") {
      prev = prev + "/" + head.value
    }

    print_leafs(head.child, prev)
    // check if node has been visited
    if (!head.visited) {
      console.log(prev)
      open(prev)
      head.visited = true
    }
  }
}
