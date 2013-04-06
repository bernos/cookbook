var _ = require('underscore')
  , viewModels = require('./viewModels');

/**
 * A map of all registered AdminModelConfig objects, indexed by
 * modelName
 */
var registeredAdminModelConfigs = {};

/**
 * Registers a model with the admin module
 * @param {Model} model the model to register
 * @param {AdminModelConfig} adminModelConfig  
 */
exports.registerModel = function(model, adminModelConfig) {
  registeredAdminModelConfigs[adminModelConfig.name] = adminModelConfig;
}

exports.list = function(req,res,next) {
  var modelName = req.params.model;
  var adminModelConfig = registeredAdminModelConfigs[modelName];

  if (!adminModelConfig) {
    return next("Model " + modelName + " not registered with admin module");
  }

  // Find all models of this type
  return adminModelConfig.model.find(function(err, items) {
    if (err) {
      return next(err);
    }

    return res.render("index.jade", new viewModels.ListViewModel(items, adminModelConfig));
  });
}

exports.createGet = function(req, res, next) {

}

exports.createPost = function(req, res, next) {

}

exports.editGet = function(req, res, next) {

  var modelName = req.params.model;
  var adminModelConfig = registeredAdminModelConfigs[modelName];

  if (!adminModelConfig) {
    return next("Model " + modelName + " not registered with admin module");
  }

  return adminModelConfig.model.findById(req.params.id, function(err, item) {
    if (err) {
      return next(err);
    }

    return res.render("edit.jade", new viewModels.EditViewModel(item, adminModelConfig));
  });




  
}

exports.editPost = function(req, res, next) {
  console.log("POSTING ", req.body);
  res.redirect('/admin/Recipe');
}

exports.deleteGet = function(req, res, next) {

}

exports.deletePost = function(req, res, next) {

}



