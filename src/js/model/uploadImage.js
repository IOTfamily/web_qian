function random(){
    return Math.floor((Math.random()*1000000000000)).toString(32);
}
function createFrame(){
    var frame = document.createElement('iframe');
    frame.style.cssText = ';width:0;height:0;overflow:hidden;position:absolute;top:-100px;';
    frame.name = 'uploadFrame_'+ random();
    return frame;
}
function createForm(opts){
    var frame = createFrame();
    var form = document.createElement('form');
    form.method = 'post';
    form.enctype = 'multipart/form-data';
    form.style.cssText = 'display:none';
    form.action = opts.url;
    form.name = opts.name || 'uploadForm_' + random();
    form.target = frame.name;
    var inner = '<input type="file" name="'+ (opts.fileName||'file') +'" accept="image/png,image/jpeg,image/gif" capture="camera" />';
    if(opts.multiple){
    	inner = '<input multiple="multiple" type="file" name="'+ (opts.fileName||'file[]') +'" accept="image/png,image/jpeg,image/gif" capture="camera" />';
    }
    if(opts.params){
        for(var key in opts.params){
            inner += '<input type="hidden" name="'+key+'" value="'+ opts.params[key] +'" />'
        }
    }
    form.innerHTML = inner;
    return [frame,form];
}


// 非微信上传
function upload(opts){
    /**
        opts :{
            url : 'form action',
            fileName : 'input name',
            name : 'form name'
            params : {
                param : 'more param',
                param1 : 'more param',
                ...
            },
            callback : function(){}
        }
    **/
    var forms = createForm(opts),
        frame = forms[0],
        form = forms[1],
        fileInput = form.querySelector('input[type=file]'),
        
        event = new MouseEvent('click',{
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
    insert();

    fileInput.addEventListener('change',function(){
        form.submit();
    },false);

    frame.addEventListener('load',function(){
        var inner = frame.contentDocument.documentElement.outerText;

        if(opts.callback){
            opts.callback(inner);
        }
        // setTimeout(function(){
        //     document.body.removeChild(form);
        //     document.body.removeChild(frame);
        // },3000)
    },false)

    function insert(){
        document.body.insertBefore(form,document.body.firstChild);
        document.body.insertBefore(frame,document.body.firstChild);
    }

    fileInput.dispatchEvent(event);
}

// 微信上传
function wx_upload(opts){
	if(!window.wx){
		console.log('wx is not found!');
		return;
	}
	var wx_imgs = {
		localIds : [],
		serverIds : []
	};
	function chooseImage(){
		wx.chooseImage({
		    count: opts.count||1, // 默认1
		    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
		    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		    success: function (res) {
		        wx_imgs.localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
		        
		        // wx_imgs.localIds.map(function(item){
		        // 	var img = document.createElement('img');
		        // 	img.src = item;
		        // 	var div = document.createElement('div');
		        // 	div.className = 'img';
		        // 	div.appendChild(img);
		        // 	document.querySelector('#result').appendChild(div);
		        // })
		        uploadImage();
		    }
		});
	}
	function uploadImage(){
		if(wx_imgs.localIds.length == 0){
			console.log('请选择图片')
			return;
		}
		var i=0,l=wx_imgs.localIds.length;
		function upload(){
			wx.uploadImage({
			    localId: wx_imgs.localIds[i], // 需要上传的图片的本地ID，由chooseImage接口获得
			    isShowProgressTips: 1, // 默认为1，显示进度提示
			    success: function (res) {
			        wx_imgs.serverIds.push(res.serverId);
			        i++;
			        if(i<l){
			        	upload();
			        }else{
			        	opts.callback&&opts.callback(wx_imgs,1);
					}
			    },
			    fail : function(res){
			    	alert(JSON.stringify(res))
			    }
			});
		}
		upload();
	}
	chooseImage();
}


/*
 *
 * 上传图片
 * 1、微信环境下，调用微信上传
 * 2、非微信环境下，调用浏览器上传
 * 
 * @params opts
 *	  *url : 上传url
 *    *callback : 上传成功的回调
 *	  count : 1 微信允许上传的张数，默认1，暂时一次只能上传一张图片
 *	  multiple : multiple,  浏览器上传，是否支持多张，默认 false
 *    type : 1, 后台接口根据type值区分业务，以后可能会改掉
 *    params : 上传时提交的其他参数
 *		 params[name] : value
 *		 params[name1]: value1
 * 
 * @return 
 *	  callback(string)
 *	  callback([string,...])
 *
 */
function UploadImage(opts){
	if(!opts) return;
	let ua = navigator.userAgent,
		is_wx = /micromessenger/i.test(ua) ? true : false;

	if(is_wx){
		wx.checkJsApi({
		    jsApiList: ["uploadImage"], 
		    success: function(res) {
		    	var result = true;
		    	result = res.checkResult['uploadImage'];
		    	if(result){
		    		wx_upload(opts);
		    	}else{
		    		upload(opts);
		    	}
		    }
		});
	}else{
		upload(opts);
	}
}

export { UploadImage }