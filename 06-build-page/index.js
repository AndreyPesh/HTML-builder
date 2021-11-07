const path = require('path');
const fs = require('fs/promises');
const { rm } = require('fs');
const { createWriteStream, createReadStream } = require('fs');

const pathToProjectFolder = path.join(__dirname, 'project-dist');
const pathToIndexFile = path.join(__dirname, 'project-dist/index.html');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');

const pathToFiles = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist/style.css');
const writeStream = createWriteStream(pathToBundle, { flags: 'w' });

const initPathToFolder = path.join(__dirname, 'assets');
const initPathToCopyFolder = path.join(__dirname, 'project-dist/assets');

let template = '';

createFolder(pathToProjectFolder);

templateHandler(pathToTemplate);
readFilesStyle(pathToFiles);
remove(initPathToFolder, initPathToCopyFolder);


async function templateHandler(pathToTemplate) {
  try{
    template += await fs.readFile(pathToTemplate);
    const listTags = searchTagInTemplate(template);
    const listComponents = getNamesComponents(listTags);
    await replaceComponentsInTemplate(listComponents, listTags);
    writeTemplateInDist(template);
  } catch(error) {
    console.log(error.message);
  }

}

function replaceComponentsInTemplate(listComponents, listTags) {
  return new Promise((resolve, reject) => {
    try{
      listComponents.forEach(async (componentName, index) => {
        const tagName = listTags[index];
        const componentContent = await fs.readFile(pathToComponents + `/${componentName}.html`);
        replaceComponent(componentContent, tagName);
        if (index == listComponents.length - 1) {
          setTimeout(() => resolve(), 800);
        }
      });
    } catch(error) {
      console.log(error);
      reject();
    }
  });
}

function replaceComponent(componentContent, tagName) {
  const content = componentContent.toString();
  const tag = tagName;
  template = template.replace(tag, content);
  
}

function searchTagInTemplate(template) {
  if(!template) {
    return;
  }
  const tags = template.match(/(\{\{[a-zA-Z]+\}\})/g);
  return tags;
}

function getNamesComponents(tags) {
  const components = tags.map(tag => {
    return tag.slice(2, tag.length - 2);
  });
  return components;
}

async function writeTemplateInDist(template) {
  const indexFile = await fs.open(pathToIndexFile, 'w');
  indexFile.write(template);
}

async function createFolder(pathToFolder) {
  await fs.mkdir(pathToFolder, {recursive: true});
}


async function readFilesStyle(folder) {
  try {
    const files = await fs.readdir(folder, { withFileTypes: true });
    filesHandler(files);
  } catch (error) {
    console.log(error.message);
  }
}

async function filesHandler(files) {
  let isExistFiles = false;
  files.forEach(file => {
    const fileName = file.name;
    const isCssType = fileName.match(/\.(css)$/);
    if (file.isFile() && isCssType) {
      isExistFiles = true;
      const pathToFile = path.join(__dirname, `styles/${fileName}`);
      const readStream = createReadStream(pathToFile);
      readStream.pipe(writeStream);
    }
  });
  if (!isExistFiles) {
    await fs.rm(pathToBundle);
  }
}

async function remove(pathToFolder, pathToCopyFolder) {
  rm(pathToCopyFolder, { recursive: true }, () => createCopyFolder(pathToFolder, pathToCopyFolder));
}

async function createCopyFolder(pathToFolder, pathToCopyFolder) {
  try {

    const files = await fs.readdir(pathToFolder, { withFileTypes: true });
    await fs.mkdir(pathToCopyFolder, { recursive: true });

    files.forEach(async file => {
      if (file.isDirectory()) {
        createCopyFolder(`${pathToFolder}/${file.name}`, `${pathToCopyFolder}/${file.name}`);
        return;
      } else {
        await copyFiles(`${pathToFolder}/${file.name}`, `${pathToCopyFolder}/${file.name}`);
        return;
      }
    });
  } catch (error) {
    console.log('The folder could not be copied\n', error.message);
  }
}

async function copyFiles(pathToFolder, pathToCopyFolder) {
  try {    
    await fs.copyFile(pathToFolder, pathToCopyFolder);
  } catch (error) {
    console.log('Can\'t copy file! ', error.message);
  }
}