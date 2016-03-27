
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

let Date_Format = function(t,fmt){
        let time = new Date(t);
        if(!time) return '';
        var o = {
            "M+" : time.getMonth()+1,                 //月份
            "d+" : time.getDate(),                    //日
            "h+" : time.getHours(),                   //小时
            "m+" : time.getMinutes(),                 //分
            "s+" : time.getSeconds(),                 //秒
            "q+" : Math.floor((time.getMonth()+3)/3), //季度
            "S"  : time.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (time.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    };

function recordDropload() {
    // dropload
    var _m;
    var dropload = $('#invest_record_list').dropload({
        scrollArea: window,
        domDown: {
            domClass: 'dropload-down',
            domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
            domUpdate: '<div class="dropload-update">↓释放加载</div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
        },
        loadDownFn: function loadDownFn(me) {
            _m = me;
            loadmore(me);
        }
    });
    function hideNoResultPage() {
        $('#pid_noresult').removeClass('hidden').addClass('hidden');
        $('.invest-record').removeClass('hidden');
        $('#no_result').addClass('hidden');
    }
    function showNoResultPage(msg) {
        $('#pid_noresult').removeClass('hidden');
        $('.invest-record').removeClass('hidden').addClass('hidden');
        $('#no_result').removeClass('hidden');
    }
    function showLoading() {
        $('.ui-loading-block').removeClass('show');
        $('.ui-loading-block').addClass('show');
    }
    function hideLoading() {
        $('.ui-loading-block').removeClass('show');
    }
    function transform(repay_list, list_id) {
        var result = '';
        if (repay_list && repay_list.length) {
            for (var i = 0; i < repay_list.length; i++) {
                result += '<li class="loan clearfix">' +
                '<div class="list-item">' +
                (repay_list[i]["is_loan"] == 1 ? '<p style="background-color: #ff8706">借</p>' : '<p style="background-color: #2882f8">直</p>') +
                '</div>' +
                '<div class="list-item">'+ repay_list[i]["mobile"] +'</div>' +
                '<div class="list-item">'+ NumberFormat.formatMoney(repay_list[i]["invest_funds"],true) +'</div>' +
                '<div class="list-item">' +
                '<p>'+ (repay_list[i]["create_time"]&&repay_list[i]["create_time"].split(' ')[0]) +'</p>' +
                '<p>'+ (repay_list[i]["create_time"]&&repay_list[i]["create_time"].split(' ')[1]) +'</p>' +
                '</div>' +
                '</li>';
            }
        }
        //result += '</ul>';
        return result;
    }
    function refresh() {
        getInvestList(1, page_size);
    }
    function loadmore(me) {
        getInvestList( page_index, page_size, me);
    }
    function getInvestList(page, psize, me) {
        if (page == 1) {
            showLoading();
        }
        brd_ajax({
            url: __url,
            data: { pid: __pid, page: page, page_size: psize },
            success: function success(opts, response) {
                var result = transform(response.data.investRecords);
                if (result != '') {
                    if (page == 1) {
                        //$('#invest_record_list ul').html('');
                    }
                    $('#invest_record_list ul').append(result);
                    hideNoResultPage();
                    page_index = page +1 ;
                } else {
                    if (page == 1) {
                        showNoResultPage('暂无借款记录');
                    }
                    dropload.lock();
                    dropload.noData();
                    me.resetload();
                    return;
                }
                //控制加载更多
                if ($('#invest_record_list li').length < (page_index-1) * page_size) {
                    dropload.lock();
                    dropload.noData();
                }
                if (me) {
                    me.resetload();
                }
                hideLoading();
            },
            error: function error(opts, response) {
                hideLoading();
                if (me) {
                    me.resetload();
                }
                if (page > 1) {
                    $.message(response.result.msg);
                } else {
                    showNoResultPage(response.result.msg);
                }
            }
        });
    }
    //refresh();
}
Domready(function(){
    recordDropload();
});
