const logEvents = require("./logEvents");
const { format } = require("date-fns");
const fs = require("fs");
const path = require("path");
const crc32 = require("crc/crc32");
const { EventEmitter } = require("events");
const DEBUG = true;


const myEmitter = new EventEmitter();
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

const myArgs = process.argv.slice(2);

// Fn to count the number of tokens  
const tokenCount = function () {
  if (DEBUG) console.log("token.tokenCount()");
  return new Promise(function (resolve, reject) {
    fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
      if (error) reject(error);
      else {
        let tokens = JSON.parse(data);
        let count = tokens.length;
        console.log(`Gamers with tokens: ${count}.`);
        myEmitter.emit(
          "log",
          "token.tokenCount()",
          "INFO",
          `Token count: ${count}.`
        );
        resolve(count);
      }
    });
  });
};

// Fn to disp all tokens
function tokenList() {
  if (DEBUG) console.log("token.tokenCount()");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    console.log("** User List **");
    tokens.forEach((obj) => {
      console.log(` * ${obj.username}: ${obj.token}`);
    });
    myEmitter.emit(
      "log",
      "token.tokenList()",
      "INFO",
      `Current token list was displayed.`
    );
  });
}
function newToken(username) {
  let now = new Date();
  let expires = addDays(now, 3);

  let newToken = {
    created: format(now, "yyyy-MM-dd HH:mm:ss"),
    username: username,
    email: "default@gmail.com",
    phone: "9999999999",
    token: crc32(username).toString(16),
    expires: format(expires, "yyyy-MM-dd HH:mm:ss"),
    confirmed: "tbd",
  };

  newToken.created = `${format(now, "yyyy-MM-dd HH:mm:ss")}`;
  newToken.token = crc32(username).toString(16);

  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) {
      console.error("Error reading tokens.json:", error);
      myEmitter.emit(
        "log",
        "token.newToken()",
        "ERROR",
        "Error reading tokens.json."
      );
    }

    let tokens = JSON.parse(data);
    tokens.push(newToken);
    let userTokens = JSON.stringify(tokens);

    fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
      if (err) {
        console.error("Error writing to tokens.json:", err);
        myEmitter.emit(
          "log",
          "token.newToken()",
          "ERROR",
          "Error reading tokens.json."
        );
      }

      console.log(
        `New token ${newToken.token} was created for ${username} expires on ${newToken.expires}.`
      );
    });
  });
}

// fn to manage generating new token
function handleNewTokenResult(error, token) {
  if (error) {
    console.error("Error generating new token:", error);
    document.getElementById("token").textContent = "Error generating token";
  } else {
    console.log("New token generated successfully:", token);
    document.getElementById("token").textContent = token;
  }
}

// Fn  when the form is submitted
function generateToken() {
  var username = document.getElementById("username").value;
  newToken(username, handleNewTokenResult);
}

// Fn to update token record
function updateToken(argv) {
  if (DEBUG) console.log("token.updateToken()");
  if (DEBUG) console.log(argv);
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    tokens.forEach((obj) => {
      if (obj.username === argv[3]) {
        if (DEBUG) console.log(obj);
        switch (argv[2]) {
          case "p":
          case "P":
            obj.phone = argv[4];
            break;
          case "e":
          case "E":
            obj.email = argv[4];
            break;
          default:
        }
        if (DEBUG) console.log(obj);
      }
    });

    userTokens = JSON.stringify(tokens);
    fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
      if (err) console.log(err);
      else {
        console.log(`Token record for ${argv[3]} was updated with ${argv[4]}.`);
        myEmitter.emit(
          "log",
          "token.updateToken()",
          "INFO",
          `Token record for ${argv[3]} was updated with ${argv[4]}.`
        );
      }
    });
  });
}

// Fn to fetch a token for user
var fetchRecord = function (username) {
  if (DEBUG) console.log("token.fetchRecord()");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) console.log(error);
    else {
      let tokens = JSON.parse(data);
      tokens.forEach((obj) => {
        if (obj.username === username) {
          console.log(obj);
          myEmitter.emit(
            "log",
            "token.fetchRecord()",
            "INFO",
            `Token record for ${username} was displayed.`
          );
        }
      });
    }
  });
};

// Fn to search tokems by username, email, or phone
var searchToken = function (username, email, phone) {
  if (DEBUG) console.log("token.searchToken()");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) console.log(error);
    else {
      let tokens = JSON.parse(data);
      tokens.forEach((obj) => {
        if (obj.username === username) {
          console.log(obj);
          myEmitter.emit(
            "log",
            "token.searchToken()",
            "INFO",
            `Token ${obj.token} for ${username} was displayed.`
          );
        } else if (obj.email === email) {
          console.log(obj);
          myEmitter.emit(
            "log",
            "token.searchToken()",
            "INFO",
            `Token ${obj.token} for ${email} was displayed.`
          );
        } else if (obj.phone === phone) {
          console.log(obj);
          myEmitter.emit(
            "log",
            "token.searchToken()",
            "INFO",
            `Token ${obj.token} for ${phone} was displayed.`
          );
        }
      });
    }
  });
};

// Fn to add to a date
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Fn to handle the token CLI options
function tokenApp() {
  if (DEBUG) console.log("tokenApp()");
  myEmitter.emit(
    "log",
    "token.tokenApp()",
    "INFO",
    "token option was called by CLI"
  );

  switch (myArgs[1]) {
    case "--count":
      tokenCount();
      break;
    case "--list":
      tokenList();
      break;
    case "--new":
      newToken(myArgs[2]);
      break;
    case "--upd":
      updateToken(myArgs);
      break;
    case "--fetch":
      fetchRecord(myArgs[2]);
      break;
    case "--search":
      if (myArgs[2] === "u") searchToken(myArgs[3]);
      else if (myArgs[2] === "e") searchToken(null, myArgs[3]);
      else if (myArgs[2] === "p") searchToken(null, null, myArgs[3]);
      break;
    case "--help":
    case "--h":
    default:
      fs.readFile(__dirname + "/views/token.txt", (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
      myEmitter.emit(
        "log",
        "token.tokenApp()",
        "INFO",
        "invalid CLI option, usage displayed"
      );
  }
}

module.exports = {
  tokenApp,
  newToken,
  tokenCount,
  fetchRecord,
  searchToken,
  updateToken,
  generateToken,
};