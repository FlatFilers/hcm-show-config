const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Please provide an environment name as an argument');
  process.exit(1);
}

// Get the file name from the command line arguments
let environmentName = process.argv[2];

// Read the JSON file
let data = fs.readFileSync('./src/deploy-helpers/environments.json');
let json = JSON.parse(data);
let environment = json[environmentName];

if (!environment) {
  console.error(
    `No environment found with name '${environmentName}'. Check ./src/deploy-helpers/environments.json and make sure there is a value set.`
  );
  process.exit(1);
}

// Replace the "env" value with the environment variable
const configFilename = '.flatfilerc';

let configData = fs.readFileSync(configFilename);
let configJson = JSON.parse(configData);

// Set the new value
configJson.env = environment;

console.log(
  `> Updating environment for ${environmentName} to ${environment}\n`
);

// Write the JSON back to the file
fs.writeFileSync(configFilename, JSON.stringify(configJson, null, 2));
