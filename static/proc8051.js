/* jshint undef: true, unused: true, browser: true, moz: true */
/* global Encoder, Token, Proc */
/* environment browser */

function Proc8051() {
  Proc.call(this);
  this.constantRegex = /^#?([0-9a-fA-F]+[hbd]?)$/;
  this.docUrl = "http://www.keil.com/support/man/docs/is51/is51_%s.htm";

  this.addInstruction("acall", "call subroutine at address");
  this.addInstruction("add", "add byte value to accumulator");
  this.addInstruction("addc", "add byte value and carry bit to accumulator");
  this.addInstruction("ajmp", "jump to address");
  this.addInstruction("anl", "bitwise and");
  this.addInstruction("cjne", "compare and jump if not equal");
  this.addInstruction("clr", "clear bit");
  this.addInstruction("cpl", "flip bit");
  this.addInstruction("da", "converts to BCD notation");
  this.addInstruction("dec", "decrement");
  this.addInstruction("div", "divide");
  this.addInstruction("djnz", "decrement and jump if zero");
  this.addInstruction("inc", "increment");
  this.addInstruction("jb", "jump if bit set");
  this.addInstruction("jbc", "jump if bit set, clearing bit");
  this.addInstruction("jc", "jump if carry flag is set");
  this.addInstruction("jmp", "jump by offset");
  this.addInstruction("jnb", "jump if bit unset");
  this.addInstruction("jc", "jump if carry flag is set");
  this.addInstruction("jnc", "jump if carry flag is clear");
  this.addInstruction("jnz", "jump if the accumulator is not zero");
  this.addInstruction("jz", "jump if the accumulator is zero");
  this.addInstruction("lcall", "call subroutine at address");
  this.addInstruction("ljmp", "jump to address");
  this.addInstruction("mov", "move byte");
  this.addInstruction("movc", "move byte from program memory to accumulator");
  this.addInstruction("movx", "move byte from accumulator to program memory");
  this.addInstruction("mul", "multiply accumulator and B register");
  this.addInstruction("nop", "do nothing");
  this.addInstruction("orl", "bitwise or");
  this.addInstruction("pop", "pop byte from stack");
  this.addInstruction("push", "push byte onto stack");
  this.addInstruction("ret", "return from subroutine");
  this.addInstruction("reti", "return from interrupt");
  this.addInstruction("rl", "rotate left");
  this.addInstruction("rlc", "rotate left with carry");
  this.addInstruction("rr", "rotate right");
  this.addInstruction("rlc", "rotate right with carry");
  this.addInstruction("setb", "set bit");
  this.addInstruction("sjmp", "jump by signed offset");
  this.addInstruction("subb", "subtract byte value and carry flag");
  this.addInstruction("swap", "exchange low and high nibbles");
  this.addInstruction("xch", "exchange bytes");
  this.addInstruction("xchd", "exchange low nibbles");
  this.addInstruction("xrl", "bitwise xor");

  var self = this;
  function addBitSymbols(name, startAddr) {
    for(var offset = 0; offset < 8; offset++) {
      var description = name+" bit "+offset;
      for(var i = 0; i < self.symbols.length; i++) {
        var symbol = self.symbols[i];
        if(symbol.address === startAddr + offset) {
          description = symbol.description;
          break;
        }
      }
      self.addSymbol(name+"."+offset, startAddr + offset, description, 1);
    }
  }

  // rewording of the symbol table from as31
  this.addSymbol("P0",   0x80, "port zero", 8);
  //this.addSymbol("T2",    0x80+0, "wat");
  //this.addSymbol("T2EX",  0x80+1, "wat");
  this.addSymbol("SP",   0x81, "stack pointer", 8);
  this.addSymbol("DPTR", 0x82, "data pointer", 16);
  this.addSymbol("DPL",   0x82, "data pointer low", 8);
  this.addSymbol("DPH",   0x83, "data pointer high", 8);
  this.addSymbol("PCON",  0x87, "power control", 8);

  this.addSymbol("TCON",  0x88, "timer one control", 8);
  this.addSymbol("IT0",   0x80+0x08, "interrupt zero type control bit", 1);
  this.addSymbol("IE0",   0x80+0x09, "external interrupt zero edge flag", 1);
  this.addSymbol("IT1",   0x80+0x0A, "interrupt one type control bit", 1);
  this.addSymbol("IE1",   0x80+0x0B, "external interrupt one edge flag", 1);
  this.addSymbol("TR0",   0x80+0x0C, "timer zero run control bit", 1);
  this.addSymbol("TF0",   0x80+0x0D, "timer zero overflow flag", 1);
  this.addSymbol("TR1",   0x80+0x0E, "timer one run control bit", 1);
  this.addSymbol("TF1",   0x80+0x0F, "timer one overflow flag", 1);

  this.addSymbol("TMOD",  0x89, "timer mode control", 8);
  this.addSymbol("TL0",   0x8A, "timer zero low byte", 8);
  this.addSymbol("TL1",   0x8B, "timer one low byte", 8);
  this.addSymbol("TH0",   0x8C, "timer zero high byte", 8);
  this.addSymbol("TH1",   0x8D, "timer one high byte", 8);

  this.addSymbol("P1",    0x90, "port one", 8);

  this.addSymbol("SCON", 0x98, "serial control", 8);
  this.addSymbol("RI",   0x80+3*8+0, "receive interrupt flag", 1);
  this.addSymbol("TI",   0x80+3*8+1, "transmit interrupt flag", 1);
  this.addSymbol("RB8",  0x80+3*8+2, "ninth data bit received or stop bit", 1);
  this.addSymbol("TB8",  0x80+3*8+3, "ninth bit to be transmitted", 1);
  this.addSymbol("REN",  0x80+3*8+4, "reception enable", 1);
  this.addSymbol("SM2",  0x80+3*8+5, "multiprocessor communication enable", 1);
  this.addSymbol("SM1",  0x80+3*8+6, "serial port mode bit", 1);
  this.addSymbol("SM0",  0x80+3*8+7, "serial port mode bit", 1);

  this.addSymbol("SBUF", 0x99, "serial buffer", 8);

  this.addSymbol("P2", 0xA0, "port two", 8);

  this.addSymbol("IE",  0xA8, "interrupt control register", 8);
  this.addSymbol("EX0", 0x80+5*8+0, "external interrupt zero enable", 1);
  this.addSymbol("ET0", 0x80+5*8+1, "timer zero overflow interrupt enable", 1);
  this.addSymbol("EX1", 0x80+5*8+2, "external interrupt one enable", 1);
  this.addSymbol("ET1", 0x80+5*8+3, "timer one overflow interrupt enable", 1);
  this.addSymbol("ES",  0x80+5*8+4, "serial port interrupt enable", 1);
  this.addSymbol("ET2", 0x80+5*8+5, "timer two overflow interrupt enable", 1);
  this.addSymbol("EA",  0x80+5*8+7, "interupt enable", 1);

  this.addSymbol("P3",   0xB0, "port three", 8);
  this.addSymbol("RXD",  0x80+6*8+0, "serial input port", 1);
  this.addSymbol("TXD",  0x80+6*8+1, "serial output port", 1);
  this.addSymbol("INT0", 0x80+6*8+2, "external interrupt zero input", 1);
  this.addSymbol("INT1", 0x80+6*8+3, "external interrupt one input", 1);
  this.addSymbol("T0",   0x80+6*8+4, "timer zero input", 1);
  this.addSymbol("T1",   0x80+6*8+5, "timer one input", 1);
  this.addSymbol("WR",   0x80+6*8+6, "external data write", 1);
  this.addSymbol("RD",   0x80+6*8+7, "external data read", 1);

  this.addSymbol("IP",    0xB8, "interrupt priority control", 8);
  this.addSymbol("PX0",   0x80+7*8+0, "external interrupt zero priority level", 1);
  this.addSymbol("PT0",   0x80+7*8+1, "timer zero interrupt priority level", 1);
  this.addSymbol("PX1",   0x80+7*8+2, "external interrupt one priority level", 1);
  this.addSymbol("PT1",   0x80+7*8+3, "timer one interrupt priority level", 1);
  this.addSymbol("PS",    0x80+7*8+4, "serial port interrupt priority level", 1);
  this.addSymbol("PT2",   0x80+7*8+5, "timer two interrupt priority level", 1);

  // this.addSymbol("T2CON",  0xC8, "timer two control"); 8052 only
  // this.addSymbol("RCAP2L", 0xCA, "wat"); 8052 only
  // this.addSymbol("RCAP2H", 0xCB, "wat"); 8052 only
  // this.addSymbol("TL2",    0xCC, "wat"); 8052 only
  // this.addSymbol("TH2",    0xCC, "wat"); 8052 only
  // this.addSymbol("EXEN2",  0xC8+3, "wat");
  // this.addSymbol("TCLK",   0xC8+4, "wat");
  // this.addSymbol("RCLK",   0xC8+5, "wat");
  // this.addSymbol("EXF2",   0xC8+6, "wat");
  // this.addSymbol("TF2",    0xC8+7, "wat");


  this.addSymbol("PSW",  0xD0, "program status word", 8);
  this.addSymbol("P",    0x80+10*8+0, "accumulator parity flag", 1);
  this.addSymbol("OV",   0x80+10*8+2, "overflow flag", 1);
  this.addSymbol("RS0",  0x80+10*8+3, "register bank select bit 0", 1);
  this.addSymbol("RS1",  0x80+10*8+4, "register bank select bit 1", 1);
  this.addSymbol("F0",   0x80+10*8+5, "general purpose status flag", 1);
  this.addSymbol("AC",   0x80+10*8+6, "auxilary carry flag for addition", 1);
  this.addSymbol("CY",   0x80+10*8+7, "carry flag", 1);
  this.addSymbol("C",    0x80+10*8+7, "carry flag", 1);

  this.addSymbol("ACC",   0xE0, "accumulator", 8);
  this.addSymbol("A",   0xE0, "accumulator", 8);

  this.addSymbol("B",     0xF0, "B register", 8);

  this.addSymbol("R0", 0, "register zero", 8);
  this.addSymbol("R1", 1, "register one", 8);
  this.addSymbol("R2", 2, "register two", 8);
  this.addSymbol("R3", 3, "register three", 8);
  this.addSymbol("R4", 4, "register four", 8);
  this.addSymbol("R5", 5, "register five", 8);
  this.addSymbol("R6", 6, "register six", 8);
  this.addSymbol("R7", 7, "register seven", 8);

  this.addSymbol("@R0", -1, "value pointed to by register zero", 8);
  this.addSymbol("@R1", -1, "value pointed to by register one", 8);
  this.addSymbol("@DPTR", -1, "value pointed to by data pointer", 8);
  this.addSymbol("@A", -1, "value pointed to by register A", 8);
  this.addSymbol("+", -1, "plus", 0);
  this.addSymbol("PC", -1, "program counter", 0);
  this.addSymbol("AB", -1, "A op B", 0);

  addBitSymbols("P0",   0x80+0*8);
  addBitSymbols("TCON", 0x80+1*8);
  addBitSymbols("P1",   0x80+2*8);
  addBitSymbols("SCON", 0x80+3*8);
  addBitSymbols("P2",   0x80+4*8);
  addBitSymbols("IE",   0x80+5*8);
  addBitSymbols("P3",   0x80+6*8);
  addBitSymbols("IP",   0x80+7*8);

  addBitSymbols("PSW",  0x80+10*8);
  addBitSymbols("ACC",  0x80+12*8);
  addBitSymbols("A",    0x80+12*8);
  addBitSymbols("B",    0x80+14*8);

  function makeEqualTest(symbol) {
    return function(testToken) {
      return testToken === symbol;
    };
  }

  function makeTypeTest(type) {
    return function(testToken) {
      return testToken.type === type;
    };
  }

  var A = function(testToken) {
    return testToken === self.getSymbol("ACC") || testToken === self.getSymbol("A");
  };

  var AB = makeEqualTest(this.getSymbol("AB"));
  var C = makeEqualTest(this.getSymbol("C"));
  var AT_R0 = makeEqualTest(this.getSymbol("@R0"));
  var AT_R1 = makeEqualTest(this.getSymbol("@R1"));
  var R0 = makeEqualTest(this.getSymbol("R0"));
  var R1 = makeEqualTest(this.getSymbol("R1"));
  var R2 = makeEqualTest(this.getSymbol("R2"));
  var R3 = makeEqualTest(this.getSymbol("R3"));
  var R4 = makeEqualTest(this.getSymbol("R4"));
  var R5 = makeEqualTest(this.getSymbol("R5"));
  var R6 = makeEqualTest(this.getSymbol("R6"));
  var R7 = makeEqualTest(this.getSymbol("R7"));
  var AT_A = makeEqualTest(this.getSymbol("@A"));
  var AT_DPTR = makeEqualTest(this.getSymbol("@DPTR"));
  var DPTR = makeEqualTest(this.getSymbol("DPTR"));
  var PLUS = makeEqualTest(this.getSymbol("+"));
  var PC = makeEqualTest(this.getSymbol("PC"));

  var CODE_ADDR = makeTypeTest(Token.LABEL_REFERENCE);
  var BIT_ADDR = function(testToken) {
    return (testToken.type === Token.SYMBOL) && (testToken.width === 1);
  };

  var DATA_ADDR = function(testToken) {
    return ((testToken.type === Token.SYMBOL) && (testToken.width === 8)) ||
      testToken.type === Token.CONSTANT;
  };

  var CONSTANT = makeTypeTest(Token.CONSTANT);


  // CODE_ADDR is a label, arguably could be a constant code address to jump to
  // BIT_ADDR is an address to a bit, probably a symbol of width one or byte.Offset if byte is bit addressable
  // DATA_ADDR is a constant without a pound sign
  // CONSTANT is a constant with a pound sign
  // AT_A_PLUS_DPTR is the string "@A+DPTR", arguably "@A + DPTR" or something
  this.opcodes = [
    {name: "nop", args: [], length: 1, swap: false},
    {name: "ajmp", args: [CODE_ADDR], length: 2, swap: false},
    {name: "ljmp", args: [CODE_ADDR], length: 3, swap: false},
    {name: "rr", args: [A], length: 1, swap: false},
    {name: "inc", args: [A], length: 1, swap: false},
    {name: "inc", args: [DATA_ADDR], length: 2, swap: false},
    {name: "inc", args: [AT_R0], length: 1, swap: false},
    {name: "inc", args: [AT_R1], length: 1, swap: false},
    {name: "inc", args: [R0], length: 1, swap: false},
    {name: "inc", args: [R1], length: 1, swap: false},
    {name: "inc", args: [R2], length: 1, swap: false},
    {name: "inc", args: [R3], length: 1, swap: false},
    {name: "inc", args: [R4], length: 1, swap: false},
    {name: "inc", args: [R5], length: 1, swap: false},
    {name: "inc", args: [R6], length: 1, swap: false},
    {name: "inc", args: [R7], length: 1, swap: false},
    {name: "jbc", args: [BIT_ADDR, CODE_ADDR], length: 3, swap: false},
    {name: "acall", args: [CODE_ADDR], length: 2, swap: false},
    {name: "lcall", args: [CODE_ADDR], length: 3, swap: false},
    {name: "rrc", args: [A], length: 1, swap: false},
    {name: "dec", args: [A], length: 1, swap: false},
    {name: "dec", args: [DATA_ADDR], length: 2, swap: false},
    {name: "dec", args: [AT_R0], length: 1, swap: false},
    {name: "dec", args: [AT_R1], length: 1, swap: false},
    {name: "dec", args: [R0], length: 1, swap: false},
    {name: "dec", args: [R1], length: 1, swap: false},
    {name: "dec", args: [R2], length: 1, swap: false},
    {name: "dec", args: [R3], length: 1, swap: false},
    {name: "dec", args: [R4], length: 1, swap: false},
    {name: "dec", args: [R5], length: 1, swap: false},
    {name: "dec", args: [R6], length: 1, swap: false},
    {name: "dec", args: [R7], length: 1, swap: false},
    {name: "jb", args: [BIT_ADDR, CODE_ADDR], length: 3, swap: false},
    {name: "ajmp", args: [CODE_ADDR], length: 2, swap: false},
    {name: "ret", args: [], length: 1, swap: false},
    {name: "rl", args: [A], length: 1, swap: false},
    {name: "add", args: [A, CONSTANT], length: 2, swap: false},
    {name: "add", args: [A, DATA_ADDR], length: 2, swap: false},
    {name: "add", args: [A, AT_R0], length: 1, swap: false},
    {name: "add", args: [A, AT_R1], length: 1, swap: false},
    {name: "add", args: [A, R0], length: 1, swap: false},
    {name: "add", args: [A, R1], length: 1, swap: false},
    {name: "add", args: [A, R2], length: 1, swap: false},
    {name: "add", args: [A, R3], length: 1, swap: false},
    {name: "add", args: [A, R4], length: 1, swap: false},
    {name: "add", args: [A, R5], length: 1, swap: false},
    {name: "add", args: [A, R6], length: 1, swap: false},
    {name: "add", args: [A, R7], length: 1, swap: false},
    {name: "jnb", args: [BIT_ADDR, CODE_ADDR], length: 3, swap: false},
    {name: "acall", args: [CODE_ADDR], length: 2, swap: false},
    {name: "reti", args: [], length: 1, swap: false},
    {name: "rlc", args: [A], length: 1, swap: false},
    {name: "addc", args: [A, CONSTANT], length: 2, swap: false},
    {name: "addc", args: [A, DATA_ADDR], length: 2, swap: false},
    {name: "addc", args: [A, AT_R0], length: 1, swap: false},
    {name: "addc", args: [A, AT_R1], length: 1, swap: false},
    {name: "addc", args: [A, R0], length: 1, swap: false},
    {name: "addc", args: [A, R1], length: 1, swap: false},
    {name: "addc", args: [A, R2], length: 1, swap: false},
    {name: "addc", args: [A, R3], length: 1, swap: false},
    {name: "addc", args: [A, R4], length: 1, swap: false},
    {name: "addc", args: [A, R5], length: 1, swap: false},
    {name: "addc", args: [A, R6], length: 1, swap: false},
    {name: "addc", args: [A, R7], length: 1, swap: false},
    {name: "jc", args: [CODE_ADDR], length: 2, swap: false},
    {name: "ajmp", args: [CODE_ADDR], length: 2, swap: false},
    {name: "orl", args: [DATA_ADDR, A], length: 2, swap: true},
    {name: "orl", args: [DATA_ADDR, CONSTANT], length: 3, swap: false},
    {name: "orl", args: [A, CONSTANT], length: 2, swap: false},
    {name: "orl", args: [A, DATA_ADDR], length: 2, swap: false},
    {name: "orl", args: [A, AT_R0], length: 1, swap: false},
    {name: "orl", args: [A, AT_R1], length: 1, swap: false},
    {name: "orl", args: [A, R0], length: 1, swap: false},
    {name: "orl", args: [A, R1], length: 1, swap: false},
    {name: "orl", args: [A, R2], length: 1, swap: false},
    {name: "orl", args: [A, R3], length: 1, swap: false},
    {name: "orl", args: [A, R4], length: 1, swap: false},
    {name: "orl", args: [A, R5], length: 1, swap: false},
    {name: "orl", args: [A, R6], length: 1, swap: false},
    {name: "orl", args: [A, R7], length: 1, swap: false},
    {name: "jnc", args: [CODE_ADDR], length: 2, swap: false},
    {name: "acall", args: [CODE_ADDR], length: 2, swap: false},
    {name: "anl", args: [DATA_ADDR, A], length: 2, swap: true},
    {name: "anl", args: [DATA_ADDR, CONSTANT], length: 3, swap: false},
    {name: "anl", args: [A, CONSTANT], length: 2, swap: false},
    {name: "anl", args: [A, DATA_ADDR], length: 2, swap: false},
    {name: "anl", args: [A, AT_R0], length: 1, swap: false},
    {name: "anl", args: [A, AT_R1], length: 1, swap: false},
    {name: "anl", args: [A, R0], length: 1, swap: false},
    {name: "anl", args: [A, R1], length: 1, swap: false},
    {name: "anl", args: [A, R2], length: 1, swap: false},
    {name: "anl", args: [A, R3], length: 1, swap: false},
    {name: "anl", args: [A, R4], length: 1, swap: false},
    {name: "anl", args: [A, R5], length: 1, swap: false},
    {name: "anl", args: [A, R6], length: 1, swap: false},
    {name: "anl", args: [A, R7], length: 1, swap: false},
    {name: "jz", args: [CODE_ADDR], length: 2, swap: false},
    {name: "ajmp", args: [CODE_ADDR], length: 2, swap: false},
    {name: "xrl", args: [DATA_ADDR, A], length: 2, swap: true},
    {name: "xrl", args: [DATA_ADDR, CONSTANT], length: 3, swap: false},
    {name: "xrl", args: [A, CONSTANT], length: 2, swap: false},
    {name: "xrl", args: [A, DATA_ADDR], length: 2, swap: false},
    {name: "xrl", args: [A, AT_R0], length: 1, swap: false},
    {name: "xrl", args: [A, AT_R1], length: 1, swap: false},
    {name: "xrl", args: [A, R0], length: 1, swap: false},
    {name: "xrl", args: [A, R1], length: 1, swap: false},
    {name: "xrl", args: [A, R2], length: 1, swap: false},
    {name: "xrl", args: [A, R3], length: 1, swap: false},
    {name: "xrl", args: [A, R4], length: 1, swap: false},
    {name: "xrl", args: [A, R5], length: 1, swap: false},
    {name: "xrl", args: [A, R6], length: 1, swap: false},
    {name: "xrl", args: [A, R7], length: 1, swap: false},
    {name: "jnz", args: [CODE_ADDR], length: 2, swap: false},
    {name: "acall", args: [CODE_ADDR], length: 2, swap: false},
    {name: "orl", args: [CODE_ADDR], length: 2, swap: false},
    {name: "jmp", args: [AT_A, PLUS, DPTR], length: 1, swap: false},
    {name: "mov", args: [A, CONSTANT], length: 2, swap: false},
    {name: "mov", args: [DATA_ADDR, CONSTANT], length: 3, swap: false},
    {name: "mov", args: [AT_R0, CONSTANT], length: 2, swap: false},
    {name: "mov", args: [AT_R1, CONSTANT], length: 2, swap: false},
    {name: "mov", args: [R0, CONSTANT], length: 2, swap: false},
    {name: "mov", args: [R1, CONSTANT], length: 2, swap: false},
    {name: "mov", args: [R2, CONSTANT], length: 2, swap: false},
    {name: "mov", args: [R3, CONSTANT], length: 2, swap: false},
    {name: "mov", args: [R4, CONSTANT], length: 2, swap: false},
    {name: "mov", args: [R5, CONSTANT], length: 2, swap: false},
    {name: "mov", args: [R6, CONSTANT], length: 2, swap: false},
    {name: "mov", args: [R7, CONSTANT], length: 2, swap: false},
    {name: "sjmp", args: [CODE_ADDR], length: 2, swap: false},
    {name: "ajmp", args: [CODE_ADDR], length: 2, swap: false},
    {name: "anl", args: [C, BIT_ADDR], length: 2, swap: false},
    {name: "movc", args: [A, AT_A, PLUS, PC], length: 1, swap: false},
    {name: "div", args: [AB], length: 1, swap: false},
    {name: "mov", args: [DATA_ADDR, DATA_ADDR], length: 3, swap: true},
    {name: "mov", args: [DATA_ADDR, AT_R0], length: 2, swap: true},
    {name: "mov", args: [DATA_ADDR, AT_R1], length: 2, swap: true},
    {name: "mov", args: [DATA_ADDR, R0], length: 2, swap: true},
    {name: "mov", args: [DATA_ADDR, R1], length: 2, swap: true},
    {name: "mov", args: [DATA_ADDR, R2], length: 2, swap: true},
    {name: "mov", args: [DATA_ADDR, R3], length: 2, swap: true},
    {name: "mov", args: [DATA_ADDR, R4], length: 2, swap: true},
    {name: "mov", args: [DATA_ADDR, R5], length: 2, swap: true},
    {name: "mov", args: [DATA_ADDR, R6], length: 2, swap: true},
    {name: "mov", args: [DATA_ADDR, R7], length: 2, swap: true},
    {name: "mov", args: [DPTR, CONSTANT], length: 3, swap: false},
    {name: "acall", args: [CODE_ADDR], length: 2, swap: false},
    {name: "mov", args: [BIT_ADDR, C], length: 2, swap: true},
    {name: "movc", args: [A, AT_A, PLUS, DPTR], length: 1, swap: false},
    {name: "subb", args: [A, CONSTANT], length: 2, swap: false},
    {name: "subb", args: [A, DATA_ADDR], length: 2, swap: false},
    {name: "subb", args: [A, AT_R0], length: 1, swap: false},
    {name: "subb", args: [A, AT_R1], length: 1, swap: false},
    {name: "subb", args: [A, R0], length: 1, swap: false},
    {name: "subb", args: [A, R1], length: 1, swap: false},
    {name: "subb", args: [A, R2], length: 1, swap: false},
    {name: "subb", args: [A, R3], length: 1, swap: false},
    {name: "subb", args: [A, R4], length: 1, swap: false},
    {name: "subb", args: [A, R5], length: 1, swap: false},
    {name: "subb", args: [A, R6], length: 1, swap: false},
    {name: "subb", args: [A, R7], length: 1, swap: false},
    {name: "reserved orl", args: [A, null /*NOT_BIT_ADDR*/], length: 2, swap: false},
    {name: "ajmp", args: [CODE_ADDR], length: 2, swap: false},
    {name: "mov", args: [C, BIT_ADDR], length: 2, swap: false},
    {name: "inc", args: [DPTR], length: 1, swap: false},
    {name: "mul", args: [AB], length: 1, swap: false},
    {name: "reserved", args: [], length: 0, swap: false},
    {name: "mov", args: [AT_R0, DATA_ADDR], length: 2, swap: false},
    {name: "mov", args: [AT_R1, DATA_ADDR], length: 2, swap: false},
    {name: "mov", args: [R0, DATA_ADDR], length: 2, swap: false},
    {name: "mov", args: [R1, DATA_ADDR], length: 2, swap: false},
    {name: "mov", args: [R2, DATA_ADDR], length: 2, swap: false},
    {name: "mov", args: [R3, DATA_ADDR], length: 2, swap: false},
    {name: "mov", args: [R4, DATA_ADDR], length: 2, swap: false},
    {name: "mov", args: [R5, DATA_ADDR], length: 2, swap: false},
    {name: "mov", args: [R6, DATA_ADDR], length: 2, swap: false},
    {name: "mov", args: [R7, DATA_ADDR], length: 2, swap: false},
    {name: "reserved anl", args: [C, null /*NOT_BIT_ADDR*/], length: 2, swap: false},
    {name: "acall", args: [CODE_ADDR], length: 2, swap: false},
    {name: "cpl", args: [BIT_ADDR], length: 2, swap: false},
    {name: "cpl", args: [C], length: 1, swap: false},
    {name: "cjne", args: [A, CONSTANT, CODE_ADDR], length: 3, swap: false},
    {name: "cjne", args: [A, DATA_ADDR, CODE_ADDR], length: 3, swap: false},
    {name: "cjne", args: [AT_R0, CONSTANT, CODE_ADDR], length: 3, swap: false},
    {name: "cjne", args: [AT_R1, CONSTANT, CODE_ADDR], length: 3, swap: false},
    {name: "cjne", args: [R0, CONSTANT, CODE_ADDR], length: 3, swap: false},
    {name: "cjne", args: [R1, CONSTANT, CODE_ADDR], length: 3, swap: false},
    {name: "cjne", args: [R2, CONSTANT, CODE_ADDR], length: 3, swap: false},
    {name: "cjne", args: [R3, CONSTANT, CODE_ADDR], length: 3, swap: false},
    {name: "cjne", args: [R4, CONSTANT, CODE_ADDR], length: 3, swap: false},
    {name: "cjne", args: [R5, CONSTANT, CODE_ADDR], length: 3, swap: false},
    {name: "cjne", args: [R6, CONSTANT, CODE_ADDR], length: 3, swap: false},
    {name: "cjne", args: [R7, CONSTANT, CODE_ADDR], length: 3, swap: false},
    {name: "push", args: [DATA_ADDR], length: 2, swap: false},
    {name: "ajmp", args: [CODE_ADDR], length: 2, swap: false},
    {name: "clr", args: [BIT_ADDR], length: 2, swap: false},
    {name: "clr", args: [C], length: 1, swap: false},
    {name: "swap", args: [A], length: 1, swap: false},
    {name: "xch", args: [A, DATA_ADDR], length: 2, swap: false},
    {name: "xch", args: [A, AT_R0], length: 1, swap: false},
    {name: "xch", args: [A, AT_R1], length: 1, swap: false},
    {name: "xch", args: [A, R0], length: 1, swap: false},
    {name: "xch", args: [A, R1], length: 1, swap: false},
    {name: "xch", args: [A, R2], length: 1, swap: false},
    {name: "xch", args: [A, R3], length: 1, swap: false},
    {name: "xch", args: [A, R4], length: 1, swap: false},
    {name: "xch", args: [A, R5], length: 1, swap: false},
    {name: "xch", args: [A, R6], length: 1, swap: false},
    {name: "xch", args: [A, R7], length: 1, swap: false},
    {name: "pop", args: [DATA_ADDR], length: 2, swap: false},
    {name: "acall", args: [CODE_ADDR], length: 2, swap: false},
    {name: "setb", args: [BIT_ADDR], length: 2, swap: false},
    {name: "setb", args: [C], length: 1, swap: false},
    {name: "da", args: [A], length: 1, swap: false},
    {name: "djnz", args: [DATA_ADDR, CODE_ADDR], length: 3, swap: false},
    {name: "xchd", args: [AT_R0], length: 1, swap: false},
    {name: "xchd", args: [AT_R1], length: 1, swap: false},
    {name: "djnz", args: [R0, CODE_ADDR], length: 2, swap: false},
    {name: "djnz", args: [R1, CODE_ADDR], length: 2, swap: false},
    {name: "djnz", args: [R2, CODE_ADDR], length: 2, swap: false},
    {name: "djnz", args: [R3, CODE_ADDR], length: 2, swap: false},
    {name: "djnz", args: [R4, CODE_ADDR], length: 2, swap: false},
    {name: "djnz", args: [R5, CODE_ADDR], length: 2, swap: false},
    {name: "djnz", args: [R6, CODE_ADDR], length: 2, swap: false},
    {name: "djnz", args: [R7, CODE_ADDR], length: 2, swap: false},
    {name: "movx", args: [A, AT_DPTR], length: 1, swap: false},
    {name: "ajmp", args: [CODE_ADDR], length: 2, swap: false},
    {name: "movx", args: [A, AT_R0], length: 1, swap: false},
    {name: "movx", args: [A, AT_R1], length: 1, swap: false},
    {name: "clr", args: [A], length: 1, swap: false},
    {name: "mov", args: [A, DATA_ADDR], length: 2, swap: false},
    {name: "mov", args: [A, AT_R0], length: 1, swap: false},
    {name: "mov", args: [A, AT_R1], length: 1, swap: false},
    {name: "mov", args: [A, R0], length: 1, swap: false},
    {name: "mov", args: [A, R1], length: 1, swap: false},
    {name: "mov", args: [A, R2], length: 1, swap: false},
    {name: "mov", args: [A, R3], length: 1, swap: false},
    {name: "mov", args: [A, R4], length: 1, swap: false},
    {name: "mov", args: [A, R5], length: 1, swap: false},
    {name: "mov", args: [A, R6], length: 1, swap: false},
    {name: "mov", args: [A, R7], length: 1, swap: false},
    {name: "movx", args: [AT_DPTR, A], length: 1, swap: false},
    {name: "acall", args: [CODE_ADDR], length: 2, swap: false},
    {name: "movx", args: [AT_R0, A], length: 1, swap: false},
    {name: "movx", args: [AT_R1, A], length: 1, swap: false},
    {name: "cpl", args: [A], length: 1, swap: false},
    {name: "mov", args: [DATA_ADDR, A], length: 2, swap: true},
    {name: "mov", args: [AT_R0, A], length: 1, swap: false},
    {name: "mov", args: [AT_R1, A], length: 1, swap: false},
    {name: "mov", args: [R0, A], length: 1, swap: false},
    {name: "mov", args: [R1, A], length: 1, swap: false},
    {name: "mov", args: [R2, A], length: 1, swap: false},
    {name: "mov", args: [R3, A], length: 1, swap: false},
    {name: "mov", args: [R4, A], length: 1, swap: false},
    {name: "mov", args: [R5, A], length: 1, swap: false},
    {name: "mov", args: [R6, A], length: 1, swap: false},
    {name: "mov", args: [R7, A], length: 1, swap: false}
  ];

  for(var i = 0; i < this.opcodes.length; i++) {
    this.opcodes[i].opcode = i;
  }


}

