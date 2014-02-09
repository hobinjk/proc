function Proc8051() {
  Proc.call(this);
  this.constantRegex = /^#?([0-9a-fA-F]+[hbd]?)$/;
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
  this.addSymbol("P0",   0x80, "port zero", 8);
  //this.addSymbol("T2",    0x80+0, "wat");
  //this.addSymbol("T2EX",  0x80+1, "wat");
  this.addSymbol("SP",   0x81, "stack pointer", 8);
  this.addSymbol("DPTR", 0x82, "data pointer", 16);
  this.addSymbol("DPL",   0x82, "data pointer low", 8);
  this.addSymbol("DPH",   0x83, "data pointer high", 8);
  this.addSymbol("PCON",  0x87, "power control", 8);

  this.addSymbol("TCON",  0x88, "timer one control", 8);
  this.addSymbol("IT0",   0x88*8+0, "interrupt zero type control bit", 1);
  this.addSymbol("IE0",   0x88*8+1, "external interrupt zero edge flag", 1);
  this.addSymbol("IT1",   0x88*8+2, "interrupt one type control bit", 1);
  // this.addSymbol("TR2",   0x88+2, "wat");
  this.addSymbol("IE1",   0x88*8+3, "external interrupt one edge flag", 1);
  this.addSymbol("TR0",   0x88*8+4, "timer zero run control bit", 1);
  this.addSymbol("TF0",   0x88*8+5, "timer zero overflow flag", 1);
  this.addSymbol("TR1",   0x88*8+6, "timer one run control bit", 1);
  this.addSymbol("TF1",   0x88*8+7, "timer one overflow flag", 1);

  this.addSymbol("TMOD",  0x89, "timer mode control", 8);
  this.addSymbol("TL0",   0x8A, "timer zero low byte", 8);
  this.addSymbol("TL1",   0x8B, "timer one low byte", 8);
  this.addSymbol("TH0",   0x8C, "timer zero high byte", 8);
  this.addSymbol("TH1",   0x8D, "timer one high byte", 8);

  this.addSymbol("P1",    0x90, "port one", 8);

  this.addSymbol("SCON", 0x98, "serial control", 8);
  this.addSymbol("RI",   0x98*8+0, "receive interrupt flag", 1);
  this.addSymbol("TI",   0x98*8+1, "transmit interrupt flag", 1);
  this.addSymbol("RB8",  0x98*8+2, "ninth data bit received or stop bit", 1);
  this.addSymbol("TB8",  0x98*8+3, "ninth bit to be transmitted", 1);
  this.addSymbol("REN",  0x98*8+4, "reception enable", 1);
  this.addSymbol("SM2",  0x98*8+5, "multiprocessor communication enable", 1);
  this.addSymbol("SM1",  0x98*8+6, "serial port mode bit", 1);
  this.addSymbol("SM0",  0x98*8+7, "serial port mode bit", 1);

  this.addSymbol("SBUF", 0x99, "serial buffer", 8);

  this.addSymbol("P2",    0xA0, "port two", 8);

  this.addSymbol("IE",    0xA8, "interrupt control register", 8);
  this.addSymbol("EX0",   0xA8*8+0, "external interrupt zero enable", 1);
  this.addSymbol("ET0",   0xA8*8+1, "timer zero overflow interrupt enable", 1);
  this.addSymbol("EX1",   0xA8*8+2, "external interrupt one enable", 1);
  this.addSymbol("ET1",   0xA8*8+3, "timer one overflow interrupt enable", 1);
  this.addSymbol("ES",    0xA8*8+4, "serial port interrupt enable", 1);
  this.addSymbol("ET2",   0xA8*8+5, "timer two overflow interrupt enable", 1);
  this.addSymbol("EA",    0xA8*8+7, "interupt enable", 1);

  this.addSymbol("P3",   0xB0, "port three", 8);
  this.addSymbol("RXD",  0xB0*8+0, "serial input port", 1);
  this.addSymbol("TXD",  0xB0*8+1, "serial output port", 1);
  this.addSymbol("INT0", 0xB0*8+2, "external interrupt zero input", 1);
  this.addSymbol("INT1", 0xB0*8+3, "external interrupt one input", 1);
  this.addSymbol("T0",   0xB0*8+4, "timer zero input", 1);
  this.addSymbol("T1",   0xB0*8+5, "timer one input", 1);
  this.addSymbol("WR",   0xB0*8+6, "external data write", 1);
  this.addSymbol("RD",   0xB0*8+7, "external data read", 1);

  this.addSymbol("IP",    0xB8, "interrupt priority control", 8);
  this.addSymbol("PX0",   0xB8*8+0, "external interrupt zero priority level", 1);
  this.addSymbol("PT0",   0xB8*8+1, "timer zero interrupt priority level", 1);
  this.addSymbol("PX1",   0xB8*8+2, "external interrupt one priority level", 1);
  this.addSymbol("PT1",   0xB8*8+3, "timer one interrupt priority level", 1);
  this.addSymbol("PS",    0xB8*8+4, "serial port interrupt priority level", 1);
  this.addSymbol("PT2",   0xB8*8+5, "timer two interrupt priority level", 1);

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


  this.addSymbol("PSW",   0xD0, "program status word", 8);
  this.addSymbol("P",     0xD0*8+0, "accumulator parity flag", 1)
  this.addSymbol("OV",    0xD0*8+2, "overflow flag", 1);
  this.addSymbol("RS0",   0xD0*8+3, "register bank select bit 0", 1);
  this.addSymbol("RS1",   0xD0*8+4, "register bank select bit 1", 1);
  this.addSymbol("F0",    0xD0*8+5, "general purpose status flag", 1);
  this.addSymbol("AC",    0xD0*8+6, "auxilary carry flag for addition", 1);
  this.addSymbol("CY",    0xD0*8+7, "carry flag", 1);

  this.addSymbol("ACC",   0xE0, "accumulator", 8);

  this.addSymbol("B",     0xF0, "B register", 8);

  this.addSymbol("R0", -1, "register zero", 8);
  this.addSymbol("R1", -1, "register one", 8);
  this.addSymbol("R2", -1, "register two", 8);
  this.addSymbol("R3", -1, "register three", 8);
  this.addSymbol("R4", -1, "register four", 8);
  this.addSymbol("R5", -1, "register five", 8);
  this.addSymbol("R6", -1, "register six", 8);
  this.addSymbol("R7", -1, "register seven", 8);

  this.addSymbol("@R0", -1, "value pointed to by register zero", 8);
  this.addSymbol("@R1", -1, "value pointed to by register one", 8);
  this.addSymbol("@DPTR", -1, "value pointed to by data pointer", 8);
  this.addSymbol("@A", -1, "value pointed to by register A", 8);
  this.addSymbol("+", -1, "plus", 0);
  this.addSymbol("PC", -1, "program counter", 0);


  var A = this.getSymbol("ACC");
  var AT_R0 = this.getSymbol("@R0");
  var AT_R1 = this.getSymbol("@R1");
  var R0 = this.getSymbol("R0");
  var R1 = this.getSymbol("R1");
  var R2 = this.getSymbol("R2");
  var R3 = this.getSymbol("R3");
  var R4 = this.getSymbol("R4");
  var R5 = this.getSymbol("R5");
  var R6 = this.getSymbol("R6");
  var R7 = this.getSymbol("R7");
  var AT_A = this.getSymbol("@A");
  var AT_DPTR = this.getSymbol("@DPTR");
  var PLUS = this.getSymbol("+");
  var PC = this.getSymbol("PC");


  // CODE_ADDR is a label, arguably could be a constant code address to jump to
  // BIT_ADDR is an address to a bit, probably a symbol of width one or byte.Offset if byte is bit addressable
  // DATA_ADDR is a constant without a pound sign
  // CONSTANT is a constant with a pound sign
  // AT_A_PLUS_DPTR is the string "@A+DPTR", arguably "@A + DPTR" or something
  this.opcodes = [
    {name: "nop", args: [], length: 1},
    {name: "ajmp", args: [CODE_ADDR], length: 2},
    {name: "ljmp", args: [CODE_ADDR], length: 3},
    {name: "rr", args: [A], length: 1},
    {name: "inc", args: [A], length: 1},
    {name: "inc", args: [DATA_ADDR], length: 2},
    {name: "inc", args: [AT_R0], length: 1},
    {name: "inc", args: [AT_R1], length: 1},
    {name: "inc", args: [R0], length: 1},
    {name: "inc", args: [R1], length: 1},
    {name: "inc", args: [R2], length: 1},
    {name: "inc", args: [R3], length: 1},
    {name: "inc", args: [R4], length: 1},
    {name: "inc", args: [R5], length: 1},
    {name: "inc", args: [R6], length: 1},
    {name: "inc", args: [R7], length: 1},
    {name: "jbc", args: [BIT_ADDR, CODE_ADDR], length: 3},
    {name: "acall", args: [CODE_ADDR], length: 2},
    {name: "lcall", args: [CODE_ADDR], length: 3},
    {name: "rrc", args: [A], length: 1},
    {name: "dec", args: [A], length: 1},
    {name: "dec", args: [DATA_ADDR], length: 2},
    {name: "dec", args: [AT_R0], length: 1},
    {name: "dec", args: [AT_R1], length: 1},
    {name: "dec", args: [R0], length: 1},
    {name: "dec", args: [R1], length: 1},
    {name: "dec", args: [R2], length: 1},
    {name: "dec", args: [R3], length: 1},
    {name: "dec", args: [R4], length: 1},
    {name: "dec", args: [R5], length: 1},
    {name: "dec", args: [R6], length: 1},
    {name: "dec", args: [R7], length: 1},
    {name: "jb", args: [BIT_ADDR, CODE_ADDR], length: 3},
    {name: "ajmp", args: [CODE_ADDR], length: 2},
    {name: "ret", args: [], length: 1},
    {name: "rl", args: [A], length: 1},
    {name: "add", args: [A, CONSTANT], length: 2},
    {name: "add", args: [A, DATA_ADDR], length: 2},
    {name: "add", args: [A, AT_R0], length: 1},
    {name: "add", args: [A, AT_R1], length: 1},
    {name: "add", args: [A, R0], length: 1},
    {name: "add", args: [A, R1], length: 1},
    {name: "add", args: [A, R2], length: 1},
    {name: "add", args: [A, R3], length: 1},
    {name: "add", args: [A, R4], length: 1},
    {name: "add", args: [A, R5], length: 1},
    {name: "add", args: [A, R6], length: 1},
    {name: "add", args: [A, R7], length: 1},
    {name: "jnb", args: [BIT_ADDR, CODE_ADDR], length: 3},
    {name: "acall", args: [CODE_ADDR], length: 2},
    {name: "reti", args: [], length: 1},
    {name: "rlc", args: [A], length: 1},
    {name: "addc", args: [A, CONSTANT], length: 2},
    {name: "addc", args: [A, DATA_ADDR], length: 2},
    {name: "addc", args: [A, AT_R0], length: 1},
    {name: "addc", args: [A, AT_r1], length: 1},
    {name: "addc", args: [A, R0], length: 1},
    {name: "addc", args: [A, R1], length: 1},
    {name: "addc", args: [A, R2], length: 1},
    {name: "addc", args: [A, R3], length: 1},
    {name: "addc", args: [A, R4], length: 1},
    {name: "addc", args: [A, R5], length: 1},
    {name: "addc", args: [A, R6], length: 1},
    {name: "addc", args: [A, R7], length: 1},
    {name: "jc", args: [CODE_ADDR], length: 2},
    {name: "ajmp", args: [CODE_ADDR], length: 2},
    {name: "orl", args: [DATA_ADDR, A], length: 2},
    {name: "orl", args: [DATA_ADDR, CONSTANT], length: 3},
    {name: "orl", args: [A, CONSTANT], length: 2},
    {name: "orl", args: [A, DATA_ADDR], length: 2},
    {name: "orl", args: [A, AT_R0], length: 1},
    {name: "orl", args: [A, AT_R1], length: 1},
    {name: "orl", args: [A, R0], length: 1},
    {name: "orl", args: [A, R1], length: 1},
    {name: "orl", args: [A, R2], length: 1},
    {name: "orl", args: [A, R3], length: 1},
    {name: "orl", args: [A, R4], length: 1},
    {name: "orl", args: [A, R5], length: 1},
    {name: "orl", args: [A, R6], length: 1},
    {name: "orl", args: [A, R7], length: 1},
    {name: "jnc", args: [CODE_ADDR], length: 2},
    {name: "acall", args: [CODE_ADDR], length: 2},
    {name: "anl", args: [DATA_ADDR, A], length: 2},
    {name: "anl", args: [DATA_ADDR, CONSTANT], length: 3},
    {name: "anl", args: [A, CONSTANT], length: 2},
    {name: "anl", args: [A, DATA_ADDR], length: 2},
    {name: "anl", args: [A, AT_R0], length: 1},
    {name: "anl", args: [A, AT_R1], length: 1},
    {name: "anl", args: [A, R0], length: 1},
    {name: "anl", args: [A, R1], length: 1},
    {name: "anl", args: [A, R2], length: 1},
    {name: "anl", args: [A, R3], length: 1},
    {name: "anl", args: [A, R4], length: 1},
    {name: "anl", args: [A, R5], length: 1},
    {name: "anl", args: [A, R6], length: 1},
    {name: "anl", args: [A, R7], length: 1},
    {name: "jz", args: [CODE_ADDR], length: 2},
    {name: "ajmp", args: [CODE_ADDR], length: 2},
    {name: "xrl", args: [DATA_ADDR, A], length: 2}
    {name: "xrl", args: [DATA_ADDR, CONSTANT], length: 3}
    {name: "xrl", args: [A, CONSTANT], length: 2}
    {name: "xrl", args: [A, DATA_ADDR], length: 2}
    {name: "xrl", args: [A, AT_R0], length: 1},
    {name: "xrl", args: [A, AT_R1], length: 1},
    {name: "xrl", args: [A, R0], length: 1},
    {name: "xrl", args: [A, R1], length: 1},
    {name: "xrl", args: [A, R2], length: 1},
    {name: "xrl", args: [A, R3], length: 1},
    {name: "xrl", args: [A, R4], length: 1},
    {name: "xrl", args: [A, R5], length: 1},
    {name: "xrl", args: [A, R6], length: 1},
    {name: "xrl", args: [A, R7], length: 1},
    {name: "jnz", args: [CODE_ADDR], length: 2},
    {name: "acall", args: [CODE_ADDR], length: 2},
    {name: "orl", args: [CODE_ADDR], length: 2},
    {name: "jmp", args: [AT_A, PLUS, DPTR], length: 1},
    {name: "mov", args: [A, CONSTANT], length: 2},
    {name: "mov", args: [DATA_ADDR, CONSTANT], length: 3},
    {name: "mov", args: [AT_R0, CONSTANT], length: 2},
    {name: "mov", args: [AT_R1, CONSTANT], length: 2},
    {name: "mov", args: [R0, CONSTANT], length: 2},
    {name: "mov", args: [R1, CONSTANT], length: 2},
    {name: "mov", args: [R2, CONSTANT], length: 2},
    {name: "mov", args: [R3, CONSTANT], length: 2},
    {name: "mov", args: [R4, CONSTANT], length: 2},
    {name: "mov", args: [R5, CONSTANT], length: 2},
    {name: "mov", args: [R6, CONSTANT], length: 2},
    {name: "mov", args: [R7, CONSTANT], length: 2},
    {name: "sjmp", args: [CODE_ADDR], length: 2},
    {name: "ajmp", args: [CODE_ADDR], length: 2},
    {name: "anl", args: [C, BIT_ADDR], length: 2},
    {name: "movc", args: [A, AT_A, PLUS, PC], length: 1},
    {name: "div", args: [AB], length: 1},
    {name: "mov", args: [DATA_ADDR, DATA_ADDR], length: 3},
    {name: "mov", args: [DATA_ADDR, AT_R0], length: 2},
    {name: "mov", args: [DATA_ADDR, AT_R1], length: 2},
    {name: "mov", args: [DATA_ADDR, R0], length: 2},
    {name: "mov", args: [DATA_ADDR, R1], length: 2},
    {name: "mov", args: [DATA_ADDR, R2], length: 2},
    {name: "mov", args: [DATA_ADDR, R3], length: 2},
    {name: "mov", args: [DATA_ADDR, R4], length: 2},
    {name: "mov", args: [DATA_ADDR, R5], length: 2},
    {name: "mov", args: [DATA_ADDR, R6], length: 2},
    {name: "mov", args: [DATA_ADDR, R7], length: 2},
    {name: "mov", args: [DPTR, CONSTANT], length: 3},
    {name: "acall", args: [CODE_ADDR], length: 2},
    {name: "mov", args: [BIT_ADDR, C], length: 2},
    {name: "movc", args: [A, AT_A, PLUS, DPTR], length: 1},
    {name: "subb", args: [A, CONSTANT], length: 2},
    {name: "subb", args: [A, DATA_ADDR], length: 2},
    {name: "subb", args: [A, AT_R0], length: 1},
    {name: "subb", args: [A, AT_R1], length: 1},
    {name: "subb", args: [A, R0], length: 1},
    {name: "subb", args: [A, R1], length: 1},
    {name: "subb", args: [A, R2], length: 1},
    {name: "subb", args: [A, R3], length: 1},
    {name: "subb", args: [A, R4], length: 1},
    {name: "subb", args: [A, R5], length: 1},
    {name: "subb", args: [A, R6], length: 1},
    {name: "subb", args: [A, R7], length: 1},
    {name: "orl", args: [A, NOT_BIT_ADDR], length: 2},
    {name: "ajmp", args: [CODE_ADDR], length: 2},
    {name: "mov", args: [C, BIT_ADDR], length: 2},
    {name: "inc", args: [DPTR], length: 1},
    {name: "mul", args: [AB], length: 1},
    {name: "reserved", args: [], length: 0},
    {name: "mov", args: [AT_R0, DATA_ADDR], length: 2},
    {name: "mov", args: [AT_R1, DATA_ADDR], length: 2},
    {name: "mov", args: [R0, DATA_ADDR], length: 2},
    {name: "mov", args: [R1, DATA_ADDR], length: 2},
    {name: "mov", args: [R2, DATA_ADDR], length: 2},
    {name: "mov", args: [R3, DATA_ADDR], length: 2},
    {name: "mov", args: [R4, DATA_ADDR], length: 2},
    {name: "mov", args: [R5, DATA_ADDR], length: 2},
    {name: "mov", args: [R6, DATA_ADDR], length: 2},
    {name: "mov", args: [R7, DATA_ADDR], length: 2},
    {name: "anl", args: [C, NOT_BIT_ADDR], length: 2},
    {name: "acall", args: [CODE_ADDR], length: 2},
    {name: "cpl", args: [BIT_ADDR], length: 2},
    {name: "cpl", args: [C], length: 1},
    {name: "cjne", args: [A, CONSTANT, CODE_ADDR], length: 3},
    {name: "cjne", args: [A, DATA_ADDR, CODE_ADDR], length: 3},
    {name: "cjne", args: [AT_R0, CONSTANT, CODE_ADDR], length: 3},
    {name: "cjne", args: [AT_R1, CONSTANT, CODE_ADDR], length: 3},
    {name: "cjne", args: [R0, CONSTANT, CODE_ADDR], length: 3},
    {name: "cjne", args: [R1, CONSTANT, CODE_ADDR], length: 3},
    {name: "cjne", args: [R2, CONSTANT, CODE_ADDR], length: 3},
    {name: "cjne", args: [R3, CONSTANT, CODE_ADDR], length: 3},
    {name: "cjne", args: [R4, CONSTANT, CODE_ADDR], length: 3},
    {name: "cjne", args: [R5, CONSTANT, CODE_ADDR], length: 3},
    {name: "cjne", args: [R6, CONSTANT, CODE_ADDR], length: 3},
    {name: "cjne", args: [R7, CONSTANT, CODE_ADDR], length: 3},
    {name: "push", args: [DATA_ADDR], length: 2},
    {name: "ajmp", args: [CODE_ADDR], length: 2},
    {name: "clr", args: [BIT_ADDR], length: 2},
    {name: "clr", args: [C], length: 1},
    {name: "swap", args: [A], length: 1},
    {name: "xch", args: [A, DATA_ADDR], length: 2},
    {name: "xch", args: [A, AT_R0], length: 1},
    {name: "xch", args: [A, AT_R1], length: 1},
    {name: "xch", args: [A, R0], length: 1},
    {name: "xch", args: [A, R1], length: 1},
    {name: "xch", args: [A, R2], length: 1},
    {name: "xch", args: [A, R3], length: 1},
    {name: "xch", args: [A, R4], length: 1},
    {name: "xch", args: [A, R5], length: 1},
    {name: "xch", args: [A, R6], length: 1},
    {name: "xch", args: [A, R7], length: 1},
    {name: "pop", args: [DATA_ADDR], length: 2},
    {name: "acall", args: [CODE_ADDR], length: 2},
    {name: "setb", args: [BIT_ADDR], length: 2},
    {name: "setb", args: [C], length: 1},
    {name: "da", args: [A], length: 1},
    {name: "djnz", args: [DATA_ADDR, CODE_ADDR], length: 3},
    {name: "xchd", args: [AT_R0], length: 1},
    {name: "xchd", args: [AT_R1], length: 1},
    {name: "djnz", args: [R0, CODE_ADDR], length: 2},
    {name: "djnz", args: [R1, CODE_ADDR], length: 2},
    {name: "djnz", args: [R2, CODE_ADDR], length: 2},
    {name: "djnz", args: [R3, CODE_ADDR], length: 2},
    {name: "djnz", args: [R4, CODE_ADDR], length: 2},
    {name: "djnz", args: [R5, CODE_ADDR], length: 2},
    {name: "djnz", args: [R6, CODE_ADDR], length: 2},
    {name: "djnz", args: [R7, CODE_ADDR], length: 2},
    {name: "movx", args: [A, AT_DPTR], length: 1},
    {name: "ajmp", args: [CODE_ADDR], length: 2},
    {name: "movx", args: [A, AT_R0], length: 1},
    {name: "movx", args: [A, AT_R1], length: 1},
    {name: "clr", args: [A], length: 1},
    {name: "mov", args: [A, DATA_ADDR], length: 2},
    {name: "mov", args: [A, AT_R0], length: 1},
    {name: "mov", args: [A, AT_R1], length: 1},
    {name: "mov", args: [A, R0], length: 1},
    {name: "mov", args: [A, R1], length: 1},
    {name: "mov", args: [A, R2], length: 1},
    {name: "mov", args: [A, R3], length: 1},
    {name: "mov", args: [A, R4], length: 1},
    {name: "mov", args: [A, R5], length: 1},
    {name: "mov", args: [A, R6], length: 1},
    {name: "mov", args: [A, R7], length: 1},
    {name: "movx", args: [AT_DPTR, A], length: 1},
    {name: "acall", args: [CODE_ADDR], length: 2},
    {name: "movx", args: [AT_R0, A], length: 1},
    {name: "movx", args: [AT_R1, A], length: 1},
    {name: "cpl", args: [A], length: 1},
    {name: "mov", args: [DATA_ADDR, A], length: 2},
    {name: "mov", args: [AT_R0, A], length: 1},
    {name: "mov", args: [AT_R1, A], length: 1},
    {name: "mov", args: [R0, A], length: 1},
    {name: "mov", args: [R1, A], length: 1},
    {name: "mov", args: [R2, A], length: 1},
    {name: "mov", args: [R3, A], length: 1},
    {name: "mov", args: [R4, A], length: 1},
    {name: "mov", args: [R5, A], length: 1},
    {name: "mov", args: [R6, A], length: 1},
    {name: "mov", args: [R7, A], length: 1}
  ];


}

Proc8051.prototype = Proc.prototype;

Proc8051.prototype.parseConstant = function(constant) {
  var base = constant.charAt(constant.length-1).toLowerCase();
  var rawConstant = constant.replace(/[^\d]/g, "");
  switch(base) {
    case "h":
      return parseInt(rawConstant, 16);
    case "b":
      return parseInt(rawConstant, 2);
    case "o":
      return parseInt(rawConstant, 8);
    case "d":
    default:
      return parseInt(rawConstant, 10);
  }
  throw new Error("Could not parse constant from "+constant);
};

Proc8051.prototype.getOpcode = function(tokens) {
  if(tokens[0].type != Proc.INSTRUCTION)
    throw new Error("opcodes need instructions first");
  var argc = tokens[0].argc;
  throw new Error("not implemented");
};
