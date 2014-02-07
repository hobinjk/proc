function Proc() {
  this.instructions = [];
  this.symbols = [];
  this.loopRegex = /(\w+):/;
  this.docUrl = "http://google.com/#q=%s";
  this.whiteSpaceRegex = /([ ,\xa0]+|\n)/g
}

Proc.INVALID = -1;
Proc.INSTRUCTION = 0;
Proc.LABEL = 1;
Proc.CONSTANT = 2;
Proc.SYMBOL = 3;

Proc.prototype.addInstruction = function(name, argc, description) {
  this.instructions.push({name: name.toLowerCase(), argc: argc, description: description, type: Proc.INSTRUCTION});
}

Proc.prototype.addSymbol = function(name, address, description) {
  this.symbols.push({name: name.toLowerCase(), address: address, description: description, type: Proc.SYMBOL});
}

Proc.prototype.getInstructionByName = function(name) {
  var lname = name.toLowerCase();
  for(var i = 0, len = this.instructions.length; i < len; i++) {
    var instr = this.instructions[i];
    if(instr.name == lname) {
      return instr;
    }
  }
  return null;
};

Proc.prototype.getDescription = function(name) {
  var instr = this.getInstructionByName(name);
  if(instr)
    return instr.description;
  return "there is no help for you here";
};

Proc.prototype.isLabel = function(token) {
  return this.loopRegex.test(token);
};

Proc.prototype.getLabel = function(token) {
  var matches = token.match(this.loopRegex);
  if(matches.length < 2) throw new Error("Token \""+token+"\" has no label");
  return {label: matches[1], type: Proc.LABEL};
};

Proc.prototype.isConstant = function(token) {
  return this.constantRegex.test(token);
};

Proc.prototype.getConstant = function(token) {
  var matches = token.match(this.constantRegex);
  if(matches.length < 2) throw new Error("Token \""+token+"\" is not a constant");
  return {value: this.parseConstant(matches[1]), type: Proc.CONSTANT};
};

Proc.prototype.parseConstant = function(constant) {
  return parseInt(constant);
};

Proc.prototype.isSymbol = function(token) {
  return this.getSymbol(token) != null;
};

Proc.prototype.getSymbol = function(token) {
  for(var i = 0; i < this.symbols.length; i++) {
    if(this.symbols[i].name === token) {
      return this.symbols[i];
    }
  }
  return null;
};

Proc.prototype.getSymbolAddress = function(token) {
  return this.getSymbol(token).address;
};

Proc.prototype.getToken = function(token) {
  var instr = this.getInstructionByName(token);
  if(instr) return instr;

  if(this.isLabel(token)) {
    return this.getLabel(token);
  }

  if(this.isConstant(token)) {
    return this.getConstant(token);
  }

  if(this.isSymbol(token)) {
    return this.getSymbol(token); // "symbol" like P1 or DPTR
  }

  return {type: Proc.INVALID};
};