Proc8051.prototype = Object.create(Proc.prototype);

Proc8051.prototype.parseConstant = function(constant) {
  var base = constant.charAt(constant.length-1).toLowerCase();
  var rawConstant = constant.replace(/[hbod]$/, "");
  var value = 0;

  switch(base) {
    case "h":
      value = parseInt(rawConstant, 16);
      break;
    case "b":
      value = parseInt(rawConstant, 2);
      break;
    case "o":
      value =  parseInt(rawConstant, 8);
      break;
    case "d":
      value = parseInt(rawConstant, 10);
      break;
    default:
      value = parseInt(rawConstant, 10);
      break;
  }
  if(isNaN(value)) {
    throw new Error("Could not parse constant from "+constant);
  }
  return value;
};

Proc8051.prototype.getLengthPassResults = function(text) {
  var lines = text.split("\n");
  var tokenPairsByLine = this.getTokenPairsByLine(text);

  var tokenGroups = [];
  var errors = [];
  var warnings = [];
  var labelAddresses = {};
  var byteAddr = 0;

  function tokenPairTypeValid(tp) {
    return tp.token.isValid();
  }

  function getTokenPairToken(tp) {
    return tp.token;
  }

  var self = this;
  function tokenPairNotWhitespace(tp) {
    return tp.text.length > 0 && !self.whiteSpaceRegex.test(tp.text);
  }

  for(var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    var tokenPairs = tokenPairsByLine[lineIndex].filter(tokenPairNotWhitespace);

    // check validity of tokens. If one of them is legit invalid, report it
    var errorInLine = false;
    var tokensInLine = false;
    for(var tokenIndex = 0; tokenIndex < tokenPairs.length; tokenIndex++) {
      var tokenText = tokenPairs[tokenIndex].text;
      var token = tokenPairs[tokenIndex].token;
      if(token.isValid()) {
        tokensInLine = true;
        continue;
      }

      if(token.type === Token.INVALID) {
        errors.push({line: lineIndex, text: "Invalid token \""+tokenText+"\""});
        errorInLine = true;
        break;
      }
    }

    if(errorInLine || !tokensInLine) {
      tokenGroups.push([]);
      continue;
    }

    tokenPairs = tokenPairs.filter(tokenPairTypeValid);

    var tokens = tokenPairs.map(getTokenPairToken);
    tokenGroups.push(tokens);

    // handle a .org specifier by setting the current program offset
    if(tokens[0].type === Token.ORGANIZATION) {
      if(tokens[1].type === Token.CONSTANT) {
        byteAddr = tokens[1].value;
        if(tokens.length > 2) {
          warnings.push({line: lineIndex, text: "Junk after organization specifier"});
        }
      } else {
        errors.push({line: lineIndex, text: "Organization specifiers need constant addresses"});
      }
      continue;
    }
    // add a new label at the current location
    if(tokens[0].type === Token.LABEL_DECLARATION) {
      labelAddresses[tokens[0].name] = byteAddr;
      if(tokens.length > 1) {
        warnings.push({line: lineIndex, text: "Junk after label"});
      }
      continue;
    }

    // constants can't start lines
    if(tokens[0].type === Token.CONSTANT) {
      errors.push({line: lineIndex, text: "Lines may not start with constants"});
      continue;
    }

    // symbols can't start lines
    if(tokens[0].type === Token.SYMBOL) {
      errors.push({line: lineIndex, text: "Lines may not start with symbols"});
      continue;
    }


    if(tokens[0].type === Token.DATABASE) {
      for(var i = 1; i < tokens.length; i++) {
        var dbToken = tokens[i];
        try {
          byteAddr += dbToken.getByteRepresentation().length;
        } catch(e) {
          errors.push({line: lineIndex, text: "Databases require constant tokens"});
        }
      }
      continue;
    }


    // get the opcode of the current instruction
    var opcode = this.getOpcode(tokens);
    if(!opcode) {
      errors.push({line: lineIndex, text: "No opcode found"});
      continue;
    }

    byteAddr += opcode.length;
  }

  return {
    tokenGroups: tokenGroups,
    labelAddresses: labelAddresses,
    errors: errors,
    warnings: warnings
  };
};

