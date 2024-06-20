const fs = require("fs");
const { initializeApp } = require("./init.js");
const { configApp } = require("./config.js");
const { tokenApp, app } = require("./userToken.js");
const myArgs = process.argv.slice(2);
global.DEBUG = true;

if (DEBUG && myArgs.length > 1) console.log("the myapp.args: ", myArgs);

switch (myArgs[0]) {
  case "init":
  case "i":
    if (DEBUG) console.log(myArgs[0], " - initialize app.");
    initializeApp();
    break;
  case "config":
  case "c":
    if (DEBUG) console.log(myArgs[0], " - disp config file");
    configApp();
    break;
  case "token":
  case "t":
    if (DEBUG) console.log(myArgs[0], " - generate token");
    tokenApp();
    break;
  case "--help":
  case "--h":
  default:
    fs.readFile(__dirname + "/usage.txt", (error, data) => {
      if (error) throw error;
      console.log(data.toString());
    });
}