// 新版用的ajax
/*
 *
 * 与旧版不同：
 * 1、弹层的不同
 *
 */
import {Layer} from './layer';
import { Domready } from './domready';

var _layer;
window['brd_ajax'] = function(options) {
    if(!_layer){
        _layer = Layer();
    };
    (function(options) {
        var opts = $.extend({
            log: false
        }, options);

        if (opts.before) {
            opts.before(opts);
        }

        var setting = {
            url: opts.url,
            type: opts.type || 'POST',
            data: opts.data,
            success: function(response) {
                if (opts.log) {
                    console.log(response);
                }

                response = JSON.parse(response);

                if (response.result.code == 'OK') {
                    if (opts.success) {
                        opts.success(opts, response);
                    }
                } else if (response.result.code == 'ERR_SYS_SID_INVALID') {
                    //                    $.alert(response.result.msg, function() {
                    location.href = response.data.login_url;
                    //                    });
                } else if (response.result.code == 'ERR_SYS_REPEAT_LOGIN') {
                    location.href = response.data.redirect_url;
                } else if ( response.result.code == 'ERR_SYS_PERMISSION_DENIED' ){
                    $.message({
                        'text': '您没有权限访问此地址'
                    });
                } else {
                    if (opts.error) {
                        opts.error(opts, response);
                    } else {
                        _layer.show({
                            content : response.result.msg
                        });
                        //$.alert(response.result.msg);
                    }
                }
            },
            error: function() {
                if (opts.error) {
                    opts.error(opts, {
                        result: {
                            code: "NO_NETWORK",
                            msg: "貌似没有连接到网络"
                        }
                    });
                } else {
                    $.message({
                        'text': '貌似没有连接到网络'
                    });
                }
            }
        };

        if (opts.processData !== undefined) {
            setting['processData'] = opts.processData;
        }

        if (opts.contentType !== undefined) {
            setting['contentType'] = opts.contentType;
        }

        $.ajax(setting);
    })(options);
};