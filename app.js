
var express = require('express')
  , flash = require('connect-flash')
  , passport = require('passport')
  , path = require('path')
  , resource = require('./lib/resource')
  , settings = require('./settings');

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));

  //app.use('/api/recipes', resource(require('./lib/recipes/models')));

  // Mount apps in settings
  for(var child in settings.apps) {
    app.use(settings.apps[child], require(child).createApplication());
  }
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

