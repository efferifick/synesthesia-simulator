var self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var pageMod = require("sdk/page-mod");
var ss = require("sdk/simple-storage");

// setup the ui
var button = buttons.ActionButton({
  id: 'config',
  label: 'Configuration',
  icon: {
    "16": self.data.url('./icon-16.png'),
    "32": self.data.url('./icon-16.png'),
    "64": self.data.url('./icon-16.png'),
  },
  onClick: openConfig
});

function setCSS() {
  console.log("setting the css");
  if (!ss.storage.css) {
    console.log('setting with css file');
    pageMod.PageMod({
      include: "*",
      contentScriptFile: self.data.url("synesthesia.js"),
      contentStyleFile: self.data.url("synesthesia.css"),
    });
  } else {
    console.log('setting with ss.storage.css');
    pageMod.PageMod({
      include: "*",
      contentScriptFile: self.data.url("synesthesia.js"),
      contentStyle: ss.storage.css
    });
  }
}

setCSS();

function openConfig(state) {
  console.log('opening configuration page.')
  tabs.open({
    url: self.data.url("config.html"),
    onLoad: function onLoad(tab) {
      console.log('configuration page open')
      var worker = tab.attach({
        contentScriptFile : self.data.url("content-script.js")
      });
      worker.port.on("log", function(message) {
        console.log(message);
      })
      worker.port.on("updateCSS", function(message) {
        console.log("worker received message to update css");
        ss.storage.css = message;
        setCSS();
      });
    }
  });
}
