const path = require('path');
const fs = require('fs/promises');
const readline = require('readline');
const process = require('process');

const pathToFile = path.join(__dirname, 'text.txt');
const readStream = readline.createInterface({input: process.stdin});

init(pathToFile);

readStream.on('line', lineHandler);

process.on('SIGINT', () => {
  closeReadStream();
});

async function init(path) {
  await fs.open(path, 'a');
  console.log('Input line: ');
}

function lineHandler(line) {
  try {
    if (line === 'exit') {
      closeReadStream();
      return;
    }

    writeLineToFile(line);

  } catch(error) {
    console.error(error.message);
  }
}

async function writeLineToFile(line) {
  await fs.appendFile(pathToFile, line + '\n');
}

function closeReadStream() {
  sayEndInput();
  readStream.close();
}

function sayEndInput() {
  console.log('\nInput completed!');
}
