var express = require("express")
  , routes = require("./routes")
  , models = require("./models")
  , auth = require("../auth");

module.exports.createApplication = function(options) {
  var app = express();

  app.set('views', __dirname + '/views');

  app.get("/", auth.requiresLogin(), routes.index);
  app.get("/add", auth.requiresLogin(), routes.add);
  app.post("/add", auth.requiresLogin(), routes.add);
  app.get("/:id", auth.requiresLogin(), routes.detail);

  return app;
}