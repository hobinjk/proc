/* jshint undef: true, unused: true, browser: true, moz: true */
/* global Proc8051, Proc, console */
/* environment browser */

function Editor() {
  this.proc = new Proc8051();
  this.editor = document.getElementById("editor");
  this.saveButton = document.getElementById("save");

  this.operationQueue = [];
  this.enabled = false;

  this.classType = {};
  this.classType[Proc.INSTRUCTION] = "ins";
  this.classType[Proc.SYMBOL] = "sym";
  this.classType[Proc.CONSTANT] = "con";
  this.classType[Proc.LABEL_DECLARATION] = "lbl";
  this.classType[Proc.LABEL_REFERENCE] = "lbl";
  this.classType[Proc.ORGANIZATION] = "org";
  this.classType[Proc.COMMENT] = "cmt";
  this.classType[Proc.INVALID] = "inv";

  this.editor.addEventListener("input", this.handleInput.bind(this), false);
  this.editor.addEventListener("keydown", this.handleKeyDown.bind(this), false);
  this.saveButton.addEventListener("click", this.saveCurrentFile.bind(this), false);
  this.loadCurrentFile();
  this.processOutstanding();

  this.scheduledFragment = document.createDocumentFragment();
  this.scheduledFragment.innerHTML = this.editor.innerHTML;
}

Editor.prototype.classFromType = function(type) {
  return this.classType[type];
};

Editor.prototype.typeFromClass = function(cls) {
  for(var type in this.classType) {
    if(cls === this.classType[type])
      return type;
  }
  throw new Error(cls+" is not a class");
};

Editor.prototype.isInvisibleKeyEvent = function(evt) {
  if(evt.key === "Left") return true;
  if(evt.key === "Right") return true;
  if(evt.key === "Up") return true;
  if(evt.key === "Down") return true;

  if(evt.keyCode === 0x25) return true;
  if(evt.keyCode === 0x26) return true;
  if(evt.keyCode === 0x27) return true;
  if(evt.keyCode === 0x28) return true;

  return false;
};

Editor.prototype.isTabKey = function(evt) {
  return evt.key === "Tab" || evt.keyCode === 0x09;
};

Editor.prototype.handleTabKey = function(evt) {
  evt.preventDefault();

  var sel = window.getSelection();
  var range = sel.getRangeAt(0);
  range.insertNode(document.createTextNode("  "));
  sel.collapseToStart();
};

Editor.prototype.getSelectionTextIndex = function(range) {
  // if the range starts in the editor it is a raw text node and sad
  var offset = 0;
  var targetNode = range.startContainer;
  var targetOffset = range.startOffset;

  // if startContainer is a text node the offset is number of characters
  // otherwise it is the number of child nodes between the start of
  // startContainer and the actual start

  // walk all of the possible text nodes, adding to the source offset as we go
  var treeWalker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
  );

  var node = null;
  while((node = treeWalker.nextNode()) !== null) {
    if(node.nodeType === node.TEXT_NODE) {
      var textContent = node.textContent;
      if(node === targetNode) {
        return offset + targetOffset;
      }
      offset += textContent.length;
    } else if(node.nodeName.toLowerCase() === "br") {
      offset += 1; // br -> \n
    }
  }

  return -1;
};

Editor.prototype.getSelectionRange = function(textIndex) {
  var treeWalker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
  );

  var remainingText = textIndex;
  var node = null;

  while((node = treeWalker.nextNode()) !== null) {
    console.log(node);
    if(node.nodeType === node.TEXT_NODE) {
      var textContent = node.textContent;
      if(textContent.length < remainingText) {
        remainingText -= textContent.length;
        continue;
      } else {
        var range = document.createRange();
        range.setStart(node, remainingText);
        return range;
      }
    } else if(node.nodeName.toLowerCase() === "br") {
     remainingText -= 1;
    }
  }
  return null;
};


Editor.prototype.handleKeyDown = function(evt) {
  if(!this.enabled) {
    evt.preventDefault();
    return;
  }

  if(this.isInvisibleKeyEvent(evt)) {
    return;
  }

  if(this.isTabKey(evt)) {
    this.handleTabKey(evt);
    return;
  }
};

Editor.prototype.handleInput = function() {
  this.setText(this.getText());
};

Editor.prototype.sameElement = function(a, b) {
  return a.nodeName === b.nodeName && a.textContent === b.textContent && a.classList === b.classList;
};

