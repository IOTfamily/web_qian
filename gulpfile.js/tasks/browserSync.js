var browserSync = require('browser-sync')
var config      = require('../config')
var gulp        = require('gulp')
var path        = require('path')
var chmod        = require('gulp-chmod');
var handleErrors = require('../lib/handleErrors')

gulp.task('browserSync', function() {
  return browserSync(config.tasks.browserSync)
})