Proc8051.prototype.getGeneratePassResults = function(tokenGroups, labelAddresses) {
  var byteAddr = 0;
  var programBytes = new Uint8Array(64*1024); //about 64k of memory, whatever
  var listings = new Array(tokenGroups.length);
  var errors = [];
  var warnings = [];

  for(var lineIndex = 0; lineIndex < tokenGroups.length; lineIndex++) {
    var tokens = tokenGroups[lineIndex];
    if(tokens.length === 0) continue;

    if(tokens[0].type === Token.ORGANIZATION) {
      byteAddr = tokens[1].value;
      continue;
    }

    if(tokens[0].type === Token.DATABASE) {
      var dbStartAddr = byteAddr + 0;
      for(var i = 1; i < tokens.length; i++) {
        var byteRep = tokens[i].getByteRepresentation();
        for(var j = 0; j < byteRep.length; j++) {
          programBytes[byteAddr+j] = byteRep[j];
        }
        byteAddr += byteRep.length;
      }
      listings[lineIndex] = {length: byteAddr - dbStartAddr, address: dbStartAddr};
      continue;
    }


    if(tokens[0].type !== Token.INSTRUCTION) {
      continue;
    }

    var opcode = this.getOpcode(tokens);
    if(!opcode) {
      errors.push({line: lineIndex, text: "Could not find valid opcode for "+tokens[0].name});
      break;
    }

    programBytes[byteAddr] = opcode.opcode;
    listings[lineIndex] = {length: opcode.length, address: byteAddr};

    // special case for mov data_addr, data_addr because its source and dest are swapped memory-wise
    // also special case mov direct, anything because they are sad
    if(opcode.swap) {
      // swap src and dst
      var tmp = tokens[2];
      tokens[2] = tokens[1];
      tokens[1] = tmp;
    }

    for(var byteOffset = opcode.length - 1; byteOffset > 0; byteOffset--) {
      var tokenOffset = byteOffset - opcode.length + tokens.length;
      var token = tokens[tokenOffset];
      if(token.type === Token.LABEL_REFERENCE) {
        // must distinguish between absolute and relative addressing
        var targetAddr = labelAddresses[token.name];
        switch(opcode.name) {
        case "ljmp":
        case "lcall":
          // absolute (addr16)
          programBytes[byteAddr+byteOffset] = targetAddr & 0xff;
          byteOffset -= 1;
          programBytes[byteAddr+byteOffset] = (targetAddr & 0xff00) >> 8;
          break;
        case "jb":
        case "jbc":
        case "jc":
        case "jnb":
        case "jnc":
        case "jnz":
        case "jz":
        case "sjmp":
        case "cjne":
        case "djnz":
          var offset = targetAddr - byteAddr - opcode.length;
          if(offset > 127 || offset < -128) {
            errors.push({line: lineIndex, text: "Relative jump offset out of range"});
          }
          programBytes[byteAddr+byteOffset] = (offset+256)&0xff;
          // relative addring
          break;
        case "ajmp":
        case "acall":
          // absolute (addr11)
          // first three bits are packed in instruction
          if(targetAddr > 0x3ff) {
            errors.push({line: lineIndex, text: "Absolute call address out of range"});
          }
          var firstThree = ((targetAddr >> 8)&0x7);
          programBytes[byteAddr] &= 0x1f;
          programBytes[byteAddr] |= firstThree << 5;
          programBytes[byteAddr+byteOffset] = targetAddr & 0xff;
          break;
        }

      } else {
        try {
          var byteRepresentation = token.getByteRepresentation();
          if(byteRepresentation.length > 1 || byteRepresentation.length === 0 ||
             byteRepresentation[0] > 255 || byteRepresentation[0] < -128) {
            errors.push({line: lineIndex, text: "Malformed byte representation"});
          }
          programBytes[byteAddr+byteOffset] = byteRepresentation[0];
        } catch(e) {
          errors.push({line: lineIndex, text: e.message});
        }
      }
    }

    byteAddr += opcode.length;
  }

  return {errors: errors, warnings: warnings, programBytes: programBytes, programBytesLength: byteAddr, listings: listings};
};

