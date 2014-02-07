function Proc8051() {
  Proc.call(this);
  this.constantRegex = /#([0-9a-fA-F]+[hbd])/;
  this.docUrl = "http://www.keil.com/support/man/docs/is51/is51_%s.htm";

  this.addInstruction("acall", 1, "call subroutine at address");
  this.addInstruction("add", 2, "add byte value to accumulator");
  this.addInstruction("addc", 2, "add byte value and carry bit to accumulator");
  this.addInstruction("ajmp", 1, "jump to address");
  this.addInstruction("anl", 2, "bitwise and");
  this.addInstruction("cjne", 3, "compare and jump if not equal");
  this.addInstruction("clr", 1, "clear bit");
  this.addInstruction("cpl", 1, "flip bit");
  this.addInstruction("da", 1, "converts to BCD notation");
  this.addInstruction("dec", 1, "decrement");
  this.addInstruction("div", 1, "divide");
  this.addInstruction("djnz", 2, "decrement and jump if zero");
  this.addInstruction("inc", 1, "increment");
  this.addInstruction("jb", 2, "jump if bit set");
  this.addInstruction("jbc", 2, "jump if bit set, clearing bit");
  this.addInstruction("jc", 1, "jump if carry flag is set");
  this.addInstruction("jmp", 1, "jump by offset");
  this.addInstruction("jnb", 2, "jump if bit unset");
  this.addInstruction("jc", 1, "jump if carry flag is unset");
  this.addInstruction("jnz", 1, "jump if the accumulator is not zero");
  this.addInstruction("jz", 1, "jump if the accumulator is zero");
  this.addInstruction("lcall", 1, "call subroutine at address");
  this.addInstruction("ljmp", 1, "jump to address");
  this.addInstruction("mov", 2, "move byte");
  this.addInstruction("movc", 2, "move byte from program memory to accumulator");
  this.addInstruction("movx", 2, "move byte from accumulator to program memory");
  this.addInstruction("mul", 0, "multiply accumulator and B register");
  this.addInstruction("nop", 0, "do nothing");
  this.addInstruction("orl", 2, "bitwise or");
  this.addInstruction("pop", 1, "pop byte from stack");
  this.addInstruction("push", 1, "push byte onto stack");
  this.addInstruction("ret", 0, "return from subroutine");
  this.addInstruction("reti", 0, "return from interrupt");
  this.addInstruction("rl", 1, "rotate left");
  this.addInstruction("rlc", 1, "rotate left with carry");
  this.addInstruction("rr", 1, "rotate right");
  this.addInstruction("rlc", 1, "rotate right with carry");
  this.addInstruction("setb", 1, "set bit");
  this.addInstruction("sjmp", 1, "jump by signed offset");
  this.addInstruction("subb", 2, "subtract byte value and carry flag");
  this.addInstruction("swap", 1, "exchange low and high nibbles");
  this.addInstruction("xch", 2, "exchange bytes");
  this.addInstruction("xchd", 2, "exchange low nibbles");
  this.addInstruction("xrl", 2, "bitwise xor");

  // rewording of the symbol table from as31
  this.addSymbol("P0",    0x80, "port zero");
  this.addSymbol("T2",    0x80+0, "wat");
  this.addSymbol("T2EX",  0x80+1, "wat");
  this.addSymbol("SP",    0x80+1, "stack pointer");
  this.addSymbol("DPL",   0x80+2, "data pointer low");
  this.addSymbol("DPH",   0x80+3, "data pointer high");
  this.addSymbol("PCON",  0x80+7, "wat");

  this.addSymbol("TCON",  0x88, "timer one control");
  this.addSymbol("IT0",   0x88+0, "wat");
  this.addSymbol("IE0",   0x88+1, "wat");
  this.addSymbol("TMOD",  0x88+1, "wat");
  this.addSymbol("IT1",   0x88+2, "wat");
  this.addSymbol("TL0",   0x88+2, "wat");
  this.addSymbol("TR2",   0x88+2, "wat");
  this.addSymbol("IE1",   0x88+3, "wat");
  this.addSymbol("TL1",   0x88+3, "wat");
  this.addSymbol("TH0",   0x88+4, "wat");
  this.addSymbol("TR0",   0x88+4, "wat");
  this.addSymbol("TF0",   0x88+5, "wat");
  this.addSymbol("TH1",   0x88+5, "wat");
  this.addSymbol("TR1",   0x88+6, "wat");
  this.addSymbol("TF1",   0x88+7, "wat");

  this.addSymbol("P1",    0x90, "port one");

  this.addSymbol("SCON", 0x98, "serial control");
  this.addSymbol("RI",   0x98+0, "wat");
  this.addSymbol("SBUF", 0x98+1, "wat");
  this.addSymbol("TI",   0x98+1, "wat");
  this.addSymbol("RB8",  0x98+2, "wat");
  this.addSymbol("TB8",  0x98+3, "wat");
  this.addSymbol("REN",  0x98+4, "wat");
  this.addSymbol("SM2",  0x98+5, "wat");
  this.addSymbol("SM1",  0x98+6, "wat");
  this.addSymbol("SM0",  0x98+7, "wat");

  this.addSymbol("P2",    0xA0, "port two");

  this.addSymbol("IE",    0xA8, "wat");
  this.addSymbol("EX0",   0xA8+0, "wat");
  this.addSymbol("ET0",   0xA8+1, "wat");
  this.addSymbol("EX1",   0xA8+2, "wat");
  this.addSymbol("ET1",   0xA8+3, "wat");
  this.addSymbol("ES",    0xA8+4, "wat");
  this.addSymbol("ET2",   0xA8+5, "wat");
  this.addSymbol("EA",    0xA8+7, "wat");

  this.addSymbol("P3",   0xB0, "port three");
  this.addSymbol("RXD",  0xB0+0, "wat");
  this.addSymbol("TXD",  0xB0+1, "wat");
  this.addSymbol("INT0", 0xB0+2, "wat");
  this.addSymbol("INT1", 0xB0+3, "wat");
  this.addSymbol("T0",   0xB0+4, "wat");
  this.addSymbol("T1",   0xB0+5, "wat");
  this.addSymbol("WR",   0xB0+6, "wat");
  this.addSymbol("RD",   0xB0+7, "wat");

  this.addSymbol("IP",    0xB8, "wat");
  this.addSymbol("PX0",   0xB8+0, "wat");
  this.addSymbol("PT0",   0xB8+1, "wat");
  this.addSymbol("PX1",   0xB8+2, "wat");
  this.addSymbol("PT1",   0xB8+3, "wat");
  this.addSymbol("PS",    0xB8+4, "wat");
  this.addSymbol("PT2",   0xB8+5, "wat");

  this.addSymbol("T2CON",  0xC8, "timer two control");
  this.addSymbol("RL2",    0xC8, "wat");
  this.addSymbol("RCAP2L", 0xC8+2, "wat");
  this.addSymbol("RCAP2H", 0xC8+3, "wat");
  this.addSymbol("EXEN2",  0xC8+3, "wat");
  this.addSymbol("TCLK",   0xC8+4, "wat");
  this.addSymbol("TL2",    0xC8+4, "wat");
  this.addSymbol("RCLK",   0xC8+5, "wat");
  this.addSymbol("TH2",    0xC8+5, "wat");
  this.addSymbol("EXF2",   0xC8+6, "wat");
  this.addSymbol("TF2",    0xC8+7, "wat");


  this.addSymbol("PSW",   0xD0, "wat");
  this.addSymbol("P",     0xD0+0, "wat")
  this.addSymbol("OV",    0xD0+2, "wat");
  this.addSymbol("RS0",    0xD0+3, "wat");
  this.addSymbol("RS1",    0xD0+4, "wat");
  this.addSymbol("F0",    0xD0+5, "wat");
  this.addSymbol("AC",    0xD0+6, "wat");
  this.addSymbol("CY",    0xD0+7, "wat");

  this.addSymbol("ACC",   0xE0, "wat");

  this.addSymbol("B",     0xF0, "wat");

  this.addSymbol("R0", 0, "register zero");
  this.addSymbol("R1", 1, "register one");
  this.addSymbol("R2", 2, "register two");
  this.addSymbol("R3", 3, "register three");
  this.addSymbol("R4", 4, "register four");
  this.addSymbol("R5", 5, "register five");
  this.addSymbol("R6", 6, "register six");
  this.addSymbol("R7", 7, "register seven");
}

Proc8051.prototype = Proc.prototype;

Proc8051.prototype.parseConstant = function(constant) {
  var base = constant.charAt(constant.length-1).toLowerCase();
  var rawConstant = constant.replace(/[^\d]/g, "");
  //console.log("rc: "+rawConstant);
  switch(base) {
    case "h":
      return parseInt(rawConstant, 16);
    case "b":
      return parseInt(rawConstant, 2);
    case "d":
      return parseInt(rawConstant, 10);
    case "o":
      return parseInt(rawConstant, 8);
  }
  throw new Error("Could not parse constant from "+constant);
};

