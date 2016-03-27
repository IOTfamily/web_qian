/**
 * Created by Powell on 15/10/3.
 */

;(function($){
    //配置保人贷相关,这里定义和保人待相关的操作
    wechat.configWechat(appId,timestamp,nonceStr,signature,[
        // 所有要调用的 API 都要加到这个列表中
        "chooseImage",
        'onMenuShareAppMessage',
        'onMenuShareTimeline',
        'scanQRCode',
        'showMenuItems',
        'previewImage',
        'uploadImage'
    ],function() {
        //初始隐藏所有非基础菜单
        wechat.setOptionMenu(true);
        //读取单独页面的配置信息
        if(typeof(__brd_wechat_config) != "undefined") {
            var __brd_wechat_config_showWechatShare = __brd_wechat_config['__brd_wechat_config_showWechatShare'];
            if(__brd_wechat_config_showWechatShare) {
                //配置菜单显示按钮
                var __brd_wechat_config_showMenuList = __brd_wechat_config['__brd_wechat_config_showMenuList'];
                if(typeof(__brd_wechat_config_showMenuList) == "undefined") {
                    __brd_wechat_config_showMenuList = ['menuItem:share:appMessage'];
                }
                wechat.showMenuItems(__brd_wechat_config_showMenuList);

                //配置分享内容
                var __brd_wechat_config_shareData = __brd_wechat_config['__brd_wechat_config_shareData'];
                if(__brd_wechat_config_shareData != null) {
                    brd_wechat_shareData(__brd_wechat_config_shareData,__brd_wechat_config_shareData['onShareFinish'],__brd_wechat_config_shareData['onShareCancel'],true);
                }
            }

            var onReady = __brd_wechat_config['__brd_wechat_config_ready'];
            if(onReady != null) {
                onReady();
            }
        }
    });
})(window.Zepto);


window['brd_wechat_shareData'] = function(shareData,onFinished,onCancel,hideHintImage) {
    if(is_wx_browser == 0) {
        $.alert('请在微信中打开');
    }else {
        if(!hideHintImage) {
            brd_wechat_showShareHintImage();
        }

        if(shareData['imgName'] != null) {
            shareData['imgUrl'] = img_host +'/Public/m/assets/img/' + shareData['imgName'];
        }
        //加入默认分享图标
        if(shareData['imgUrl'] == null) {
            shareData['imgUrl'] = img_host +'/Public/m/assets/img/logo_120x120.jpg';
        }

        //判断有无传入回调
        if(onFinished == null) {
            if(typeof(__brd_wechat_config) != "undefined") {
                if(__brd_wechat_config['__brd_wechat_config_share_success'] != null) {
                    onFinished = __brd_wechat_config['__brd_wechat_config_share_success'];
                }
            }
        }
        if(onCancel == null) {
            if(typeof(__brd_wechat_config) != "undefined") {
                if(__brd_wechat_config['__brd_wechat_config_share_cancel'] != null) {
                    onCancel = __brd_wechat_config['__brd_wechat_config_share_cancel'];
                }
            }
        }
        wechat.shareWithShareData(shareData,onFinished,onCancel);
    }
};

window['brd_wechat_showShareHintImage'] = function() {
    if (is_wx_browser == 1) {
        showHintImage('/Public/m/assets/img/icon_mask.png');
    } else {
        $.alert('请在微信中使用此功能');
    }
}

window['brd_wechat_showQrImageAfter'] = function(element) {
    var img_url = img_host + '/Public/m/assets/img/brd_qrcode.jpg';

    var el = $('#'+element).after('<img id="qr_image">');
    if (is_wx_browser == 1) {
        el.after('<div><small class="ui-txt-gray">点击二维码，然后长按识别二维码进行关注</small></div>');
    } else {
        el.after('<div><small class="ui-txt-gray">请使用微信扫描二维码进行关注</small></div>');
    }

    $('#qr_image').attr('src',img_url);
    $('#qr_image').attr('width','100%');

    $('#qr_image').on('click',function(){
        if (is_wx_browser == 1) {
            wechat.previewImage({
                current: img_url, // 当前显示图片的http链接
                urls: [img_url] // 需要预览的图片http链接列表
            });
        }
    });
};