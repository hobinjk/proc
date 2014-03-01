/**
 * EWDisplayer
 * Displays Errors and Warnings
 */

/* jshint undef: true, unused: true, browser: true, moz: true */
/* global Encoder */
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
  return this.makeSpan("ew-error", errorText);
};

EWDisplayer.prototype.makeWarning = function(text) {
  return this.makeSpan("ew-warning", text);
};

EWDisplayer.prototype.makeListing = function(text) {
  return this.makeSpan("ew-listing", text);
};

EWDisplayer.prototype.makeSpan = function(cls, text) {
  var span = document.createElement("span");
  span.classList.add(cls);
  span.textContent = text;
  return span;
};

EWDisplayer.prototype.makeDownloadLink = function(hex) {
  var downloadLink = document.createElement("a");
  downloadLink.id = "download-link";
  downloadLink.href = window.URL.createObjectURL(new Blob([hex], {type: "text/plain"}));
  downloadLink.textContent = "download hex";
  return downloadLink;
};


EWDisplayer.prototype.onChange = function(text) {
  var assemblyResults = this.proc.generateAssembly(text);
  var errors = assemblyResults.errors;
  var warnings = assemblyResults.warnings;
  var listings = assemblyResults.listings;
  var programBytes = assemblyResults.programBytes;
  var lines = [];
  var lineIndex = 0;

  if((errors.length > 0) || (warnings.length > 0)) {
    for(var i = 0; i < errors.length; i++) {
      var error = errors[i];
      if(!lines[error.line]) {
        lines[error.line] = [];
      }

      lines[error.line].push(this.makeError(error.text));
    }
    for(i = 0; i < warnings.length; i++) {
      var warning = warnings[i];
      if(!lines[warning.line]) {
        lines[warning.line] = [];
      }

      lines[warning.line].push(this.makeWarning(warning.text));
    }
  } else {
    var downloadLink = this.makeDownloadLink(this.proc.generateHex(assemblyResults));
    var currentDownloadLink = document.getElementById(downloadLink.id);
    if(currentDownloadLink && currentDownloadLink.parentNode) {
      currentDownloadLink.parentNode.removeChild(currentDownloadLink);
    }
    document.getElementById("topbar").appendChild(downloadLink);



    for(lineIndex = 0; lineIndex < listings.length; lineIndex++) {
      var listing = listings[lineIndex];
      if(!listing) {
        continue;
      }
      var listingText = "";
      for(var offset = 0; offset < listing.length; offset++) {
        listingText += Encoder.prototype.hex(programBytes[listing.address+offset], 2);
        if(offset < listing.length - 1) {
          listingText += " ";
        }
      }

      lines[lineIndex] = [this.makeListing(listingText)];
    }
  }

  var containerFragment = document.createDocumentFragment();
  for(lineIndex = 0; lineIndex < lines.length; lineIndex++) {
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

