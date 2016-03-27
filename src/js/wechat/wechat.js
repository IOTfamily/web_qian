/**
 * Created by Powell on 15/9/29.
 */
//配置微信JSSDK

window['wechat'] = {
    //所有的分享平台api，不做平台是否支持判断
    shareApis : function () {
        var shareApis = {
            'onMenuShareTimeline'   : "wx.onMenuShareTimeline",
            'onMenuShareAppMessage' : "wx.onMenuShareAppMessage",
            'onMenuShareQQ'         : "wx.onMenuShareQQ",
            'onMenuShareWeibo'      : "wx.onMenuShareWeibo",
            'onMenuShareQZone'      : "wx.onMenuShareQZone"
        };
        return shareApis;
    },

    //获取要支持api列表
    usedJsApiList : function () {
        var jsApiList = [
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "onMenuShareQQ",
            "onMenuShareWeibo",
            "onMenuShareQZone",
            "chooseImage",
            'previewImage',
            'uploadImage'
        ];
        return jsApiList;
    },

    configWechat : function(appId,timestamp,nonceStr,signature,jsApiList,onReady,OnError) {
        if(jsApiList.length == 0) {
            jsApiList = this.usedJsApiList();
        }

        wx.config({ 
            debug:false,
            appId: appId,
            timestamp:timestamp,
            nonceStr: nonceStr,
            signature: signature,
            jsApiList: jsApiList
        });

        wx.ready(
            onReady
        );

        wx.error(
            OnError
        );
    },

    checkJSApi : function (jsApiList,success) {
        wx.checkJsApi({
            jsApiList: jsApiList,
            success:success
        });
    },

    //shareData内的type来区分分享的平台,多个type用,隔开，如果不传则默认准备所有平台
    shareWithShareData : function (shareData,onFinished,onCancel) {
        shareData['success'] = onFinished;
        shareData['cancel']  = onCancel;
        if(shareData['title'] == null) {
            shareData['title'] = document.title;
        }
        if(shareData['type'] == null || shareData['type'].length == 0) {
            for (var shareApi in this.shareApis()) {
                this.triggerFunction(this.shareApis()[shareApi],[shareData]);
            }
        }else {
            var shareTypes = shareData['type'].split(',');
            for (var shareTypeItem in shareTypes) {
                this.triggerFunction(this.shareApis()[shareTypes[shareTypeItem]],[shareData]);
            }
        }
    },

    //设置OptionMenu的显示状态
    setOptionMenu : function (hidden) {
        if (hidden) {
            wx.hideOptionMenu();
        }else {
            wx.showOptionMenu();
        }
    },

    //隐藏所有非基础按钮接口
    hideAllNonBaseMenuItem : function () {
        wx.AllNonBaseMenuItem();
    },

    //显示所有功能按钮接口
    showAllNonBaseMenuItem: function () {
        wx.showAllNonBaseMenuItem();
    },

    //批量隐藏功能按钮接口
    hideMenuItems : function (menuList) {
        wx.hideMenuItems(menuList);
    },

    //批量显示功能按钮接口
    showMenuItems : function (menuList) {
        wx.showMenuItems({
            menuList:menuList
        });
    },

    //关闭当前网页
    closeWindow : function () {
        wx.closeWindow()
    },

    previewImage : function(imageData) {
        wx.previewImage(imageData);
    },

    //微信内预览图片
    previewLocalImage : function(image_urls) {
        var images = image_urls['urls'];
        if(null == images || images.length == 0) return false;
        var back_ground = document.body.children['previewLocalImage_back_ground'];
        if(null == back_ground) {
            back_ground = $("<div id='previewLocalImage_back_ground' style='width: 100%;height: 100%;position: fixed;z-index: 10;background-color: #333;top: 0;display: block'></div>");
            back_ground.appendTo('body');
            //嵌入图片显示模块
            var image_content_html;
            image_content_html = '<div class="ui-slider" style="height: 100%;">';
            image_content_html +=   '<ul class="ui-slider-content"  id="previewLocalImage_image_content_frame" style="width: 300%;height: 100%;">';
            image_content_html +=    '</ul>';
            image_content_html += '</div>';
            var images_content = $(image_content_html);
            images_content.appendTo('#previewLocalImage_back_ground');
            //背景大小
            var back_ground_size = {
                'width':$('#previewLocalImage_back_ground').width(),
                'height':$('#previewLocalImage_back_ground').height(),
            };
            var currentIndex = 0;
            for (var index = 0;index < images.length ;++index) {
                image_content_html =       '<li id="previewLocalImage_image_content_image_li"' + index + 'style="height: 100%;"><img id="previewLocalImage_image_content_image' + index + '"' + '"></li>';
                var images_content_li = $(image_content_html);

                if(images[index] == image_urls['current']) {
                    currentIndex = index;
                }
                var image_id = "previewLocalImage_image_content_image" + index;
                images_content_li.appendTo('#previewLocalImage_image_content_frame');
                var current_image = $('#'+image_id);
                current_image.attr('src',images[index]);
                current_image.on('load',function(){
                    var image_size = {
                        'width':$(this).width(),
                        'height':$(this).height()
                    };
                    var offset = wechat.centerMargin(image_size,back_ground_size);
                    $(this).parent().css('padding-top',offset.top);
                    $(this).parent().css('padding-left',offset.left);
                })
            }

            var slider = new fz.Scroll('.ui-slider', {
                role: 'slider',
                indicator: true,
                autoplay: false,
            });

            slider.on('beforeScrollStart', function(from, to) {
                // from 为当前页，to 为下一页
                console.log('start');
            })
            slider.options.duration = 0;
            slider.scrollTo(-back_ground_size.width * currentIndex,0,0,0);
            slider.currentPage = currentIndex;
            slider.options.duration = 300;
        }

        back_ground.on('click',function(){
            $(this).remove();
        });

        images_content.on('click',function() {

        });
    },

    //计算一个大小放入一个容器内的margin，top，left,bottom,right,已宽度为基准
    centerMargin : function(size,containnerSize) {
        var offset = {
            'top'       :0,
            'left'      :0,
        };
        if(size.width <= containnerSize.width) {
            offset.left = (containnerSize.width - size.width) / 2;
        }

        if(size.height <= containnerSize.height) {
            offset.top = (containnerSize.height - size.height) / 2;
        }
        return offset;
    },


    //获取微信关注页面地址
    followUrlWithId : function(id) {
        //return 'http://weixin.qq.com/r/NDtxaSvEtnbJrW8K924m';
        wx.scanQRCode({
            needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
//                alert(result);
            }
        });
    },
    //按照方法名调用方法，参数为一个数组
    triggerFunction : function(functionName,parameters) {
        var parameterString = "(";
        for(var i=0;i < parameters.length;i++) {
            parameterString += "parameters["+i+"]";
            parameterString += ',';
        }
        if (parameters.length > 0) {
            parameterString = parameterString.substr(0,parameterString.length - 1);
        }
        parameterString += ")";
        if(functionName.length > 0) {
            eval(functionName+parameterString);
        }
    }
}