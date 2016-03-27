
// 理财首页

// zepto,frozen
import './util/zepto.min';
import './util/zepto.cookie';
import './util/zepto.alert';

// wechat
import './wechat/wechat';
import './wechat/brd_wechat';

// tools
import './util/tools';

// common
import './model/common'; // 原common.js

import './model/brd_ajax_new'; // brd_ajax reset 


import { Domready } from './model/domready';

import { Layer } from './model/layer';



import './util/swiper.min';

let allSwiper=[];
function _swiper(id){
	if(!document.querySelector(id)) return;
	var obj = document.querySelector(id),
		wraper = obj.querySelector('.swiper-wrapper'),
		silders = wraper.querySelectorAll('.swiper-slide');

	wraper.style.cssText += ';width:'+ silders.length*100 +'%;'

    if(id=='.project-swiper'){
        new Swiper(id,{
            preventClicks : false,
            preventClicksPropagation : false,
            nextButton:'.swiper-button-next',
            prevButton:'.swiper-button-prev'
        });
    }else{
        new Swiper(id,{
            pagination: '.swiper-pagination',
            paginationClickable: true,
            preventClicks : false,
            preventClicksPropagation : false
        });
    }
}
let resizeTime;
window.addEventListener('resize',function(){
	if(resizeTime) return;
	let items = document.querySelectorAll('.swiper-slide'),w;
	resizeTime = setTimeout( ()=>{
		w = document.body.offsetWidth;
		Array.from(items).map( (item)=>{
			item.style.cssText += ';width:'+w+'px;';
		});
		resizeTime = null;
	} ,10)
},false)

// 利率拆分
function rate(){
	var lows = document.querySelectorAll('.project-swiper .profit');
	lows = Array.prototype.concat.apply([],lows)
	for(var i=0,l=lows.length;i<l;i++){
		var inner = lows[i].innerHTML;
		inner = inner.split('.');
		lows[i].innerHTML = '<span>'+ inner[0] +'</span><i>.'+ inner[1] +'</i>';
	}
}

// 倒计时
function endTime(){
	var times = document.querySelectorAll('.project-swiper span[data-endtime]'),
		last = [],
		done = [],
		timer = null;
	times = Array.prototype.concat.apply([],times);
	for(var i=0,l=times.length;i<l;i++){
		var item = times[i];
		last.push( ( Math.floor(item.dataset.endtime/1000) || 0) );
		done.push( item.dataset.endtime !=0 ? false : true );
	}
	// Array.prototype.concat.apply([],times).map( (item)=>{
	// 	last.push( ( Math.floor(item.dataset.endtime/1000) || 0) );
	// 	done.push( item.dataset.endtime !=0 ? false : true );
	// } )
	function timeformat(n){
		if(n<=0){
			return '已结束'
		}
		if(n<=60){
			return n + '秒后结束';
		}
		var d = Math.floor( n/(24*60*60) ),
			h = Math.floor( n/(60*60) ) - d*24,
			m = Math.floor( (n)/(60) ) -d*24*60 - h*60,
			s = Math.floor( (n -d*24*60*60  - h*60*60 - m*60) );
		h = h < 10 ? '0'+h : h;
		m = m < 10 ? '0'+m : m;
		s = s < 10 ? '0'+s : s;
		if(d>0){
			return d + '天'+ h +'时后结束'
		}
		if( d<=0 && h > 0 ){
			return h + '时' + m + '分'+ '后结束'
		}
		return m + '分' + s + '秒'+ '后结束'
	}

	function run(){
		var count=0;
		for(var index=0,l=times.length;index<l;index++){
			var item = times[index];
			count += last[index];
			last[index] = Math.max(0,--last[index]);
			item.innerHTML = timeformat(last[index]);
			if(last[index] == 0 && !done[index] ) {
				done[index] = true;
				item.parentNode.parentNode.querySelector('.buy').innerHTML = '募集已结束';
				item.parentNode.parentNode.querySelector('.buy').classList.add('done');
			}
		}
		// Array.prototype.concat.apply([],times).map( (item,index)=>{
		// 	count += last[index];
		// 	last[index] = Math.max(0,--last[index]);
		// 	item.innerHTML = timeformat(last[index]);
		// 	if(last[index] == 0 && !done[index] ) {
		// 		done[index] = true;
		// 		item.parentNode.parentNode.querySelector('.buy').innerHTML = '募集已结束';
		// 		item.parentNode.parentNode.querySelector('.buy').classList.add('done');
		// 	}
		// } )
		if(count==0){
			clearInterval(timer);
			timer = null;
		}
	}
	run();
	timer = setInterval(run,1000);
}

// 金额格式化
function moneyformat(){
	var moneys = document.querySelectorAll('span[data-last]');
	moneys = Array.prototype.concat.apply([],moneys);
	for(var i=0,l=moneys.length;i<l;i++){
		var item = moneys[i];
		var n = item.dataset.last;
		item.innerHTML = '剩余金额：' + NumberFormat.formatMoney(n*100,true);
	}
	// Array.prototype.concat.apply([],moneys).map((item)=>{
	// 	var n = item.dataset.last;
	// 	item.innerHTML = '剩余金额(元)：' + NumberFormat.formatMoney(n*100,true);
	// })
}

function handleHeight(){
    if($(document).height() == $(window).height()){
        $('.m-container').css('height',$(document).height()-$('.m-footer').height());
    }
}



_swiper('.topic');
_swiper('.project-swiper');
rate();
endTime();
moneyformat();
handleHeight();
