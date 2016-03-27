/**
 *
 *
 * 弹窗
 * @params title 弹层标题
 * @params temp 自定义内容
 * @params content 弹层内容
 * @params className 弹层样式
 * @params cancel 取消按钮回调
 * @params success 确定按钮回调
 * @params cancel_btn_text 取消按钮文字，默认取消
 * @params loading_text 加载文字，默认 加载中.
 * @params success_btn_text 确定按钮文字，默认 确定
 * @params loading 是否为loading弹层，默认false
 * 
 * @return {
 *    show : show, // 可以传入参数，对现有@params进行修改
 *    hide : hide
 * }
 *
 ***/
 function assign(target) { 
	for (var i = 1; i < arguments.length; i++) { 
		var source = arguments[i]; 
		for (var key in source) { 
			if (Object.prototype.hasOwnProperty.call(source, key)) { 
				target[key] = source[key]; 
			} 
		} 
	} 
	return target; 
}
function Layer(opts){
	opts = opts || {};
	opts.success = opts.success || function(){};
	var obj = document.querySelector(opts.query),

		str = '<div class="layer-inner <@= className || \'\' @>">'
				+'<div class="layer-title"><@= title || \'\' @></div>'
				+'<div class="layer-content"> '
			        +'<div><@= content || \'\' @></div>'
				+'</div>'
                +'<div class="m-border-t">'
				+'<@ if(cancel){ @>'
				+'<div class="layer-btns"><div data-type="cancel" class="m-btn layer-btn"><@= cancel_btn_text || \'取消\' @></div>'
				+'<div class="m-border-r"></div><div data-type="success" class="m-btn layer-btn"><@= success_btn_text || \'确定\' @></div></div>'
				+'<@ }else if(success){ @>'
				+'<div data-type="success" class="m-btn layer-btn"><@= success_btn_text || \'确定\' @></div>'
				+'<@ } @>'
                +'</div>'
			+'</div>',
		loadingstr = '<div class="layer-inner layer-loading"><div class="icon icon-loading"></div><p><@= loading_text || \'加载中.\' @></p></div>',
		te = TE();

	function show(option){
		if(obj){
            if(option){
                opts = assign(opts,option);
            }
			obj.innerHTML = te.render( (opts.temp || str) ,opts);
			obj.classList.remove('close');
			setTimeout(function(){
				obj.classList.remove('hide');
			},100);
		}
	}
	
	function hide(){
		if(obj){
			var inner = obj.querySelector('.layer-inner'),
				state=false;
			function _close(){
				if(state) return;
				obj.classList.add('hide');
				state = true;
				inner.removeEventListener('webkitTransitionEnd',_close,false);
				inner.removeEventListener('oTransitionEnd',_close,false);
				inner.removeEventListener('MSTransitionEnd',_close,false);
				inner.removeEventListener('transitionend',_close,false);
			}
			inner.addEventListener('webkitTransitionEnd',_close,false);
			inner.addEventListener('oTransitionEnd',_close,false);
			inner.addEventListener('MSTransitionEnd',_close,false);
			inner.addEventListener('transitionend',_close,false);
			setTimeout(_close,500);
			obj.classList.add('close');
		}
	}
	function init(){
		if(!obj){
			obj = document.createElement('div');
			obj.className = 'm-layer hide';
			document.body.appendChild(obj);
		}
		str = opts.loading ? loadingstr : str;
		$(obj).tap(function(e){
			e.preventDefault();
			var t = e.target.dataset.type;
			if(t == 'close'){
				hide();
				return;
			}
			if(t == 'success'){
				if(opts._before_success){
					let res = opts._before_success();
					if(!res) return;
				}
				opts.success && opts.success();
				hide();
				return;
			}
			if(t == 'cancel'){
				opts.cancel && opts.cancel();
				hide();
				return;
			}
		})
	}
	init();
	return {
		show : show,
		hide : hide
	}
}
window['Layer'] = Layer; 

if(window['Zepto']['alert']){
	window['Zepto']['alert'] = function(text, title, callbackOk) {
		if (typeof title === 'function') {
	        callbackOk = arguments[1];
	        title = undefined;
	    }

	    return Layer({
	    	title: title || '',
	        content: text || '',
	        success : function(){
	        	callbackOk&&callbackOk()
	        }
	    }).show();
	};
}

if(window['Zepto']['confirm']){
	window['Zepto']['confirm'] = function (text, title, callbackOk, callbackCancel) {
		if (typeof title === 'function') {
	        callbackCancel = arguments[2];
	        callbackOk = arguments[1];
	        title = undefined;
	    }
	    return Layer({
	    	title: title || '',
	        content: text || '',
	        success : function(){
	        	callbackOk&&callbackOk()
	        },
	        cancel : function(){
	        	callbackCancel&&callbackCancel();
	        }
	    }).show();
	};
}
export { Layer }


