'use strict';

// 旧版页面js
 
var domready = require('./model/domready');

require('./model/viewpoint');

require('./util/tools');

function setHeader(){
	var obj = document.querySelector('.ui-header'),
		h,
		body= document.querySelector('body'),
		index = document.querySelector('.index-btns'),
		wh = document.documentElement.clientHeight;

	if(obj){
		h = obj.offsetHeight;
		body.style.cssText += ';padding-top:'+h+'px;height:'+(wh-h)+'px';
	}
	if(index){
		if(obj){
			wh = wh-h;
		}
		index.style.cssText += ';height:'+wh+'px';
	}
	
}

domready(function(){
	setHeader();
})