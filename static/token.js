/* jshint undef: true, unused: true, browser: true, moz: true */
/* environment browser */

function Token(type, name, description) {
  this.type = type;
  this.name = name;
  this.description = description;
}

Token.prototype.getByteRepresentation = function() {
  throw new Error("Token has no meaningful byte representation");
};

Token.prototype.isValid = function() {
  return true;
};

Token.INVALID = -1;
Token.INSTRUCTION = 0;
Token.LABEL_DECLARATION = 1;
Token.LABEL_REFERENCE = 2;
Token.CONSTANT = 3;
Token.SYMBOL = 4;
Token.ORGANIZATION = 5;
Token.COMMENT = 6;
Token.EQUIVALENCE = 7;
Token.DATABASE = 8;
Token.STRING_CONSTANT = 9;

function Invalid() {
  Token.call(this, Token.INVALID, "invalid token", "invalid token");
}

Invalid.prototype = Object.create(Token.prototype);
Invalid.prototype.isValid = function() {
  return false;
};

function Instruction(name, description) {
  Token.call(this, Token.INSTRUCTION, name.toLowerCase(), description);
}

Instruction.prototype = Object.create(Token.prototype);

function LabelDeclaration(name) {
  Token.call(this, Token.LABEL_DECLARATION, name, "label declaration");
}

LabelDeclaration.prototype = Object.create(Token.prototype);

function LabelReference(name) {
  Token.call(this, Token.LABEL_REFERENCE, name, "label reference");
}

LabelReference.prototype = Object.create(Token.prototype);

function Constant(value) {
  Token.call(this, Token.CONSTANT, value.toString(), "constant");
  this.value = value;
}

Constant.prototype = Object.create(Token.prototype);

Constant.prototype.getByteRepresentation = function() {
  if(this.value > 255 || this.value < -128) {
    throw new Error("Constant out of range for byte representation");
  }
  return [this.value & 0xff];
};

function Symbol(name, description, address, width) {
  Token.call(this, Token.SYMBOL, name.toLowerCase(), description);
  this.address = address;
  this.width = width;
}

Symbol.prototype = Object.create(Token.prototype);
Symbol.prototype.getByteRepresentation = function() {
  if(this.address < 0) {
    throw new Error("Symbol "+this.name+" is not addressable");
  }
  return [this.address];
};

function Organization() {
  Token.call(this, Token.ORGANIZATION, "organization specifier", "organization specifier");
}

Organization.prototype = Object.create(Token.prototype);

function Comment() {
  Token.call(this, Token.COMMENT, "comment", "comment");
}

Comment.prototype = Object.create(Token.prototype);

Comment.prototype.isValid = function() {
  return false;
};

function Equivalence() {
  Token.call(this, Token.EQUIVALENCE, "equivalence", "define equivalence");
}

Equivalence.prototype = Object.create(Token.prototype);

function Database() {
  Token.call(this, Token.DATABASE, "database", "insert data");
}

Database.prototype = Object.create(Token.prototype);

function StringConstant(value) {
  Token.call(this, Token.STRING_CONSTANT, "string", "string constant");
  this.value = value;
}

StringConstant.prototype = Object.create(Token.prototype);

StringConstant.prototype.getByteRepresentation = function() {
  var bytes = new Array(this.value.length);
  for(var i = 0; i < this.value.length; i++) {
    bytes[i] = this.value.charCodeAt(i);
  }
  return bytes;
};

