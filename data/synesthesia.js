function isNodeColorable(aNode) {
  if (aNode.parentElement.tagName.toUpperCase() == "SCRIPT"
      || aNode.parentElement.tagName.toUpperCase() == "NOSCRIPT" ) {
    return NodeFilter.FILTER_REJECT;
  } else if (aNode.textContent == null || aNode.textContent.match(/^\s*$/) != null) {
    return NodeFilter.FILTER_REJECT;
  } else {
    return NodeFilter.FILTER_ACCEPT;
  }
}

function colorNode(oldNode) {
  // aNode is guaranteed to be a text node by our filter.
  var parent = oldNode.parentNode;
  var characters = oldNode.nodeValue.split('');
  var newNode = document.createElement("span")
  newNode.className = 'synsim';
  newNode.style.display="inline";

  characters.forEach( function(character) {
    var className = 'x' + character.charCodeAt(0).toString(16);
    var characterElement = document.createElement('span')
    characterElement.className = className;
    var characterNode = document.createTextNode(character);
    characterElement.appendChild(characterNode);
    newNode.appendChild(characterElement);
  });

  parent.replaceChild(newNode, oldNode);
}

function colorTree(element) {
  var filter = { acceptNode: isNodeColorable };
  var treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, filter, false);
  //we cannot change the node in which we are walking.
  //we need to walk the tree at least once to get a current node.
  treeWalker.nextNode();
  var oldNode = treeWalker.currentNode;
  while (treeWalker.nextNode()) {
    var currentNode = treeWalker.currentNode;
    colorNode(oldNode);
    oldNode = currentNode;
  }
}

function colorAJAX(changes) {
  changes.forEach( function(change) {
      for (var i = 0; i < change.addedNodes.length; i++) {
        if (change.addedNodes[i].nodeType == Node.ELEMENT_NODE)
          colorTree(change.addedNodes[i]);
        else if (change.addedNodes[i].nodeType == Node.TEXT_NODE)
          colorNode(change.addedNodes[i]);
      }
    });
}


function colorPage() {
  colorTree(document.body);
  var paintor = new MutationObserver(colorAJAX);
  var config = { attributes: true,
               childList: true,
               characterData: true,
               subtree: true };

  paintor.observe(document.body, config);
}

colorPage();
