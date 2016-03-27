

// 理财详情页
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
import { Footermodal } from './model/footer_modal';


// 理财购买切换
function project_buy(){
	// let obj = document.querySelector('.project-buy');
	// if(!obj) return;
	// let	tags = obj.querySelectorAll('.title li'),
	// 	content = obj.querySelector('.content'),
	// 	current = 0;
	// function change(n){
	// 	if(n == current) return;
	// 	tags[current].classList.remove('active');
	// 	current = n;
	// 	tags[current].classList.add('active');
	// 	var per = current ? '-50' : 0;
	// 	content.style.cssText += ';-webkit-transform:translate3d('+per+'%,0,0);transform:translate3d('+per+'%,0,0);'
	// }
	// tags = Array.prototype.concat.apply([],tags);
	// for(let i=0,l=tags.length;i<l;i++){
	// 	tags[i].addEventListener('click', ()=> change(i) ,false)
	// }
	// Array.from(tags).map( (item,index)=>{
	// 	item.addEventListener('click', ()=> change(index) ,false)
	// })
}



// 利率拆分
function rate(){
	let obj = document.querySelector('em.rate');
	if(!obj) return;
	let rate = obj.dataset.rate*1;
	if(!rate) return;
	let n = (''+rate).split('.');
	let s =  n[0] + '<span>.'+ (n[1]||0) +'</span><i>%</i>';
	obj.innerHTML = s;
}
Domready(function(){
	//project_buy();
	rate();
});


// 理财购买 框，柱状图联动
import { project_bar } from './model/echarts_bar';


// 支付密码弹层
// funds 金额,本金金额
// type 购买类别，1=借款购买，2=本金购买
// cb 回调
let _layer;
function layer_pay_pass(funds,fundingId){
	if(!_layer){
		let input;
		_layer =  Layer({
		    title : '请输入支付密码',
		    className : 'layer-password',
		    content : '<p></p><div><input class="m-border" type="password" id="pay_pass_input" placeholder="支付密码默认与登录密码相同"  /></div>',
		    _before_success : function(){
				input = document.querySelector('#pay_pass_input');
				if(!input.value){
					input.classList.add('error');
					input.addEventListener('webkitAnimationEnd',function(){
						input.classList.remove('error');
					},false)
					return false;
				}
				return true
		    },
		    success : function(){
		        input = document.querySelector('#pay_pass_input');
	        	proudct_buy&&proudct_buy({
	        		fundingId : input.dataset.fundingId,
	        		funds : input.dataset.funds,
	        		password : input.value
	        	})
		    },
		    cancel : function(){

		    }
		});
	}
	_layer.show({
		content : '<p>￥'+(funds||0)+'</p><div><input class="m-border" type="password" name="pay_pass_input" id="pay_pass_input" data-funds="'+funds+'" data-funding-id="'+(fundingId||0)+'" placeholder="支付密码默认与登录密码相同"  /></div>'
	})
}

// 本金购买
function buy_direct(){
	if(!document.querySelector('.direct-buy')) return;
	let item = document.querySelector('.direct-buy'),
		checkbox = item.querySelector('input[type=checkbox]'),
		isCheck = true,
		buy = item.querySelector('.buy'),
		msg = item.querySelector('.buy em'),
		input = item.querySelector('input[data-last]'),
		inputplaceholder = input.getAttribute('placeholder'),
		btn = item.querySelector('button'),
		currentState = false;
	(function(){
		input.onfocus = function(){
			this.style.fontSize = '0.8rem';
			this.removeAttribute('placeholder');
		}
		input.onblur = function(){
			if (input.value) {
				this.style.fontSize = '0.8rem';
			}else{
				this.style.fontSize = '0.42667rem';
				this.setAttribute('placeholder',inputplaceholder);
			}
		}
	}());
	function change(opt){
		if(!opt.status){
			msg.innerHTML = opt.msg;
			buy.classList.add('error');
			btn.disabled = true;
			currentState = false;
			buy.classList.add('m-error-border');
		}else{
			buy.classList.remove('error');
			buy.classList.remove('m-error-border');
			msg.innerHTML = '';
			currentState = true;
			if(isCheck){
				btn.disabled = false;
			}
		}
		if(opt.value == 0 || !opt.value){
			btn.disabled = true;
			currentState = false;
		}
		opt.value = opt.value || 0;
		btn.dataset.money = opt.value;
	}
	checkbox.addEventListener('change',function(){
		if(checkbox.checked){
			isCheck = true;
			checkbox.classList.remove('clearborder');
			if(currentState && isCheck){
				btn.disabled = false;
				return;
			}
		}else{
			isCheck = false;
			checkbox.classList.add('clearborder');
			btn.disabled = true;
		}
	},false)
	// 购买按钮
	$(btn).tap(function(){
		_hmt.push(['_trackEvent', '详情页预约购买', 'click']);
		if(!input.value || btn.disabled){
			return;
		}
		layer_pay_pass(input.value,input.dataset.fundingId);
	})
	buy_input(input,change);
}


