var config       = require('../config')
if(!config.tasks.jade) return

var gulp         = require('gulp')
var browserSync  = require('browser-sync')
var jade         = require('gulp-jade')
var data         = require('gulp-data')
var fs			 = require('fs')
var handleErrors = require('../lib/handleErrors')
var path         = require('path')

var paths = {
  src: path.join(config.root.src, config.tasks.jade.src, '/*.' + config.tasks.jade.extensions),
  dest: path.join(config.root.dest, config.tasks.jade.dest),
  data : path.join(config.root.data,'')
}

// // 读取所有的json ，生成一个大json，传递给jade
// var files = fs.readdirSync(paths.data);
// var json = {};
// files.forEach(function(item){
// 	var _data = fs.readFileSync(path.resolve(__dirname,'../../',paths.data,item),'utf-8');
// 	_data = JSON.parse(_data);
// 	json = Object.assign(json,_data);
// })



gulp.task('jade', function () {
  return gulp.src(paths.src)
  	// .pipe(data(function(){
  	// 	return json;
  	// }))
    .pipe(jade(config.tasks.jade.jade))
    .on('error', handleErrors)
    .pipe(gulp.dest(paths.dest))
    
    .pipe(browserSync.reload({stream:true}))
})
