const fs = require('fs');
const path = require('path');

// Create a directory if it doesn't exist
const createDirectory = dirPath => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Create the module structure
const moduleCreator = moduleName => {
  const modulePath = path.join(__dirname, '../..', 'src', 'modules', moduleName); // Adjusted for your folder structure
  console.log('Resolved module path:', modulePath);

  const directories = ['controllers', 'models', 'routes', 'services', 'validations'];

  // Create main module directory and its subdirectories
  createDirectory(modulePath);
  directories.forEach(dir => createDirectory(path.join(modulePath, dir)));

  //make module index.js file
  fs.writeFileSync(
    path.join(modulePath, 'index.js'),
    `const ${moduleName}Controller = require("./controllers/${moduleName}Controller");
const ${moduleName}Model = require("./models/${moduleName}Model");
const ${moduleName}Routes = require("./routes/${moduleName}Routes");
const ${moduleName}Service = require("./services/${moduleName}Service");
const ${moduleName}Validation = require("./validations/${moduleName}Validation");

module.exports = {
  ${moduleName}Controller,
  ${moduleName}Model,
  ${moduleName}Routes,
  ${moduleName}Service,
  ${moduleName}Validation,
};
`
  );

  // Create the necessary files
  const files = {
    controllers: `${moduleName}Controller.js`,
    models: `${moduleName}Model.js`,
    routes: `${moduleName}Routes.js`,
    services: `${moduleName}Service.js`,
    validations: `${moduleName}Validation.js`,
  };

  Object.entries(files).forEach(([folder, fileName]) => {
    fs.writeFileSync(
      path.join(modulePath, folder, fileName),
      `// ${fileName.replace('.js', '')} code\n`
    );
  });

  console.log(`Module ${moduleName} created successfully!`);
};

// Get module name from command line arguments
const moduleName = process.argv[2];
if (!moduleName) {
  console.error('Please provide a module name.');
  process.exit(1);
}

moduleCreator(moduleName);
