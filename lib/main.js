require("sdk/tabs").on("ready", runScript);

function runScript(tab) {
  tab.attach({
    contentScript: "if (document.body) document.body.style.border = '5px solid red';"
  });
}
