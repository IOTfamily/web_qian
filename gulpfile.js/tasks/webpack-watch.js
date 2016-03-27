var config = require('../config')
if(!config.tasks.js) return

var webpackConfig = require('../lib/webpack-multi-config')
var gulp          = require('gulp')
var logger        = require('../lib/compileLogger')
var webpack       = require('webpack')
//var browserSync   = require('browser-sync')
var gulpSequence    = require('gulp-sequence')

gulp.task('webpack:watch', function(callback) {
  var initialCompile = false
  var _callback = function(){
      gulpSequence('move');
      callback();
  }

  webpack(webpackConfig('development')).watch(200, function(err, stats) {
    logger(err, stats)
    //browserSync.reload()
    // On the initial compile, let gulp know the task is done
    if(!initialCompile) {
      initialCompile = true
      _callback()
    }
  })
})
