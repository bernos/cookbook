var express = require('express')
  , routes = require('./routes')
  , AdminModelConfig = require('./lib/AdminModelConfig');

exports = module.exports = function(options) {
	var app = express();
	
	// List
	app.get('/:model', routes.list);

	// Create
	app.get('/:model/create', routes.createGet);
	app.post('/:model', routes.createPost);

	// Edit
	app.get('/:model/:id', routes.editGet);
	app.post('/:model/:id', routes.editPost);

	// Delete
	app.get('/:model/:id/delete', routes.deleteGet);
	app.post('/:model/:id/delete', routes.deletePost);

	app.set('views', __dirname + '/views');

	return app;
}

/**
 * Registers a model with the admin module
 * @param {Model} model the model to register
 * @param {AdminModelConfig} adminModelConfig  
 */
exports.registerModel = function(model, adminModelConfig) {
	if (!adminModelConfig) {
		adminModelConfig = new exports.AdminModelConfig(model);
	}

	routes.registerModel(model, adminModelConfig);
}


exports.modelConfig = function(model, options) {
  return new AdminModelConfig(model, options);
}