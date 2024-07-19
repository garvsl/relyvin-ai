const { ipcRenderer } = require("electron");
const fs = require("fs");

(async () => {
  const watcher = fs.watch("./index.html");
  watcher.on("change", (event, filename) => {
    if (event === "change") {
      ipcRenderer.send("re-render");
    }
  });
})();
