var config       = require('../config')
if(!config.tasks.move) return;

var gulp         = require('gulp')
var browserSync  = require('browser-sync')
var handleErrors = require('../lib/handleErrors')
var path         = require('path')
var util         = require('gulp-util');
var chmod        = require('gulp-chmod');


gulp.task('move', function () {
  return gulp.src( config.tasks.move.src + '/**' )
    .on('error', handleErrors)
    .pipe(chmod(777))
    .pipe( gulp.dest(config.tasks.move.dest) );
})
