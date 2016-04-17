/**
 * Created by lio on 16/4/12.
 */
// zepto,frozen
import './util/zepto.min';
import './util/zepto.cookie';
import './util/zepto.alert';
import './util/tools';

// wechat
//import './wechat/wechat';

import './model/brd_ajax_new'; // brd_ajax reset

import { Domready } from './model/domready';

import { Layer } from './model/layer';

import { startCanvas } from './util/canvas'

Domready(function(){
    let input;
    var invite = document.getElementById('invitePage'),
        submitBtn = invite.querySelector('.submit'),
        ressubmitBtn = document.getElementById('ressubmit'),
        carousel = document.getElementById('carousel');
    var _layer = Layer({
        title:'请输入兑奖吗',
        className : 'layer-password',
        content:'<div><input class="m-border" type="password" id="pay_pass_input" placeholder="请输入邀请码"/></div><i data-type="cancel">X</i>',
        _before_success : function(){
            input = document.querySelector('#pay_pass_input');
            if(!input.value){
                input.classList.add('error');
                input.addEventListener('webkitAnimationEnd',function(){
                    input.classList.remove('error');
                },false);
                return false;
            }
            return true
        },
        success:function(){
            var req = Request();
            _layer.hide();
            return;
            req.ajax({
                url:'',
                type : 'post',
                data : dataObj(),
                success : function(res){
                    var result = eval('('+res+')');
                    result = result.result;
                },
                error:function(){
                    // fail();
                    //失败提示
                }
            })
        }
    });
    //_layer.show();
    //抽到的奖品
    var _resLayer = Layer({
        className : 'search-result',
        content:'<p></p><i data-type="cancel">X</i>',
    });
    submitBtn.addEventListener('click',function(){
        _resLayer.show({
            content:'<p class=""></p><i data-type="cancel">X</i>',
        });
    },false);
    //中奖信息提示
    var getUserInfo =  Layer({
        className : 'user-info',
        content:'<p class="giftInfo"></p><i data-type="cancel">X</i>',
    });
    ressubmitBtn.addEventListener('click',function(){
        getUserInfo.show({
            content:'<p class=""></p><b><span>注：</span>奖品将以邮寄方式送达您手中， 请如实填写以下信息！</b><ul id="uploadUl">' +
            '<li><label for="">真实姓名<input type="text" id="userName"></label></li>' +
            '<li><label for="">联系电话<input type="tel" id="mobile"></label></li>' +
            '<li><label for="">收件地址<input type="text" id="address"></label></li>' +
            '</ul><a id="upInfo"></a><i data-type="cancel">X</i>',
        });
        (function(){
            var upInfo = document.getElementById('upInfo'),
                uploadUl = document.getElementById('uploadUl'),
                userName = uploadUl.querySelector('#userName'),
                mobile = uploadUl.querySelector('#mobile'),
                address = uploadUl.querySelector('#address');
            if(!upInfo){
                return;
            }

            //空值检测
            function checknull(){
                var lis = uploadUl.querySelectorAll('li input');
                for(var i=0;i<lis.length; i++){
                    (function(n){
                        if(lis[n].value == ''){
                            lis[n].classList.add('error');
                            lis[n].addEventListener('webkitAnimationEnd',function(){
                                lis[n].classList.remove('error');
                            },false);
                            return false;
                        }
                    }(i))
                }
                return true;
            }
            //输入格式检测
            function checkFormat(){
                var reg = /^1[0-9]{10}?$/;
                if(!reg.test(mobile.value)){
                    mobile.classList.add('error');
                    mobile.addEventListener('webkitAnimationEnd',function(){
                        mobile.classList.remove('error');
                    },false);
                    return false;
                }
                return true;
            }
            upInfo.addEventListener('click',function(){
                console.log("SUCCESS");
                if(checknull() && checkFormat()){
                    brd_ajax({
                        'url':'',
                        data:{
                            'userName':userName,
                            'mobile':mobile.value,
                            'address':address.value
                        },
                        _before_success : function(){
                            //if(!input.value){
                            //    input.classList.add('error');
                            //    input.addEventListener('webkitAnimationEnd',function(){
                            //        input.classList.remove('error');
                            //    },false);
                            //    return false;
                            //}
                            //return true
                        },
                        success:function(opt,response){
                            console.log(response)
                        },
                        error:function(opt,response){
                            console.log(response)
                        }
                    });
                }
            },false);
        }())
    },false);
    //中奖信息轮播
    (function(){
        var li = carousel.querySelector('li'),
            span = carousel.querySelector('li span');
        setInterval(function(){
            var firstLi = carousel.firstElementChild;
            firstLi.setAttribute('class','top');
            setTimeout(function(){
                carousel.appendChild(firstLi);
                firstLi.removeAttribute('class','top');
            },1600);
        },3000);
    }());

    //转盘cvs
    var cvsObj = startCanvas(),
        ctx = document.getElementById('canvasPan').getContext('2d');
    cvsObj.protoInit();
    cvsObj.drawPan(ctx);
});