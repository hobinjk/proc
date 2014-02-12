function Proc() {
  this.instructions = [];
  this.symbols = [];
  this.labelDeclarations = [];
  this.loopRegex = /(\w+):/;
  this.docUrl = "http://google.com/#q=%s";
  this.whiteSpaceRegex = /([ ,\xa0]+|\n)/;
  this.organizationSpecifier = ".org";
  this.commentStart = ";";
}

Proc.INVALID = -1;
Proc.INSTRUCTION = 0;
Proc.LABEL_DECLARATION = 1;
Proc.LABEL = 2;
Proc.CONSTANT = 3;
Proc.SYMBOL = 4;
Proc.ORGANIZATION = 5;
Proc.COMMENT = 6;

Proc.prototype.addInstruction = function(name, description) {
  this.instructions.push({name: name.toLowerCase(), description: description, type: Proc.INSTRUCTION});
};

Proc.prototype.addSymbol = function(name, address, description, width) {
  this.symbols.push({name: name.toLowerCase(), address: address, description: description, type: Proc.SYMBOL, width: width});
};

Proc.prototype.addLabelDeclaration = function(name) {
  if(this.getLabelDeclarationByName(name)) return;
  this.labelDeclarations.push({name: name.toLowerCase(), type: Proc.LABEL_DECLARATION});
};

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

Proc.prototype.getLabelDeclarationByName = function(name) {
  for(var i = 0, len = this.labelDeclarations.length; i < len; i++) {
    var labelDecl = this.labelDeclarations[i];
    if(labelDecl.name === token)
      return labelDecl;
  }
  return null;
};

Proc.prototype.isLabelDeclaration = function(token) {
  return this.loopRegex.test(token);
};

Proc.prototype.getLabelReference = function(token) {
  var labelDecl = this.getLabelDeclarationByName(token);
  if(labelDecl) {
    return {name: labelDecl.name, type: Proc.LABEL_REFERENCE};
  }
  return null;
};

Proc.prototype.getLabelDeclaration = function(token) {
  var matches = token.match(this.loopRegex);
  if(matches.length < 2) throw new Error("Token \""+token+"\" has no label");
  var name = matches[1];
  var currentDecl = this.getLabelDeclarationByName(name);
  if(currentDecl) return currentDecl;
  console.log("warning: creating new label for \""+name+"\"");
  this.addLabelDeclaration(name);
  return this.getLabelDeclarationByName(name);
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
  return this.getSymbol(token) !== null;
};

Proc.prototype.getSymbol = function(token) {
  var ltoken = token.toLowerCase();
  for(var i = 0; i < this.symbols.length; i++) {
    if(this.symbols[i].name === ltoken) {
      return this.symbols[i];
    }
  }
  return null;
};

Proc.prototype.getSymbolAddress = function(token) {
  return this.getSymbol(token).address;
};

Proc.prototype.isOrganization = function(token) {
  return token === this.organizationSpecifier;
};

Proc.prototype.getOrganization = function(token) {
  return {type: Proc.ORGANIZATION};
};

Proc.prototype.getToken = function(token) {
  var instr = this.getInstructionByName(token);
  if(instr) return instr;

  if(this.isLabelDeclaration(token)) {
    return this.getLabelDeclaration(token);
  }

  var labelRef = this.getLabelReference(token);
  if(labelRef) return labelRef;

  if(this.isConstant(token)) {
    return this.getConstant(token);
  }

  if(this.isSymbol(token)) {
    return this.getSymbol(token); // "symbol" like P1 or DPTR
  }

  if(this.isOrganization(token)) {
    return this.getOrganization(token);
  }

  return {type: Proc.INVALID};
};

Proc.prototype.getTokens = function(line) {
  var commentSplit = line.split(this.commentStart);
  var statement = commentSplit[0];
  var commentString = "";

  if(commentSplit.length > 1) {
    // comments can contain comment start, must limit
    commentString = this.commentStart+commentSplit.slice(1).join(this.commentStart);
  }
  var statementParts = statement.split(this.whiteSpaceRegex);
  var self = this;
  var tokens = statementParts.map(function(part) {
    return self.getToken(part);
  });
  if(commentString.length > 0) {
    tokens.push(this.getComment(commentString));
  }
  return tokens;
};
