const path = require('path');
const fs = require('fs/promises');

const pathToFolder = path.join(__dirname, 'secret-folder');

readFolder(pathToFolder);

async function readFolder(pathToFolder) {
  try {
    const files = await fs.readdir(pathToFolder, {withFileTypes: true});
    printInfoAboutFiles(files, pathToFolder);
  } catch (err) {
    console.error(err);
  }
}

function printInfoAboutFiles(files, pathToFolder) {  
  files.forEach(async file => {
    const fullNameFile = file.name;
    const pathToFile = path.join(pathToFolder, fullNameFile);
    if (file.isFile()) {
      const fileInfo = await fs.stat(pathToFile);
      const nameFile = getFileName(fullNameFile);
      const extFile = getFileExt(pathToFile);
      const sizeFile = getSizeFile(fileInfo);
      console.log(nameFile + ' - ' + extFile +' - ' + sizeFile);
    }
  });
}

function getSizeFile(fileInfo) {
  const size = Math.ceil(fileInfo.size / 1024) + ' kb';
  return size;
}

function getFileName(fullName) {
  const nameFile = fullName.split('.')[0];
  return nameFile;
}

function getFileExt(pathToFile) {
  const extFile = path.extname(pathToFile);
  return extFile.split('.').join('');
}