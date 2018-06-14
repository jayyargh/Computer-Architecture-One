// add fs to read commands from command line to read/write/open files
const fs = require('fs');
const RAM = require('./ram');
const CPU = require('./cpu');

/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory(filename) {
  // Hardcoded program to print the number 8 on the console

  const content = fs.readFileSync(filename, 'utf-8');

  const lines = content.trim().split(/[\r\n]+/g);

  program = [];

  for (let line of lines) {
    // parsing as binary number
    const val = parseInt(line, 2);
    // if it is not a number, skip
    if (isNaN(val)) {
      continue;
    }
    // otherwise push to program array
    program.push(val);
  }

  // Load the program into the CPU's memory a byte at a time
  for (let i = 0; i < program.length; i++) {
    cpu.poke(i, parseInt(program[i], 2));
  }
}

/**
 * Main
 */
// check to make sure user properly entered `node ls8 <filename>`
if (process.argv.length != 3) {
  console.error(
    'Please enter the correct ls8 filename in this format: node ls8 <filename>'
  );
  process.exit(1);
}

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

// process.argv[2] = filename
loadMemory(cpu, process.argv[2]);

cpu.startClock();
