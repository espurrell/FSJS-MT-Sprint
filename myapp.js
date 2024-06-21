const fs = require("fs"); // File system
const { initializeApp } = require("./init.js");// Initialize app
const { configApp } = require("./config.js");// Config app
const { tokenApp, app } = require("./token.js");  // Generate token
const myArgs = process.argv.slice(2); // Get command line args
global.DEBUG = true;// Debug mode

if (DEBUG && myArgs.length > 1) console.log("the myapp.args: ", myArgs); // Debug

switch (myArgs[0]) { // Switch on first arg
  case "init":
  case "i":
    if (DEBUG) console.log(myArgs[0], " - initialize app."); // Debug
    initializeApp();
    break;
  case "config":
  case "c":
    if (DEBUG) console.log(myArgs[0], " - disp config file"); // Debug
    configApp();
    break;
  case "token":
  case "t":
    if (DEBUG) console.log(myArgs[0], " - generate token"); // Debug
    tokenApp();
    break;
  case "--help":
  case "--h":
  default:
    fs.readFile(__dirname + "/usage.txt", (error, data) => { // Read usage file
      if (error) throw error;
      console.log(data.toString());
    });
}