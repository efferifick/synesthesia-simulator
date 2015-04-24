require("sdk/tabs").on("ready", logURL);

function logURL(tab) {
  console.log(tab.url)
}
