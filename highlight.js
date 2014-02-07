// stuff

var proc = new Proc8051();
var editor = document.getElementById("editor");

var operationQueue = [];
var traversing = false;

var classType = {};
classType[Proc.INSTRUCTION] = "ins";
classType[Proc.SYMBOL] = "sym";
classType[Proc.CONSTANT] = "con";
classType[Proc.LABEL] = "lbl";
classType[Proc.INVALID] = "";

function classFromType(type) {
  return classType[type];
}

function typeFromClass(cls) {
  for(var type in classType) {
    if(cls === classType[type])
      return type;
  }
  throw new Error(cls+" is not a class");
}

//function onKeyUp(evt) {
//  if(evt.keyCode === 0x0D) {
//    var range = window.getSelection().getRangeAt(0);
//    var rangeContainer = window.getSelection().focusNode;
//    //var rangeContainer = range.startContainer || range.endContainer;
//    //console.log(rangeContainer);
//    if(rangeContainer.nodeType === 3) {
//      rangeContainer = rangeContainer.parentNode;
//    }
//    if(rangeContainer != editor) {
//      var newBreak = document.createElement("br");
//      editor.insertBefore(newBreak, rangeContainer.nextSibling);
//      range.setStartAfter(newBreak);
//      evt.preventDefault();
//    }
//  }
//  setTimeout(updateTextArea, 50); //eh
//}


function updateTextArea() {
  editor.normalize();
  var childNodes = editor.childNodes;
  traversing = true;
  for(var i = 0; i < childNodes.length; i++) {
    var node = childNodes[i];
    if(node.nodeType === node.TEXT_NODE) {
      //console.log("wt: "+node.wholeText);
      var tokens = node.textContent.split(proc.whiteSpaceRegex);
      //console.log("TEXT_TOKS: "+tokens.toSource());
      var needReplacing = false;
      for(var token of tokens) {
        var procTok = proc.getToken(token);
        if(procTok.type !== Proc.INVALID) {
          needReplacing = true;
          break;
        }
      }

      if(needReplacing) {
        //console.log("scheduling replace!");
        scheduleReplace(node, makeHtmlForTokens(tokens));
        //makeReplaceOperation(node, makeHtmlForTokens(tokens))();
      }
    } else if(node.nodeType === node.ELEMENT_NODE) {
      var currentClass = node.classList[0] || "";
      var nextSib = childNodes[i+1];
      if(nextSib && nextSib.nodeType == node.TEXT_NODE) {
        if(!proc.whiteSpaceRegex.test(nextSib.textContent)) {
          node.textContent += nextSib.textContent;
          editor.removeChild(nextSib); //so likely to explode
        }
      }
      var tokens = node.textContent.split(proc.whiteSpaceRegex);
      var type = typeFromClass(currentClass);

      var valid = true;
      for(var token of tokens) {
        var procTok = proc.getToken(token);
        if(procTok.type != type) {
          console.log("type is "+type+" not "+procTok.type);
          valid = false;
          break;
        }
      }

      if(!valid) {
        console.log("scheduling replace!");
        scheduleReplace(node, makeHtmlForTokens(tokens));
        //makeReplaceOperation(node, makeHtmlForTokens(tokens))();
      }
    }
  }
  traversing = false;
  //TODO thread
  processOutstanding();

}

function makeReplaceOperation(node, fragment) {
  return function() {
    console.log("replacing!");
    console.log(node);
    console.log(fragment);

    editor.insertBefore(fragment, node);
    editor.removeChild(node);
  };
}

function scheduleReplace(node, elements) {
  operationQueue.push(makeReplaceOperation(node, elements));
}

function makeHtmlForTokens(tokens) {
  var elementsFrag = document.createDocumentFragment();
  for(var token of tokens) {
    console.log("parsing {{"+token+"}}");
    var procTok = proc.getToken(token);
    if(procTok.type === Proc.INVALID) {
      var elt = document.createTextNode(token);
      if(token == "\n") {
        //console.log("newlining");
        elt = document.createElement("br");
      }

      elementsFrag.appendChild(elt);
      console.log("text from "+procTok.type+" "+token);
    } else {
      var cls = classFromType(procTok.type);
      var span = document.createElement("span");
      span.classList.add(cls);
      console.log("span class="+cls+" from "+procTok.type+" "+token);
      span.textContent = token;
      span.title = procTok.description;
      elementsFrag.appendChild(span);
    }
  }
  return elementsFrag;
}

function processOutstanding() {
  if(traversing) return;
  if(operationQueue.length === 0) return;
  var operation;
  while(operation = operationQueue.shift()) {
    operation();
  }
  requestAnimationFrame(processOutstanding);
}

processOutstanding();

document.addEventListener("keyup", updateTextArea, false);
