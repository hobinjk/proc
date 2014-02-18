/**
 * EWDisplayer
 * Displays Errors and Warnings
 */

/* jshint undef: true, unused: true, browser: true, moz: true */
/* environment browser */

function EWDisplayer(editor) {
  this.editor = editor;
  this.proc = editor.proc;
  this.container = document.getElementById("ew-container");

  var self = this;
  this.editor.attachChangeListener(function(text) {
    self.onChange(text);
  });
}

EWDisplayer.prototype.makeError = function(errorText) {
  var errorSpan = document.createElement("span");
  errorSpan.classList.add("ew-error");
  errorSpan.textContent = errorText;
  return errorSpan;
};

EWDisplayer.prototype.makeDownloadLink = function(hex) {
  var downloadLink = document.createElement("a");
  downloadLink.classList.add("download-link");
  downloadLink.href = window.URL.createObjectURL(new Blob([hex], {type: "text/plain"}));
  downloadLink.textContent = "download hex";
  return downloadLink;
};


EWDisplayer.prototype.onChange = function(text) {
  var assemblyResults = this.proc.generateAssembly(text);
  var errors = assemblyResults.errors;
  var warnings = assemblyResults.warnings;
  var lines = [];

  if(errors.length > 0 || warnings.length > 0) {
    for(var i = 0; i < errors.length; i++) {
      var error = errors[i];
      if(!lines[error.line]) {
        lines[error.line] = [];
      }

      lines[error.line].push(this.makeError(error.text));
    }
  } else {
    lines[0] = [this.makeDownloadLink(assemblyResults.hex)];
  }

  var containerFragment = document.createDocumentFragment();
  for(var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    var lineParts = lines[lineIndex];
    if(lineParts && (lineParts.length > 0)) {
      for(var partIndex = 0; partIndex < lineParts.length; partIndex++) {
        containerFragment.appendChild(lineParts[partIndex]);
      }
    }
    containerFragment.appendChild(document.createElement("br"));
  }

  this.container.innerHTML = "";
  this.container.appendChild(containerFragment);
};

