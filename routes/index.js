var fs = require('fs');
var path = require('path');
var config = require('../gulpfile.js/config.json');




function test(req,res){
	var data = fs.readFileSync(path.resolve(__dirname,'../data/a.json'),'utf-8');
	var cb = req.query.callback || false;
	if(cb){
		res.jsonp(JSON.parse(data))
	}else{
		res.send(data)
	}
}
function dealRecord(req,res){
    var data = fs.readFileSync(path.resolve(__dirname,'../data/deal_record.json'),'utf-8');
    var cb = req.query.callback || false;
    if(cb){
        res.jsonp(JSON.parse(data))
    }else{
        res.send(data)
    }
}


function read(name){
	return function(req,res){
		var data = fs.readFileSync(path.resolve(__dirname,name),'utf-8');
	    var cb = req.query.callback || false;
	    setTimeout(function(){
	    	if(cb){
		        res.jsonp(JSON.parse(data))
		    }else{
		        res.send(data)
		    }
	    },2000)
	}
}


module.exports = function(app) {
	app.get('/test',test);

    app.post('/deal_record', read('../data/deal_record.json'));

    app.post('/invest_records', read('../data/invest_records.json'));
    app.post('/invest', read('../data/invest.json'));
    app.post('/invest_lists', read('../data/invest_lists.json'));

	app.get('*/*',function(req,res){
		var _path = path.join(__dirname , '../', config.root.dest ,req.path);
		if(/\.ico/.test(req.path)){
			res.send('');
			return
		}
		console.log(_path)
		var files = fs.readdirSync(_path);
		var str = '<ul>';
		files.forEach(function(item){
			str += '<li><a href="'+ path.join( req.path  , item) +'">'+ item +'</a></li>'
		})
		str += '</ul>';
		res.send(str);
	})
}