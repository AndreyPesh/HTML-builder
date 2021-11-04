const path = require('path');
const fs = require('fs/promises');

const pathToFolder = path.join(__dirname, 'files');
const pathToCopyFolder = path.join(__dirname, 'files-copy');

createCopyFolder(pathToCopyFolder);

async function createCopyFolder(pathToCopyFolder) {
  try {
    await fs.mkdir(pathToCopyFolder, {recursive: true});

    const files = await fs.readdir(pathToFolder, {withFileTypes: true});
    const filesInCopy = await fs.readdir(pathToCopyFolder, {withFileTypes: true});

    const arrayFromFilesName = files.map(file => file.name);
    const arrayFromFilesNameInCopy = filesInCopy.map(file => file.name);

    const arrayRemovedFiles = arrayFromFilesNameInCopy.filter(fileName => !arrayFromFilesName.includes(fileName));

    copyFiles(arrayFromFilesName, arrayFromFilesNameInCopy);
    removedFromCopy(arrayRemovedFiles);

  } catch {
    console.log('The folder could not be copied');
  }
}

function copyFiles(arrayFromFilesName, arrayFromFilesNameInCopy) {
  arrayFromFilesName.map(async fileName => {
    const pathToFile = path.join(pathToFolder, fileName);
    const pathToCopyFile = path.join(pathToCopyFolder, fileName);
    const inCopyExist = arrayFromFilesNameInCopy.includes(fileName);

    if (!inCopyExist) {
      await fs.copyFile(pathToFile, pathToCopyFile);
    } else {
      const file = await fs.readFile(pathToFile);
      const inCopyFile = await fs.readFile(pathToCopyFile);
      const isEqualFiles = file.toString() === inCopyFile.toString();
      if(!isEqualFiles) {
        await fs.copyFile(pathToFile, pathToCopyFile);
      }
    }
  });
}

function removedFromCopy(arrayRemovedFiles) {
  arrayRemovedFiles.map(async fileName => {
    const pathToCopyFile = path.join(pathToCopyFolder, fileName);
    await fs.rm(pathToCopyFile);
  });
}
