const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(pathToFile);

stream.setEncoding('utf-8');

stream.on('data', (data) => {
  console.log(data);
});

stream.on('error', error => console.log(error));