// 借款购买
function buy_borrow(){

	if(!document.querySelector('.loan-buy')) return;
	let item = document.querySelector('.loan-buy'),
		checkbox = item.querySelector('input[type=checkbox]'),
		borrow_number = item.querySelector('ul li span.borrow_number'),
		isCheck = true,
		buy = item.querySelector('.buy'),
		msg = item.querySelector('.buy em'),
		input = item.querySelector('input[data-last]'),
		btn = item.querySelector('button'),
		currentState = false;
	function change(opt){
		console.log(opt)
		if(!opt.status){
			msg.innerHTML = opt.msg;
			buy.classList.add('error');
			btn.disabled = true;
			currentState = false;
			buy.classList.add('m-error-border');
		}else{
			buy.classList.remove('error');
			buy.classList.remove('m-error-border');
			msg.innerHTML = '';
			currentState = true;
			if(isCheck){
				btn.disabled = false;
			}
		}
		if(opt.value == 0 || !opt.value){
			btn.disabled = true;
			currentState = false;
		}
		opt.value = opt.value || 0;
		borrow_number.innerHTML = '￥' + (opt.value*input.dataset.value);
		btn.dataset.money = opt.value;
	}
	checkbox.addEventListener('change',function(){
		if(checkbox.checked){
			isCheck = true;
			checkbox.classList.remove('clearborder');
			if(currentState && isCheck){
				btn.disabled = false;
				return;
			}
		}else{
			isCheck = false;
			checkbox.classList.add('clearborder');
			btn.disabled = true;
		}
	},false)
	// 购买按钮
	$(btn).tap(function(){
		_hmt.push(['_trackEvent', '详情页预约购买', 'click']);
		if(!input.value || btn.disabled){
			return;
		}
		layer_pay_pass(input.value,input.dataset.fundingId);
	})
	buy_input(input,change);
}


// 购买input验证
function buy_input(obj,cb){
	if(!obj){
		return;
	}
	let last = obj.dataset.last*1,//账户余额
		borrow = obj.dataset.borrow*1,//配资余额
		canbuy = obj.dataset.canbuy*1;//产品余额
	function change(e){
		let v = obj.value;
		if(!v){
			return cb({
					status : 1,
					value : 0
				})
		}
		v = v.replace(/([^0-9\.]){0,}|(\,)/g,'');
		v = parseInt(v) || 0;
		
		if( v < min_invest ){
			cb({
				status : 0,
				value : v,
				msg : min_invest + '元起投'
			})
		}else{

			if(!isNaN(borrow)){
				if(  ( v <= borrow  && v <= last ) || (!borrow && v <= last) ){
					cb({
						status : 1,
						value : v
					})
				}
			}else{
				if( v <= last ){
					cb({
						status : 1,
						value : v
					})
				}
			}
			if( (v - min_invest)%invest_step != 0 ){
				cb({
					status : 0,
					value : v,
					msg : min_invest + '元起投，'+ invest_step +'元倍增'
				})
			}
			if(!isNaN(borrow)){
				if(v > borrow){
					cb({
						status : 0,
						value : v,
						// msg : '已超出最大借款额：'+borrow
						msg : '已超出最大借款额'
					})
				}
			}
			if( v > last){
				cb({
					status : 0,
					value : v,
					// msg : '已超出余额：'+last
					msg : '已超出余额'
				})
			}

			if (v > canbuy) {
				cb({
					status : 0,
					value : v,
					msg : '已超出产品余额'
				})
			}
		}
		obj.value = v;
	}
	obj.addEventListener('input',change,false);
	obj.addEventListener('change',change,false);
	obj.addEventListener('propertychange',change,false);
	change();
}

function back_top(){
    var $backBtn = $('.backTop'),
        scrollPos,
        windowHeight;
    $(window).scroll( function() {
        scrollPos = $(window).scrollTop();
        windowHeight = $(window).height();
        if(scrollPos > windowHeight){
            $backBtn.removeClass('hidden');
        }else{
            $backBtn.addClass('hidden');
        }
    });
    $backBtn.on('touchstart',function(){
        window.scrollTo(0, 0);
    });
}



Domready(function(){
	buy_borrow();
	buy_direct();
    back_top();
})


// 项目进度
function project_progress(per){
	let obj = document.querySelector('.progress');
	if(!obj) return;
	let current = obj.querySelector('.current'),
		point = obj.querySelector('.point'),
		span = point.querySelector('.number span'),
		range = [0.1,0.9],
		fixed;
	per = (parseFloat(per||0)||0).toFixed(4);
	fixed = per*(range[1]-range[0]) + range[0];

	span.innerHTML = '进度'+ (per*100).toFixed(2) +'%';
	current.style.cssText += ';width:'+fixed*100+'%';
	point.style.cssText += ';left:'+fixed*100+'%';
}
window['project_progress'] = project_progress;


// 投资详情，翻屏效果
function project_scroll(){
	let obj = document.querySelector('.project');
	if(!obj) return;
	let content = document.querySelector('.project-desc'),
		title = content.querySelector('.title'),
		height;

	function init(){
		content.style.cssText += ';height:'+ (title.offsetHeight+200) + 'px;overflow:hidden;';
		height = document.body.offsetHeight;
	}
	function scroll(e){
		
	}
	window.addEventListener('scroll',scroll,false)
	init();
}
Domready(function(){
	//project_scroll();
})



