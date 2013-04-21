var express = require('express');

exports.models = require("./models");

exports.createApplication = function(settings) {
  var app = express();

  app.get("/", function(req, res, next) {
    res.send("USER INDEX HERE");
  })

  return app;
}