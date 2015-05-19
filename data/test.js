function mustIgnore(str) {
  return str == null || str.match(/^\s*$/) !== null;
}

function addClassToElement(element, theClass) {
  element.className = theClass;
}

function wrapEachCharacter(textNode, tag) {
  var text = textNode.nodeValue;
  var parent = textNode.parentNode;
  
  var characters = text.split('');
  var wrapped = document.createElement("span");
  wrapped.style.display="inline";
  addClassToElement(wrapped, "synsim");
  characters.forEach( function(character) {
    var element = document.createElement(tag);
    element.style.display="inline";
    var code = character.charCodeAt(0).toString(16);
    addClassToElement(element, "x" + code);
    var characterNode = document.createTextNode(character);
    element.appendChild(characterNode);
    wrapped.appendChild(element);
  });

  parent.replaceChild(wrapped, textNode);

}

function walkElementNode(root) {

var walker = document.createTreeWalker(root, 
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
walker.nextNode();
var old = walker.currentNode;
var current = walker.currentNode;

while (walker.nextNode()) {
  current = walker.currentNode
  if (old.parentElement.tagName.toUpperCase() === "SCRIPT"
    || old.parentElement.tagName.toUpperCase() === "NOSCRIPT") {
    old = current;
    continue;
  }
  if (mustIgnore(old.textContent)) {
    old = current;
    continue;
  }
  wrapEachCharacter(old, "span");
  old = current;
  }
}

var root = document.getElementsByTagName("body")[0];
walkElementNode(root);

var target = document.body;

//create an observer
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {

    if (mutation.addedNodes.length === 0)
      return false;

    for (var i = 0; i < mutation.addedNodes.length; i++) {
      if (mutation.addedNodes[i].nodeType === 1)
        walkElementNode(mutation.addedNodes[i]);
      else if (mutation.addedNodes[i].nodeType === 3)
        wrapEachCharacter(mutation.addedNodes[i].nodeType, "span");
    }
  });
});

var config = { attributes: true, childList: true, characterData: true,
subtree: true };

observer.observe(target, config);
