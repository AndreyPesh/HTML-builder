const path = require('path');
const { createWriteStream } = require('fs');
const readline = require('readline');
const process = require('process');

const pathToFile = path.join(__dirname, 'text.txt');

const writeStream = createWriteStream(pathToFile, {flags: 'a+'});
const readStream = readline.createInterface({input: process.stdin});

writeStream.on('ready', () => console.log('Input line: '));

readStream.on('line', lineHandler);

process.on('SIGINT', () => {
  closeWriteStream();
});

function lineHandler(line) {
  try {
    if (line === 'exit') {
      closeWriteStream();
      return;
    }

    writeLineToFile(line);

  } catch(error) {
    console.error(error.message);
  }
}

function writeLineToFile(line) {
  writeStream.write(line + '\n');
}

function closeWriteStream() {
  sayEndInput();
  readStream.close();
}

function sayEndInput() {
  console.log('\nInput completed!');
}
