var http = require('http')
  , app = require('./app')
  , db = require('./lib/db')
  , parsers = require('./lib/parsers')
  , settings = require('./settings')
  , request = require('request')
  , cheerio = require('cheerio')
  , fs = require('fs');

var commands = {
  runserver : runserver,
  syncdb : syncdb,
  scrape : scrape
};

var argv = require('optimist')
      .usage("Usage: manage.js <command> [-opt...]")
      .check(check)
      .argv;

// GO!
run();

function check(argv) {
  if (argv._.length == 0) {
    throw "No command provided.";
  }

  if (commands[argv._[0]] == null) {
    throw argv._[0] + " is not a recognised command."
  }
}

function run() {
  if (null != commands[argv._[0]]) {
    commands[argv._[0]].apply(this, [argv]);
  }
}

function syncdb(options) {
  db.sequelize.sync(options).success(function() {

    // Now run seed methods from modules
    for (var child in settings.apps) {
      var childApp = require(child);
      if (childApp.syncdb != null) {
        childApp.syncdb.apply(childApp, [options]);
      }
    }    
  });
}

function runserver(options) {
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
}

function scrape(options) {
  // get collections...
  //scrapeCategories("http://www.taste.com.au/recipes/collections/");
  //scrapeRecipeList("http://www.taste.com.au/recipes/collections/baking+recipes/1")
  parsers.parseRecipeFromUrl('http://www.taste.com.au/recipes/31037/corn+fritters+with+avocado+salsa+and+bacon', function(recipe) {
    console.log(recipe);
  });
}

function scrapeCategories(url, callback) {
  request(url, function(err, res, body) {
    if (err) {
      throw err;
    }

    $ = cheerio.load(body);

    var categoryUrls = [];

    $(".module.all-recipes .module-content .story-block h3.heading a").each(function(index, el) {
      console.log($(this).attr("href"));
      categoryUrls.push($(this).attr("href"));
    });

    fs.appendFile('category-urls.txt', categoryUrls.join('\n'), function(err) {
      if (err) {
        throw err;
      }

      // If there is a next button, recurse, otherwise, call the callback...
      var next = $(".module.all-recipes .module-content .paging a.next-page").attr("href");

      if (next) {
        scrapeCategories("http://www.taste.com.au" + next, callback);
      } else {
        console.log("NO MORE CATEGORY PAGES");
        if (callback) {
          callback();
        }        
      }
    });
  });
}

function scrapeRecipeList(url, callback) {
  request (url, function(err, res, body) {
    if (err) {
      throw err;
    }

    $ = cheerio.load(body);

    var recipeUrls = [];

    $(".module.in-collections-all .story-block h3.heading a").each(function(index, el) {
      console.log($(this).attr("href"));
      recipeUrls.push($(this).attr("href"));
    });

    fs.appendFile('recipe-urls.txt', recipeUrls.join('\n'), function(err) {
      if (err) {
        throw err;
      }

      // If there is a next button, recurse, otherwise, call the callback...
      var next = $(".module.in-collections-all .paging a.next-page").attr("href");
      console.log("next ", next)
      setTimeout(function() {
        if (next) {
          scrapeRecipeList(next, callback);
        } else {
          console.log("NO MORE RECIPE PAGES");
          if (callback) {
            callback();
          }        
        }        
      }, 5000);      
    });

  });
}