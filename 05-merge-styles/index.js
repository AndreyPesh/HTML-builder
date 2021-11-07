const path = require('path');
const fs = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');

const pathToFiles = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist/bundle.css');
const writeStream = createWriteStream(pathToBundle, { flags: 'w' });

async function readFiles(folder) {
  try {
    const files = await fs.readdir(folder, { withFileTypes: true });
    filesHandler(files);
  } catch (error) {
    console.log(error.message);
  }
}

readFiles(pathToFiles);

async function filesHandler(files) {
  let isExistFiles = false;
  files.forEach(file => {
    const fileName = file.name;
    const isCssType = fileName.match(/\.(css)$/);
    if (file.isFile() && isCssType) {
      isExistFiles = true;
      const pathToFile = path.join(__dirname, `styles/${fileName}`);
      const readStream = createReadStream(pathToFile);
      readStream.on('data', (data) => {
        writeStream.write(data);
      });
    }
  });
  if (!isExistFiles) {
    await fs.rm(pathToBundle);
  }
}