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
  this.classType[Proc.INVALID] = "";

  this.editor.addEventListener("input", this.updateTextArea.bind(this), false);
  this.saveButton.addEventListener("click", this.saveCurrentFile.bind(this), false);
  this.loadCurrentFile();
  this.processOutstanding();
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
  console.log("pls implement tab kthx");
  evt.preventDefault();
};


Editor.prototype.updateTextArea = function(evt) {
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

  this.editor.normalize();
  var childNodes = this.editor.childNodes;
  for(var i = 0; i < childNodes.length; i++) {
    var node = childNodes[i];
    console.log(node);
    if(node.nodeType === node.TEXT_NODE) {
      var tokens = node.textContent.split(this.proc.whiteSpaceRegex);
      console.log("TEXT_TOKS: "+tokens.toSource());
      var needReplacing = false;
      for(var token of tokens) {
        var procTok = this.proc.getToken(token);
        if(procTok.type !== Proc.INVALID) {
          needReplacing = true;
          break;
        }
      }

      if(needReplacing) {
        console.log("scheduling replace!");
        this.scheduleReplace(node, this.makeHtmlForTokens(tokens));
      }
    } else if((node.nodeType === node.ELEMENT_NODE) && (node.nodeName !== "BR")) {
      var currentClass = node.classList[0] || "";
      var nextSib = childNodes[i+1];
      if(nextSib && nextSib.nodeType == node.TEXT_NODE) {
        if(!this.proc.whiteSpaceRegex.test(nextSib.textContent)) {
          node.textContent += nextSib.textContent;
          this.editor.removeChild(nextSib); //so likely to explode
        }
      }
      var tokens = node.textContent.split(this.proc.whiteSpaceRegex);
      var type = this.typeFromClass(currentClass);

      var valid = true;
      for(var token of tokens) {
        var procTok = this.proc.getToken(token);
        if(procTok.type != type) {
          console.log("type is "+type+" not "+procTok.type);
          valid = false;
          break;
        }
      }

      if(!valid) {
        console.log("scheduling replace!");
        this.scheduleReplace(node, this.makeHtmlForTokens(tokens));
      }
    }
  }
  //TODO thread
  this.processOutstanding();
};

Editor.prototype.makeReplaceOperation = function(node, fragment) {
  var self = this;
  return function() {
    console.log("replacing!");
    console.log(node);
    console.log(fragment);

    self.editor.insertBefore(fragment, node);
    self.editor.removeChild(node);
  };
};

Editor.prototype.scheduleReplace = function(node, elements) {
  this.operationQueue.push(this.makeReplaceOperation(node, elements));
};

Editor.prototype.makeHtmlForTokens = function(tokens) {
  var elementsFrag = document.createDocumentFragment();
  for(var token of tokens) {
    console.log("parsing {{"+token+"}}");
    var procTok = this.proc.getToken(token);
    if(procTok.type === Proc.INVALID) {
      var elt = document.createTextNode(token);
      if(token == "\n") {
        console.log("newlining");
        elt = document.createElement("br");
      }

      elementsFrag.appendChild(elt);
      console.log("text from "+procTok.type+" \""+token+"\"");
    } else {
      var cls = this.classFromType(procTok.type);
      var span = document.createElement("span");
      span.classList.add(cls);
      console.log("span class="+cls+" from "+procTok.type+" "+token);
      span.textContent = token;
      span.title = procTok.description;
      elementsFrag.appendChild(span);
    }
  }
  return elementsFrag;
};

Editor.prototype.processOutstanding = function() {
  if(this.operationQueue.length === 0) return;
  var operation;
  while((operation = this.operationQueue.shift()) !== null) {
    operation();
  }
  window.requestAnimationFrame(this.processOutstanding.bind(this));
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

Editor.prototype.getText = function() {
  var text = this.editor.innerHTML;
  text = text.replace(/<br\/?>/g, "\n");
  text = text.replace(/<[^>]+>/g, "");
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
