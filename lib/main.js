var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;

pageMod.PageMod({
  include: "*",
  contentScriptFile: data.url("test.js"),
  contentStyleFile: data.url("style.css")
})
