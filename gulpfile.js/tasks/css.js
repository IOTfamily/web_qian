var config       = require('../config')
if(!config.tasks.css) return

var gulp         = require('gulp')
var browserSync  = require('browser-sync')
var sass         = require('gulp-sass')
var sourcemaps   = require('gulp-sourcemaps')
var handleErrors = require('../lib/handleErrors')
var autoprefixer = require('gulp-autoprefixer')
var path         = require('path')
var sprite = require('gulp-css-spriter')

var paths = {
  src: path.join(config.root.src, config.tasks.css.src, '/*.{' + config.tasks.css.extensions.join(',') + '}' ),
  dest: path.join(config.root.dest, config.tasks.css.dest)
}
gulp.task('css', function () {
  return gulp.src(paths.src)
    .pipe(sourcemaps.init())
    .pipe(sass(config.tasks.css.sass))
    .on('error', handleErrors)
    //.pipe(autoprefixer(config.tasks.css.autoprefixer))
    // .pipe(sprite({
    //   'spriteSheet': path.join(config.root.dest,config.tasks.images.dest,config.tasks.sprite.name),
    //   'pathToSpriteSheetFromCSS': '../'+path.join(config.tasks.images.dest,config.tasks.sprite.name)
    // }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.reload({stream:true}))
})
