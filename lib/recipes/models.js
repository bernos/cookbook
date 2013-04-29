var db = require('../db')
	, user = require('../user');

exports.Recipe = db.sequelize.define('Recipe', {
  url: db.DataTypes.STRING,
  name: db.DataTypes.STRING
});

user.models.User.hasMany(exports.Recipe);

/*
var mongoose = require('mongoose')
	, admin = require('../admin');

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

	trueOrFalse : Boolean,

	buff : Buffer,

	ingredients : [Ingredient],

	comments: [{ body: String, date: Date }],

	meta : {
		votes:Number,
		favs:Number
	}
});

var RecipeModel = mongoose.model('Recipe', Recipe); 

var adminModelConfig = admin.modelConfig(RecipeModel, {
	listFields : {
		title : "TITLE",
		createdAt : "Date created"
	},
	excludedFields : [
		'meta.votes',
		'meta.favs'
	]
});

admin.registerModel(RecipeModel, adminModelConfig);

module.exports = RecipeModel;
*/