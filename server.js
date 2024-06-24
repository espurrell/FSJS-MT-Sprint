const express = require("express"); // Import the express library
const bodyParser = require("body-parser"); // Import the body-parser library
const { newToken, tokenCount } = require("./token"); // Import the newToken and tokenCount functions
const fs = require("fs"); //    Import the fs library
const path = require("path"); // Import the path library

const app = express(); // Create a new express application
const PORT = process.env.PORT || 3000; // Set the port

// parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.render("index"); // Render the EJS file
});
app.use(express.static("public"));
// Logging middleware
app.use((req, res, next) => {
  const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;

  // Log to console
  console.log(logMessage);

  // Log to file
  fs.appendFile(path.join(__dirname, "logs/access.log"), logMessage, (err) => {
    if (err) {
      console.error("Error appending to access log:", err);
    }
  });

  next();
});
// Serve static files from the 'public' directory
app.use(express.static("public"));

// Logging middleware
app.use((req, res, next) => {
  const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;

  // Log to console
  console.log(logMessage);

  // Log to file
  fs.appendFile(path.join(__dirname, "logs/access.log"), logMessage, (err) => {
    if (err) {
      console.error("Error appending to access log:", err);
    }
  });

  next();
});

// Route handler for GET requests to "/new"
app.get("/new", (req, res) => {
  res.render("newusertoken", { message: "" }); 
});

// Route handler for POST requests to "/new"
app.post("/new", (req, res) => {
  const username = req.body.username;
  newToken(username, (error, theToken) => {
    if (error) {
      console.error("Error generating token:", error);
      res.status(500).send("Error generating token");
    } else {
      // Render the newusertoken template with the message
      res.render("newusertoken", { message: `Token was created for ${username}: ${theToken}` });
    }
  });
});

// Route handler for GET requests to "/count"
app.get("/count", async (req, res) => {
  try {
    const theCount = await tokenCount();
    res.render("count", { tokenCount: theCount });
  } catch (error) {
    console.error("Error fetching token count:", error);
    res.status(500).send("Error fetching token count");
  }
});

// Route handler for GET requests to "/"
app.get("/", (req, res) => {
  res.render("index"); // Render the index.ejs template
});

app.get("/update", (req, res) => {
  res.render("update");
});

app.post("/update", (req, res) => {
  const username = req.body.username;
  const field = req.body.field.toUpperCase(); // Convert field to uppercase
  const value = req.body.value;

  // Call your updateToken function to update the token
  updateToken(username, field, value, (error) => {
    if (error) {
      console.error("Error updating token:", error);
      res.status(500).send("Error updating token");
    } else {
      res.send(`Token record for ${username} was updated with ${value}.`);
    }
  });
});

app.get("/update", (req, res) => {
  res.render("update");
});

app.post("/update", (req, res) => {
  const username = req.body.username;
  const field = req.body.field.toUpperCase(); // Convert field to uppercase
  const value = req.body.value;

  // Call your updateToken function to update the token
  updateToken(username, field, value, (error) => {
    if (error) {
      console.error("Error updating token:", error);
      res.status(500).send("Error updating token");
    } else {
      res.send(`Token record for ${username} was updated with ${value}.`);
    }
  });
});

// Error handling for sending files
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});