Editor.prototype.setText = function(newText) {
  var childNodes = this.editor.childNodes;
  var fragment = this.getFragmentFromText(newText);
  var newChildNodes = fragment.childNodes;
  var childIndex = 0;

  this.operationQueue = [];

  var range = window.getSelection().getRangeAt(0);
  var selectionTextIndex = this.getSelectionTextIndex(range);
  //var otherRange = this.getSelectionRange(selectionTextIndex);
  //var otherSTI = this.getSelectionTextIndex(otherRange);
  //console.log("sti check 1: "+range+" == "+otherRange+" ("+(range === otherRange)+")");
  //console.log("sti check 2: "+selectionTextIndex+" == "+otherSTI);


  //console.log("want: ");
  //for(var i = 0; i < newChildNodes.length; i++) {
  //  console.log(newChildNodes[i]);
  //}
  //console.log("have");
  //for(i = 0; i < childNodes.length; i++) {
  //  console.log(childNodes[i]);
  //}
  //console.log("so that was a thing");

  for(var newChildIndex = 0; newChildIndex < newChildNodes.length; newChildIndex++) {
    var newChild = newChildNodes[newChildIndex];
    if(childIndex < childNodes.length) {
      var child = childNodes[childIndex];
      if(!this.sameElement(newChild, child)) {
        this.scheduleReplace(child, newChild);
      }
      childIndex++;
    } else {
      this.scheduleAppend(newChild);
    }
  }
  for(; childIndex < childNodes.length; childIndex++) {
    this.scheduleDelete(childNodes[childIndex]);
  }

  this.scheduledFragment.innerHTML = fragment.innerHTML;

  this.scheduleSetSelectionTextIndex(selectionTextIndex);

  // todo thread
  this.processOutstanding();
};

Editor.prototype.makeReplaceOperation = function(node, fragment) {
  var self = this;
  return {
    name: "replace",
    op: function() {
      console.log("replacing!");
      console.log(node);
      console.log(fragment);

      if(fragment) {
        self.editor.insertBefore(fragment, node);
      }
      if(node) {
        self.editor.removeChild(node);
      }
    }
  };
};

Editor.prototype.scheduleReplace = function(node, elements) {
  this.operationQueue.push(this.makeReplaceOperation(node, elements));
};

Editor.prototype.scheduleAppend = function(elements) {
  this.scheduleReplace(null, elements);
};

Editor.prototype.scheduleDelete = function(node) {
  this.scheduleReplace(node, null);
};

Editor.prototype.makeSetSelectionTextIndex = function(textIndex) {
  var self = this;
  return function() {
    var newRange = self.getSelectionRange(textIndex);
    var currentRange = window.getSelection().getRangeAt(0);
    currentRange.setStart(newRange.startContainer, newRange.startOffset);
  };
};

Editor.prototype.scheduleSetSelectionTextIndex = function(textIndex) {
  // remove any existing place operations
  this.operationQueue = this.operationQueue.filter(function(oper) {
    return oper.name !== "place";
  });

  this.operationQueue.push({
    name: "place",
    op: this.makeSetSelectionTextIndex(textIndex)
  });
};

Editor.prototype.processOutstanding = function() {
  if(this.operationQueue.length === 0) return;
  while(this.operationQueue.length > 0) {
    var operation = this.operationQueue.shift();
    operation.op();
  }

  // window.requestAnimationFrame(this.processOutstanding.bind(this));
};

Editor.prototype.loadCurrentFile = function() {
  var loc = ""+window.location;
  loc = loc.replace("files/", "files/get/");

  var request = new XMLHttpRequest();
  var self = this;
  request.onload = function() {
    self.editor.textContent = this.responseText;
    self.enabled = true;
  };
  request.open("get", loc, true);
  request.send();
};

Editor.prototype.getSpanFromToken = function(part, token) {
  var cls = this.classFromType(token.type);
  var span = document.createElement("span");
  span.classList.add(cls);
  console.log("span class="+cls+" from "+token.type+" "+token);
  // unecessary due to white-space pre
  //if(this.proc.whiteSpaceRegex.test(part)) {
  //  span.innerHTML = part.replace(/ /g, "&nbsp;");
  //} else {
  span.textContent = part;
  //}
  if(token.description) {
    span.title = token.description;
  }
  return span;
};

Editor.prototype.getFragmentFromText = function(text) {
  var lines = text.split("\n");
  var fragment = document.createDocumentFragment();
  var self = this;
  function makeSpan(tokenPair) {
    if(tokenPair.text.length === 0) return;
    fragment.appendChild(self.getSpanFromToken(tokenPair.text, tokenPair.token));
  }

  for(var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var tokenPairs = this.proc.getTokenPairs(line);
    tokenPairs.map(makeSpan);
    if(i < lines.length - 1) {
      fragment.appendChild(this.createRealBreak());
    }
  }
  return fragment;
};

Editor.prototype.getTextFromHtml = function(markup) {
  var text = markup;
  //incorrect under white-space pre
  //text = text.replace("\n", "");
  //text = text.replace(" ", "");
  text = text.replace(/<br[^>]*>/g, "\n");
  text = text.replace(/<[^>]+>/g, "");
  //text = text.replace(/&nbsp;/g, " ");

  return text;
};

Editor.prototype.getText = function() {
  var text = this.editor.innerHTML;
  console.log("IHTM: \""+text+"\"");
  text = this.getTextFromHtml(text);
  console.log("TEXT: \""+text+"\"");
  return text;
};

Editor.prototype.saveCurrentFile = function() {
  var text = this.getText();

  var data = new FormData();
  data.append("text", text);
  var request = new XMLHttpRequest();
  request.open("POST", window.location);
  request.send(data);
};

window.editor = new Editor();
