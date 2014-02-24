/* jshint undef: true, unused: true, browser: true, moz: true */
/* global console, Instruction, Symbol, LabelReference, LabelDeclaration, StringConstant, Constant, Database, Organization, Equivalence, Comment, Invalid */
/* environment browser */

function Proc() {
  this.instructions = [];
  this.symbols = [];
  this.labelDeclarations = [];
  this.equDeclarations = {};

  this.loopRegex = /(\w+):/;
  this.docUrl = "http://google.com/#q=%s";
  this.whiteSpaceRegex = /([ ,]+|\n)/;
  this.organizationSpecifier = ".org";
  this.equivalenceSpecifier = ".equ";
  this.databaseSpecifier = ".db";
  this.stringConstantRegex = /['"]([^'"]+)['"]/;
  this.commentStart = ";";
}

Proc.prototype.addInstruction = function(name, description) {
  this.instructions.push(new Instruction(name, description));
};

Proc.prototype.addSymbol = function(name, address, description, width) {
  this.symbols.push(new Symbol(name, description, address, width));
};

Proc.prototype.addLabelDeclaration = function(name) {
  if(this.getLabelDeclarationByName(name)) return;
  this.labelDeclarations.push(new LabelDeclaration(name));
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

Proc.prototype.clearDeclarations = function() {
  this.labelDeclarations = [];
  this.equDeclarations = {};
};

Proc.prototype.getLabelDeclarationByName = function(name) {
  for(var i = 0, len = this.labelDeclarations.length; i < len; i++) {
    var labelDecl = this.labelDeclarations[i];
    if(labelDecl.name === name)
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
    return new LabelReference(labelDecl.name);
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
  return new Constant(this.parseConstant(matches[1]));
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

Proc.prototype.getOrganization = function() {
  return new Organization();
};

Proc.prototype.isDatabase = function(token) {
  return token === this.databaseSpecifier;
};

Proc.prototype.getDatabase = function() {
  return new Database();
};

Proc.prototype.isEquivalence = function(token) {
  return token === this.equivalenceSpecifier;
};

Proc.prototype.getEquivalence = function() {
  return new Equivalence();
};

Proc.prototype.isStringConstant = function(token) {
  return this.stringConstantRegex.test(token);
};

Proc.prototype.getStringConstant = function(token) {
  var matches = token.match(this.stringConstantRegex);
  if(matches.length < 2) {
    throw new Error(token+" is not a valid string constant");
  }
  return new StringConstant(matches[1]);
};


Proc.prototype.getComment = function() {
  return new Comment();
};

Proc.prototype.getToken = function(token) {
  var instr = this.getInstructionByName(token);
  if(instr) return instr;

  if(this.isLabelDeclaration(token)) {
    return this.getLabelDeclaration(token);
  }

  var labelRef = this.getLabelReference(token);
  if(labelRef) return labelRef;

  if(this.isSymbol(token)) {
    return this.getSymbol(token); // "symbol" like P1 or DPTR
  }

  if(this.isConstant(token)) {
    return this.getConstant(token);
  }

  if(this.isOrganization(token)) {
    return this.getOrganization(token);
  }

  if(this.isDatabase(token)) {
    return this.getDatabase(token);
  }

  if(this.isEquivalence(token)) {
    return this.getEquivalence(token);
  }

  if(this.isStringConstant(token)) {
    return this.getStringConstant(token);
  }

  return new Invalid();
};

Proc.prototype.getTokenPairs = function(line) {
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
    return {text: part, token: self.getToken(part)};
  });
  if(commentString.length > 0) {
    tokens.push({text: commentString, token: this.getComment(commentString)});
  }
  return tokens;
};

Proc.prototype.getTokenPairsByLine = function(text) {
  var lines = text.split("\n");
  var tokenPairsByLine = new Array(lines);

  // clear all existing declarations of equ's and labels
  this.clearDeclarations();

  var line, lineIndex;
  // pass one, getting declarations and anything that doesn't depend on them
  for(lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    line = lines[lineIndex];
    tokenPairsByLine[lineIndex] = this.getTokenPairs(line);
  }

  // pass two, expanding everything
  for(lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    line = lines[lineIndex];
    var allGood = true;
    var tokenPairs = tokenPairsByLine[lineIndex];
    for(var tokenIndex = 0; tokenIndex < tokenPairs.length; tokenIndex++) {
      if(!tokenPairs[tokenIndex].token.isValid()) {
        allGood = false;
        break;
      }
    }
    if(allGood) continue;
    tokenPairsByLine[lineIndex] = this.getTokenPairs(line);
  }

  return tokenPairsByLine;
};

