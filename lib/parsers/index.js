var request = require('request');

module.exports.parseRecipeFromUrl = function(url, callback) {
  request(url, function(err, res, body) {
    if (err) {
      throw err;
    }

    getParserForUrl(url).parseRecipe(body, function(recipe) {
      if (callback != null) {
        callback.apply(callback, [recipe]);
      }
    });
  });
}

function getParserForUrl(url) {
  return require('./taste.com.au');
}