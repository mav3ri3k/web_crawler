Simple web crawler which indexes web-links on a webpage and then recrsively does the same on web-links obtanined. These weblinks are then stored as a binary tree (left child, right sibling) where each subdomain, top-level domain, second-level domain and subsequent subdirectories of a link are stored as subsequent nodes. The websites to recrsively crawl is controlled through `matches` in `manifest.json`

Each node is of format 
```js
class TreeNode {
  constructor(value) {
    this.value = value; // string value of domain
    this.sibling = null; // right sibling
    this.child = null; // left child
    this.visited = false; // true only when the page accessible throught the link has been scraped
  }
}
```

The code is stored in ./scripts
```
scripts
|- content.js // handles extracting links from webpage, which are sent to main.js
|- main.js // runs as service script and has main control of the program
|- tree.js // module contains function and class for handling tree of website
```

This is then build using esbuild into service-worker.js and content-scripts.js

```sh 
esbuild ./scripts/content.js --bundle --outfile=content-scripts.js ;
esbuild ./scripts/main.js --bundle --outfile=service-worker.js ;
```

Tree can be seen throught extension inspect view in `chrome://extensions`