Proc8051.prototype.getOpcode = function(tokens) {
  if(tokens[0].type !== Token.INSTRUCTION)
    throw new Error("opcodes need instructions first");

  // opcodes are grouped by instruction name
  var instrName = tokens[0].name;

  var possibleInstrs = this.opcodes.filter(function(op) { return op.name === instrName; });

  var foundInstrs = [];

  for(var i = 0, len = possibleInstrs.length; i < len; i++) {
    var possibleInstr = possibleInstrs[i];
    if(possibleInstr.args.length !== tokens.length - 1) {
      continue;
    }

    var foundInstr = true;
    // argTest is a test of whether an argument fits for the given instruction
    for(var argIndex = 0; argIndex < possibleInstr.args.length; argIndex++) {
      var argTest = possibleInstr.args[argIndex];
      var argActual = tokens[argIndex+1];

      if(!argTest(argActual)) {
        foundInstr = false;
        break;
      }
    }
    if(foundInstr) {
      foundInstrs.push(possibleInstr);
    }
  }

  if(foundInstrs.length === 0) {
    return null;
  }

  // minimize opcode length
  var bestInstr = foundInstrs[0];
  for(i = 1; i < foundInstrs.length; i++) {
    if(bestInstr.length > foundInstrs[i].length) {
      bestInstr = foundInstrs[i];
    }
  }
  return bestInstr;
};

Proc8051.prototype.generateAssembly = function(text) {
  var lengthPassResults = this.getLengthPassResults(text);
  var tokenGroups = lengthPassResults.tokenGroups;
  var labelAddresses = lengthPassResults.labelAddresses;
  var warnings = lengthPassResults.warnings;
  var errors = lengthPassResults.errors;

  if(errors.length > 0) {
    return {
      hex: null,
      errors: errors,
      warnings: warnings
    };
  }

  return this.getGeneratePassResults(tokenGroups, labelAddresses);
};

Proc8051.prototype.generateHex = function(assembly) {
  if(assembly.errors.length > 0) {
    return {
      hex: null,
      errors: assembly.errors,
      warnings: assembly.warnings
    };
  }

  var encodeResults = new Encoder().encode(assembly.programBytes, assembly.programBytesLength);

  return encodeResults;
};

