var express = require('express');


exports = module.exports = function(model, options) {




	model.schema.eachPath(function(name, type) {
		console.log(name, "::")
	});


	var app = express();

	/**
	 * Get all
	 */
	app.get('/', function(req, res, next) {
		return model.find(function(err, items) {
			if (err) {
				return next(err);
			}
			return res.send(items);
		});
	});

	/**
	 * Get by ID
	 */
	app.get('/:id', function(req, res, next) {
		return model.findById(req.params.id, function(err, item) {
			if (err) {
				return next(err);
			}
			return res.send(item);
		});
	});

	/**
	 * Create
	 */
	app.post('/', function(req, res, next) {
		var item = new model(req.body);



		return item.save(function(err) {
			if (err) {
				return next(err);
			}
			return res.send(item);
		});
	});

	/**
 	 * Updated
 	 */
	app.put('/:id', function(req, res, next) {
		return model.findById(req.params.id, function(err, item) {
			if (err) {
				return next(err);
			}

			for(var n in req.body) {
				item[n] = req.body[n];
			}

			item.save(function(err) {
				if (err) {
					return next(err);
				}
				return res.send(item);
			})
		});
	});

	/**
	 * Delete
	 */
	app.delete("/:id", function(req, res, next) {
		return model.findById(req.params.id, function(err, item) {
			if (err) {
				return next(err);
			}

			item.remove(function(err) {
				if (err) {
					return next(err);
				}
				return res.send('');
			})
		});
	});


	return app;
}