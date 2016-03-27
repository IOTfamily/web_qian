var config = require('../config')
var gulp   = require('gulp')
var path   = require('path')
var watch  = require('gulp-watch')
var chmod        = require('gulp-chmod');
var handleErrors = require('../lib/handleErrors')

gulp.task('watch', ['server','browserSync'], function() {
  var watchableTasks = ['fonts', 'iconFont', 'images', 'svgSprite','jade', 'css']

  watchableTasks.forEach(function(taskName) {
    var task = config.tasks[taskName]
    if(task) {
      var filePattern = path.join(config.root.src, task.src, '**/*.{' + task.extensions.join(',') + '}')
      watch(filePattern, function(){
      	gulp.start(taskName);

        gulp.src( config.tasks.move.src + '/**' )
        .on('error', handleErrors)
        .pipe(chmod(777))
        .pipe( gulp.dest(config.tasks.move.dest) )
        
      })
    }
  })
})
