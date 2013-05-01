var parsers = require('../parsers')
  , models = require('./models');

exports.index = function(req, res, next) {
  models.Recipe.findAll({ where: { UserId: req.user.id } }).success(function(recipes) {
    res.render('index', {
      title: "Recipes",
      recipes: recipes,
      addUrl: req.app.route + "/add",
      recipeUrl: function(recipeId) {
        return req.app.route + '/' + recipeId;
      }
    })
  });
}

exports.detail = function(req, res, next) {
  models.Recipe.find(req.params.id).success(function(recipeModel) {
    parsers.parseRecipeFromUrl(recipeModel.url, function(recipe) {


      if (recipeModel.UserId != req.user.id) {
        // Recipe is not owned by this user
        console.log("recipe is not owned by currently logged in user ("+req.user.id+"). It is owned by user " + recipeModel.UserId);
        next();
      } else {
        res.render('detail', {
          title : recipe.name,
          recipe : recipe,
          indexUrl : req.app.route + "/"
        });
      }      
    });
  });
}

exports.add = function(req, res, next) {
  if (req.body.u != null) {
    parsers.parseRecipeFromUrl(req.body.u, function(recipe) {
      models.Recipe.create({ url: req.body.u, name: recipe.name, UserId: req.user.id }).success(function(recipe) {
        res.redirect(req.app.route + '/' + recipe.id);
      });
    });
  } else {
    res.render('add', {
      title: 'enter a recipe url'
    });
  }  
}