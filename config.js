const fs = require("fs");
const path = require("path");
const { EventEmitter } = require("events");

const configjson = require("./templates").configjson;
const myArgs = process.argv.slice(2);

const DEBUG = true;

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();




// Fn to display config
function displayConfig() {
  if (DEBUG) console.log("config.displayConfig()");
  fs.readFile(path.join(__dirname, "json", "./config.json"), (error, data) => {
    if (error) throw error;
    console.log(JSON.parse(data));
    myEmitter.emit(
      "log",
      "config.displayConfig()",
      "INFO",
      "config.json displayed"
    );
  });
}

// Fn to reset config
function resetConfig() {
  if (DEBUG) console.log("config.resetConfig()");
  const configdata = JSON.stringify(configjson, null, 2);
  fs.writeFile(
    path.join(__dirname, "json", "./config.json"),
    configdata,
    (error) => {
      if (error) throw error;
      if (DEBUG) console.log("Config file reset to original state");
      myEmitter.emit(
        "log",
        "config.resetConfig()",
        "INFO",
        "config.json reset to original state."
      );
    }
  );
}

// Fn to set config
function setConfig() {
  if (DEBUG) console.log("config.setConfig()");
  const args = process.argv.slice(2);
  let match = false;
  fs.readFile(path.join(__dirname, "json", "./config.json"), (error, data) => {
    if (error) throw error;
    if (DEBUG) console.log(JSON.parse(data));
    const cfg = JSON.parse(data);
    for (const key of Object.keys(cfg)) {
      if (key === args[2]) {
        cfg[key] = args[3];
        match = true;
      }
    }
    if (!match) {
      console.log(`invalid key: ${args[2]}, try another.`);
      myEmitter.emit(
        "log",
        "config.setConfig()",
        "WARNING",
        `invalid key: ${args[2]}`
      );
    }
    if (DEBUG) console.log(cfg);
    data = JSON.stringify(cfg, null, 2);
    fs.writeFile(
      path.join(__dirname, "json", "./config.json"),
      data,
      (error) => {
        if (error) throw error;
        if (DEBUG) console.log("Config file successfully updated.");
        myEmitter.emit(
          "log",
          "config.setConfig()",
          "INFO",
          `config.json "${args[2]}": updated to "${args[3]}"`
        );
      }
    );
  });
}

// Fn to handle CLI config
function configApp() {
  if (DEBUG) console.log("configApp()");
  myEmitter.emit(
    "log",
    "config.configApp()",
    "INFO",
    "config option was called by CLI"
  );

  switch (myArgs[1]) {
    case "--show":
      displayConfig();
      break;
    case "--reset":
      resetConfig();
      break;
    case "--set":
      setConfig();
      break;
    case "--help":
    case "--h":
    default:
      fs.readFile(
        path.join(__dirname, "views", "config.txt"),
        (error, data) => {
          if (error) throw error;
          console.log(data.toString());
        }
      );
      myEmitter.emit(
        "log",
        "config.configApp()",
        "INFO",
        "invalid CLI option, usage displayed"
      );
  }
}

module.exports = {
  configApp,
  displayConfig,
  resetConfig,
  setConfig,
  logEvents,
  MyEmitter,
};