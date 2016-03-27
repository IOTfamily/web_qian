
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
import './util/dropload';
// common
import './model/common'; // 原common.js

import './model/brd_ajax_new'; // brd_ajax reset 


import { Domready } from './model/domready';

import { Layer } from './model/layer';


function dealRecord(){
    // dropload
    var _date = '2000-01-01 00:00:00', positionArr = [];
    var dropload = $('#deal-record').dropload({
        scrollArea: window,
        domDown: {
            domClass: 'dropload-down',
            domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
            domUpdate: '<div class="dropload-update">↓释放加载</div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
        },
        loadDownFn: function loadDownFn(me) {
            loadmore(me);
        }
    });
    
    function hideNoResultPage(){
        $('.deal-record').removeClass('hidden');
        $('#no_result').addClass('hidden');
    }
    function showNoResultPage(msg){
        $('#deal-record').addClass('hidden');
        $('#no_result').removeClass('hidden');
    }
    function showLoading(){
    }
    function hideLoading(){
    }
    var first = true;
    function transform(repay_list, list_id){
        var result = '';
        if (repay_list && repay_list.length) {
            for (var i = 0; i < repay_list.length; i++) {
                var item = repay_list[i],time = item.opt_time,dateStr;
                var prevTime = isEqual(time, _date) || first ? time : _date;
                first = false;
                dateStr = isEqual(time, _date) ? '' : '<li class="date unread">' +
                                                        '<p class="first">'+getYearAndMonth(time)+'</p>' +
                                                        '<p class="second">'+getYearAndMonth(time)+'</p>' +
                                                        '<p class="absolute">'+getYearAndMonth(prevTime)+'</p></li>';
                _date = time;
                result += dateStr +
                        '<li class="item '+ (item.opt == 0 ? 'income' : '') +'">'+
                            '<div class="left">'+
                                '<p>'+(item.opt == 0 ? '收' : '支')+'</p>'+
                            '</div>'+
                            '<div class="right">'+
                                '<p class="part01 clearfix">' +
                                    '<span>'+(item.opt == 0 ? '+' : '-')+item.opt_funds+'</span>' +
                                    '<span>'+formatDate(time)+'</span>' +
                                '</p>'+
                                '<p class="part02">' +
                                    '<span>'+item.type+'</span>' +
                                    '<span>－'+item.opt_desc+'</span>' +
                                '</p>'+
                            '</div>'+
                        '</li>';
            }
        }
        return result;
    }
    function isEqual(date1,date2){
        return getYearAndMonth(date1) == getYearAndMonth(date2);
    }
    function getYearAndMonth(date){
        var time = new Date(date.replace(/-/g,'/')).getTime(),
            year = new Date(time).getFullYear(),
            month = new Date(time).getMonth() + 1;
        return year + '年' + month + '月';
    }
    function formatDate(date){
        var time = new Date(date.replace(/-/g,'/')).getTime(),
            month = new Date(time).getMonth() + 1,
            day = new Date(time).getDate(),
            hours = new Date(time).getHours(),
            minutes = new Date(time).getMinutes();
        return plusZero(month) + '/' + plusZero(day) + ' ' + plusZero(hours) + ':' + plusZero(minutes);
    }
    function plusZero(params){
        return (params > 9 ? params : '0' + params);
    }
    function refresh(){
        getInvestList(1,page_size);
    }
    function loadmore(me){
        getInvestList(page_index,page_size,me);
    }
    function getInvestList(page,psize,me) {
        if (page == 1) {
            showLoading();
        }
        brd_ajax({
            url:_url,
            data:{page:page,page_size:psize},
            success:function(opts,response) {
                var result = transform(response.data.records);
                if(result != ''){
                    if(page==1){
                        //$('#deal-record ul').html('');
                    }
                    $('#deal-record ul').append(result);
                    hideNoResultPage();
                    page_index=page+1;
                }else{
                    if(page==1){
                        showNoResultPage('暂无交易记录，去发现更多财富');
                    }
                    dropload.lock();
                    dropload.noData();
                    me.resetload();
                    return;
                }
                getPositionArr();
                //控制加载更多
                if($('#deal-record li.item').length < (page_index-1)*page_size){
                    dropload.lock();
                    dropload.noData();
                }
                if(me){ 
                    me.resetload();
                }
                hideLoading();
            },
            error:function(opts,response) {
                hideLoading();
                if(me){ me.resetload();}
                if(page>1){
                    $.message({
                        'text':response.result.msg
                    });
                }else{
                    showNoResultPage(response.result.msg);
                }
            }
        });
    }
    //getPositionArr();
    function getPositionArr(){
        $.each($('.date.unread'),function(index,item){
            positionArr.push($(item).offset().top);
            $(item).removeClass('unread');
        })
    }
    var headHeight = $('.m-header').height(),
        dateHeight = $('.date').height(),
        initPosition = 0,
        currentPosition = 0;
    $(window).scroll( function() {
        var scrollPos = $("body").scrollTop() || $("html").scrollTop();
        //scroll(scrollPos);
    });
    $('body').on('touchstart', function(){
        initPosition = $("body").scrollTop() || $("html").scrollTop();
    });
    $('body').on('touchmove', function(){
        var scrollPos = $("body").scrollTop() || $("html").scrollTop();
        currentPosition = scrollPos;
        //scroll(scrollPos);
    });
    function scroll(scrollPos){
        var i,top,dateTop = scrollPos+headHeight+dateHeight, bodyTop = scrollPos+headHeight;
        top = initPosition > currentPosition ? bodyTop : dateTop;
        isScroll = true;
        $.each(positionArr, function(index, item){
            if(top > item){
                i = index;
            }
        });
        if(initPosition > currentPosition){
            if(bodyTop > positionArr[i]){
                $('.absolute').eq(i+1).show();
                $('.second').eq(i+1).css({position:'absolute', top: 0});
            }
            if(bodyTop + dateHeight < positionArr[i+1]){
                $('.second').eq(i).css({position: 'fixed',top: headHeight}).show();
                $('.absolute').eq(i+1).hide();
            }
        }
        else{
            if(positionArr[i] < dateTop &&  dateTop < positionArr[i] + dateHeight){
                $('.absolute').eq(i).show();
                $('.second').eq(i).css({position:'absolute', top: 0});
                $('.second').eq(i-1).css({position:'absolute', top: 0});
            }
            if(dateTop >= positionArr[i]+ dateHeight){
                $('.second').eq(i).css({position:'fixed', top:headHeight}).show();
                $('.absolute').eq(i+1).hide();

            }
        }
    }
    $('body').on('touchend', function(){
        initPosition =  $("body").scrollTop() || $("html").scrollTop();
        //scroll(initPosition);
    });
    var isScroll = false;
    function run(){
        currentPosition = $("body").scrollTop() || $("html").scrollTop();
        if(currentPosition != initPosition){
            scroll(currentPosition);
            isScroll = true;
        }else{
            if(isScroll){
                setTimeout(function(){scroll(currentPosition);},0)
                isScroll=false;
            }
        }
        requestAnimationFrame(run);
    }
    //run()
    
}

Domready(function(){
    dealRecord();
});



