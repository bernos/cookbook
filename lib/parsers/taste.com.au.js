var cheerio = require('cheerio')
  , _ = require('underscore');

module.exports.parseRecipe = function(html, callback) {
  var $ = cheerio.load(html)
    , recipe = {};

  //recipe.html = html;
  recipe.name = $('[itemprop=name]').text();
  recipe.photo = $('[itemprop=photo]').attr('src');
  recipe.summary = $('[itemprop=summary]').text();
  recipe.prepTime = $('[itemprop=prepTime]').text();
  recipe.cookTime = $('td.cookTime em').text();
  //recipe.nutrition
  recipe.instructions = _.map($('.method-tab-content li.methods p.description'), function(el) { return $(el).text(); });
  recipe.yield = $('td.servings em').text();
  recipe.ingredients = _.map($('ul.ingredient-table li span.element'), function(el) { return $(el).text(); });

  if (callback != null) {
    callback.apply(callback, [recipe]);
  }
}