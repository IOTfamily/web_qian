var config       = require('../config');
var path = require('path');
var fs = require('fs');

var paths = {
	  src: path.join(config.root.src, config.tasks.jade.src, '/*.' + config.tasks.jade.extensions),
	  dest: path.join(config.root.dest, config.tasks.jade.dest),
	  data : path.join(config.root.data,'')
	}
function createPageList(){
  var files = fs.readdirSync(paths.dest);
  var str = '<ul>';
  files.forEach(function(item){
    str += '<li><a href="'+ (config.tasks.jade.dest+'/'+item) +'">'+ item +'</a></li>'
  })
  str += '</ul>';
  var file = fs.openSync(path.join(config.root.dest, (config.tasks.browserSync.index||'__main__.html') ),'w+');
  fs.writeSync(file,str);
  fs.closeSync(file);
}

module.exports= createPageList;