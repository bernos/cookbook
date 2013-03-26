var express = require('express')
	, _ = require('underscore');


var registeredAdminModelConfigs = {};

exports = module.exports = function(options) {
	var app = express();

	app.get('/:model', function(req,res,next) {

		var adminModelConfig = registeredAdminModelConfigs[req.params.model];

		if (!adminModelConfig) {
			return next("Model " + req.params.model + " not registered with admin module");
		}

		return adminModelConfig.model.find(function(err, items) {
			if (err) {
				return next(err);
			}

			var viewModel = {
				model: adminModelConfig.model,
				schema: adminModelConfig.model.schema,
			};

			// If the model config specifies which fields to display in list
			// view then set up here, otherwise we call toString() on the model
			if (adminModelConfig.listFields != null) {

				viewModel.fields = {};

				_.each(adminModelConfig.listFields, function(v,k) {
					if (typeof v == "string") {
						viewModel.fields[k] = v;
					} else {
						viewModel.fields[k] = v.label;
					}
				});

				viewModel.items  = _.map(items, function(item) {
					var o = {};

					_.each(adminModelConfig.listFields, function(v,k) {
						// v could be a string, in which case we just take the property
						// value indicated by k. If it is an object then we expect
						// that it has a getValue(model) function which will return
						// the field value.
						if (typeof v == "string") {
							o[k] = item[k];
						} else {
							if (typeof v.value == "function") {
								o[k] = v.value(item);
							} else if (v.value != null) {
								o[k] = v.value;
							} else {
								o[k] = item[k];	
							
							}

							
						}						
					});

					return o;
				});
			} else {
				viewModel.fields = { value : adminModelConfig.model.modelName };
				viewModel.items  = _.map(items, function(item) {
					return {
						value : item.toString()
					};
				});
			}			

			return res.render("index.jade", viewModel);
		});
	});


	app.set('views', __dirname + '/views');

	return app;
}

exports.registerModel = function(model, adminModelConfig) {
	if (!adminModelConfig) {
		adminModelConfig = new exports.AdminModelConfig(model);
	}

	registeredAdminModelConfigs[adminModelConfig.name] = adminModelConfig;
}

exports.AdminModelConfig = function(model) {
	this.name  = model.modelName;
	this.model = model;
}