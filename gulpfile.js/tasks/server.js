var compress = require('compression')
var config   = require('../config')
var express  = require('express')
var gulp     = require('gulp')
var gutil    = require('gulp-util')
var logger   = require('morgan')
var open     = require('open')
var path     = require('path')
var route    = require(path.resolve(process.cwd(), config.root.route));

var settings = {
  root: path.resolve(process.cwd(), config.root.dest),
  port: config.express.port || 5000,
  logLevel: process.env.NODE_ENV ? 'combined' : 'dev',
  staticOptions: {
    extensions: ['html'],
    maxAge: '31556926'
  }
}

gulp.task('server', function(){
  var url = 'http://localhost:' + settings.port;

  var app = express();

    app.use(compress())
    app.use(logger(settings.logLevel))
    app.use('/', express.static(settings.root, settings.staticOptions));

    route(app);

    app.listen(settings.port)

  gutil.log('server started on ' + gutil.colors.green(url))
  //open(url)
})
