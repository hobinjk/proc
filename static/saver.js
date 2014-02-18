/**
 * Saver
 * Auto-saves every few seconds by POSTing to the backend
 * Uses editor onchange
 */

/* jshint undef: true, unused: true, browser: true, moz: true */
/* environment browser */

function Saver(editor) {
  this.editor = editor;
  var self = this;
  editor.attachChangeListener(function(text) {
    self.onChange(text);
  });
  this.timeoutId = 0;
  this.timeoutDuration = 5000; // save after five seconds of idle time
  this.statusSpan = document.getElementById("saver-status");
}

Saver.prototype.setStatus = function(status) {
  this.statusSpan.textContent = status;
};

Saver.prototype.onChange = function(text) {
  var self = this;
  window.clearTimeout(this.timeoutId);

  this.setStatus("waiting");
  this.timeoutId = window.setTimeout(function() {
    self.setStatus("saving");

    var request = new XMLHttpRequest();
    var formData = new FormData();
    formData.append("text", text);

    request.open("POST", window.location, true);

    request.onload = function() {
      if(request.status === 200) {
        self.setStatus("saved");
      } else {
        self.setStatus("error: "+request.status);
      }
    };
    request.send(formData);
  }, this.timeoutDuration);
};
