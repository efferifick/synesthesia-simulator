function uploadUserCSS() {
  self.port.emit('log', 'user has changed css file')
  var file = this.files[0];
  var reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = function(evt) { self.port.emit('updateCSS', evt.target.result);};
  reader.onerror = function(evt) { self.port.emit('log', 'failed to read css file') };
}

self.port.emit('log', 'script file loaded properly');
var cssfile = document.getElementById('cssfile');
cssfile.addEventListener('change', uploadUserCSS, false);
