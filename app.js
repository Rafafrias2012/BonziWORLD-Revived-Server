// ===================================================================================
// Server init
//	Server Environment Handler.
//	Options: development, production (anything else will use production)
var server_env = "development";
// ===================================================================================
//	Maintenance & Shutdown Handler
//	Options: maintenance, shutdown, default (anything else will use default)
var server_mode = "default";
// ===================================================================================


const isReplit = false;

// Account stuff
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");

// Filesystem reading functions
const fs = require("fs-extra", "fs");


// Load settings
try {
  stats = fs.lstatSync(__dirname + "/json/settings.json");
} catch (err) {
  // If settings do not yet exist
  if (err.code == "ENOENT") {
    try {
      fs.copySync(__dirname + "/json/settings.example.json", __dirname + "/json/settings.json");
      console.log("Created new settings file.");
    } catch (err) {
      console.log(err);
      throw "Could not create new settings file.";
    }
    // Else, there was a misc error (permissions?)
  } else {
    console.log(err);
    throw "Could not read 'settings.json'.";
  }
}

// Load settings into memory
const settings = require(__dirname + "/json/settings.json");

// Setup basic express server
if (server_mode === "maintenance") {
  var express = require("express");
  var app = express();
  if (settings.express.serveStatic) app.use(express.static(__dirname + "/client/maintenance/themes/win_xp"));
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());
  app.use(cookieParser());
  var server = require("http").createServer(app);
} else if (server_mode === "shutdown") {
  var express = require("express");
  var app = express();
  if (settings.express.serveStatic) app.use(express.static(__dirname + "/client/shutdown/themes/win_xp"));
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());
  app.use(cookieParser());
  var server = require("http").createServer(app);
} else if (server_mode === "default") {
  var express = require("express");
  var app = express();
  if (settings.express.serveStatic) app.use(express.static(__dirname + "/client/www"));
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());
  app.use(cookieParser());
  var server = require("http").createServer(app);
} else {
  var express = require("express");
  var app = express();
  if (settings.express.serveStatic) app.use(express.static(__dirname + "/client/www"));
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());
  app.use(cookieParser());
  var server = require("http").createServer(app);
}

// Init socket.io
var io = require("socket.io")(server, { cors: { origin: ["*"] } });

io.set("transports", ["websocket"]);

if (isReplit === true) {
	var port = 80;
	exports.io = io;
} else {
	var port = process.env.port || settings.port;
	exports.io = io;
}

// Init sanitize-html
var sanitize = require("sanitize-html");

// Init winston loggers (hi there)
const Log = require("./log.js");
Log.init();
const log = Log.log;

// Load ban list
const Ban = require("./ban.js");
Ban.init();

// Start actually listening
server.listen(port, function() {
  console.log("Welcome to BonziWORLD Revived Plus!\n", "Time to meme!\n", "----------------------\n", "HTTPS Server listening at port " + port + "\n", "----------------------Logs----------------------\n");
});
app.use(express.static(__dirname + "/public"));
// ========================================================================
// Helper functions
// ========================================================================

const Utils = require("./utils.js");

// ========================================================================
// The Beef(TM)
// ========================================================================

const Meat = require("./meat.js");
Meat.beat();

// Console commands
const Console = require("./console.js");
Console.listen();
