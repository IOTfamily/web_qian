var config       = require('../../config')
if(!config.tasks.move) return;

var gulp         = require('gulp')
var browserSync  = require('browser-sync')
var handleErrors = require('../../lib/handleErrors')
var path         = require('path')
var util         = require('gulp-util');


gulp.task('moveToProject', function () {
  
  return gulp.src( config.tasks.move.src + '/rev-manifest.json' )
    .on('error', handleErrors)
    .pipe( gulp.dest(config.tasks.move.dest) );
   
})
