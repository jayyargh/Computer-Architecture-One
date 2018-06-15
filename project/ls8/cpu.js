/**
 * LS-8 v2.0 emulator skeleton code
 */

// must use 0b in front of binary numbers
// LDI - register immediate
(LDI = 0b10011001),
  // PRN register - pseudo instruction
  (PRN = 0b01000011),
  // HLT - halt the CPU (and exit the emulator)
  (HLT = 0b00000001),
  // MUL - multiplies two registers together and stores result in A
  (MUL = 0b10101010),
  // adds two registers and stores in regA
  (ADD = 0b10101000),
  // bitwise-AND regA and regB, then store the result in regA
  (AND = 0b10110011),
  // calls a subroutine (function) at the address stored in register
  (CALL = 0b01001000),
  // compares values in two registers
  /** If they are equal, set the Equal E flag to 1, otherwise set it to 0.
   * If registerA is less than registerB, set the Less-than L flag to 1, otherwise set it to 0.
   * If registerA is greater than registerB, set the Greater-than G flag to 1, otherwise set it to 0.
   */
  (CMP = 0b10100000),
  // decrement (subtract 1 from) the value in given register
  (DEC = 0b01111001),
  // divide value A by value B, store in regA
  (DIV = 0b10101011),
  // increment (add 1 to) the value in given register
  (INC = 0b01111000),
  // interrupt number stored in given register
  (INT = 0b01001010),
  // return from interrupt handler
  /**
   * Registers R6-R0 are popped off the stack in that order.
   * The FL register is popped off the stack.
   * The return address is popped off the stack and stored in PC.
   * Interrupts are re-enabled
   */
  (IRET = 0b00001011),
  (JEQ = 0b01010001),
  (JNE = 0b01010010),
  (JMP = 0b0101);

const FLAG_EQUAL = 0;
const FLAG_GREATER = 1;
const FLAG_LESS = 2;

const SP = 7;
const IS = 6;
const IM = 5;

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {
  /**
   * Initialize the CPU
   */
  constructor(ram) {
    this.ram = ram;
    // creates 8 bit ram with 8 registers and fills with 0's
    this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
    // Special-purpose registers
    this.PC = 0; // Program Counter
    this.FL = 0;
    this.reg[SP] = 0xf4; // stack pointer
  }

  /**
   * Store value in memory address, useful for program loading
   */
  poke(address, value) {
    this.ram.write(address, value);
  }

  /**
   * Starts the clock ticking on the CPU
   */
  startClock() {
    this.clock = setInterval(() => {
      this.tick();
    }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
  }

  /**
   * Stops the clock
   */
  stopClock() {
    clearInterval(this.clock);
  }

  /**
   * ALU functionality
   *
   * The ALU is responsible for math and comparisons.
   *
   * If you have an instruction that does math, i.e. MUL, the CPU would hand
   * it off to it's internal ALU component to do the actual work.
   *
   * op can be: ADD SUB MUL DIV INC DEC CMP
   */
  alu(op, regA, regB) {
    switch (op) {
      case 'MUL':
        // access the registers and multiply together
        // this.reg[regA] *= this.reg[regB];
        // 0xff prevents anything over 255 bits
        this.reg[regA] *= this.reg[regB] & 0xff;
        break;

      case 'CMP':
        this.compare(regA, regB);
        break;

      default:
        console.log(`Error`);
    }
  }

  /**
   * Advances the CPU one cycle
   */
  tick() {
    // Load the instruction register (IR--can just be a local variable here)
    // from the memory address pointed to by the PC. (I.e. the PC holds the
    // index into memory of the instruction that's about to be executed
    // right now.)

    // !!! IMPLEMENT ME
    const IR = this.ram.read(this.PC);

    // Debugging output
    // console.log(`${this.PC}: ${IR.toString(2)}`);

    // Get the two bytes in memory _after_ the PC in case the instruction
    // needs them.

    // get the next two bytes after the PC to check for instructions
    const operandA = this.ram.read(this.PC + 1);
    const operandB = this.ram.read(this.PC + 2);

    // Execute the instruction. Perform the actions for the instruction as
    // outlined in the LS-8 spec.

    // !!! IMPLEMENT ME
    switch (IR) {
      // LDI sets the value of a register to an integer
      case LDI:
        // Set the value in a register
        this.reg[operandA] = operandB;
        // this.PC += 3; // Next instruction
        break;

      // PRN is a pseudo-instruction that prints the numeric value stored within a register
      case PRN:
        // Retrieve the value of the register
        console.log(this.reg[operandA]);
        // this.PC += 2; // the machine code is two bytes
        break;

      // MUL will multiply two registers together using ALU
      case MUL:
        // access ALU method 'MUL'
        this.alu('MUL', operandA, operandB);
        break;

      // HLT - halt the CPU (and exit the emulator)
      case HLT:
        // stop the process
        this.stopClock();
        break;

      // case PUSH:
      //   this.reg[SP]--;
      //   this.ram.write(this.reg[SP], this.reg[operandA]);
      //   break;

      case JMP:
        this.PC = this.reg[operandA]; // set PC to address set in reg
        break;

      case CMP:
        this.alu('CMP', operandA, operandB);
        break;

      case JEQ:
        if (this.getFlag(FLAG_EQUAL)) {
          this.PC = this.reg[operandA];
          incrementPC = false;
        }
        break;

      default:
        console.log('Unknown instruction: ' + IR.toString(2));
        this.stopClock();
        return;
    }

    // Increment the PC register to go to the next instruction. Instructions
    // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
    // instruction byte tells you how many bytes follow the instruction byte
    // for any particular instruction.

    // !!! IMPLEMENT ME
    const instLen = (IR >> 6) + 1;
    this.PC += instLen;
  }

  compare(regA, regB) {
    const equal = +(this.reg[regA] === this.reg[regB]);
    const greater = +(this.reg[regA] > this.reg[regB]);
    const less = +(this.reg[regA] < this.reg[regB]);
  }
}

module.exports = CPU;
