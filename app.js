
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , db = require('./lib/db')
  , resource = require('./lib/resource')
  , admin = require('./lib/admin');

var app = express();

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
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/api/recipes', resource(require('./models/recipe')));

  app.use('/admin', admin({
    models : [
      require('./models/recipe'),
      require('./models/user')
    ]
  }))
});

app.configure('development', function(){
  app.use(express.errorHandler());
});




app.get('/', routes.index);
app.get('/users', user.list);
app.post('/users/create', user.create);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});