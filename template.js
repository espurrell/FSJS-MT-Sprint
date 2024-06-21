const folders = ["models", "views", "routes", "logs", "json"];

const configjson = {
  name: "MT Project CLI",
  version: "1.0.0",
  description: "The Command Line Interface (CLI) for the MT Project",
  main: "index.js",
  superuser: "postgres",
  database: "mtdb",
};

const tokenjson = [
  {
    created: "1969-01-31 12:30:00",
    username: "username",
    email: "email@email.com",
    phone: "7097699196",
    token: "token",
    expires: "1969-02-03 12:30:00",
    confirmed: "tbd",
  },
];

module.exports = {
  folders,
  configjson,
  tokenjson,
};