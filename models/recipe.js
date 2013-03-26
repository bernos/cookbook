var mongoose = require('mongoose')
	, admin = require('../lib/admin');

var Ingredient = new mongoose.Schema({
	name: {
		type:String,
		required:true
	},

	amount: {
		type:Number
	},

	units: {
		type:String,
		enum:["g","kg","l","ml","tsp","tbsp","cup","piece"]
	}
});

var Recipe = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	createdAt : {
		type: Date,
		default: Date.now
	},

	ingredients : [Ingredient]
});

var RecipeModel = mongoose.model('Recipe', Recipe); 

var adminModelConfig = new admin.AdminModelConfig(RecipeModel);
adminModelConfig.listFields = {
	title : {
		label: "Title"
	},
	createdAt : "Date Created"
}

admin.registerModel(RecipeModel, adminModelConfig);

module.exports = RecipeModel;