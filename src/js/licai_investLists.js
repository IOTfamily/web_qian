
// 理财列表页
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


function handleStatus(status) {
    var str = '';
    switch (status) {
        case "2":
            str = '<div class="status buy">募集中</div>';
            break;
        case "4":
            str = '<div class="status hold">计息中</div>';
            break;
        case "3":
            str = '<div class="status over">已满标</div>';
            break;
    }
    return str;
}
function investListsDropload() {
    // dropload
    var dropload = $('.invest-list').dropload({
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
    function hideNoResultPage() {
        $('#list').removeClass('hidden');
        $('#no_result').addClass('hidden');
    }
    function showNoResultPage(msg) {
        $('#list').addClass('hidden');
        $('#no_result').removeClass('hidden');
        $('.licai-index-mark').addClass('hidden');
    }
    function showLoading() {
    }
    function hideLoading() {
    }
    var f_first=true,p_first=true;
    function transform(repay_list, list_id) {
        var result = '';
        if (repay_list && repay_list.length) {
            for (var i = 0; i < repay_list.length; i++) {
                var item = repay_list[i];
                result += '<li><a href="/LcInvest/investDetail/pid/'+item.id+'">'+
                            '<p class="part01">'+item.name+item.stage+'</p>'+
                            '<div class="part02 clearfix">'+
                                '<div class="profit">'+
                                    '<p>年化收益</p>'+
                                    '<p>'+item.income_rate+'%</p>'+
                                '</div>'+
                                '<div class="time">'+
                                    '<p>期限(天)</p>'+
                                    '<p>'+item.term+'</p>'+
                                '</div>'+
                                '<div class="use">'+
                                    '<p>剩余可投(元)</p>'+
                                    '<p>'+NumberFormat.formatMoney(item.collect_funds - item.collected_funds,true)+'</p>'+
                                '</div>'+
                            '</div>'+
                            '<div class="part03 clearfix">'+
                                '<p><i class="icon2 icon-lcsafeguard01"></i><span>阳光保险承保</span></p>'+
                                '<p><i class="icon2 icon-lcsafeguard01"></i><span>本息保障</span></p>'+
                            '</div>'+
                            handleStatus(item.status) +
                        '</a></li>';
            }
            if(p_first){
                result = '<div class="head"><i></i><span>阳光计划</span></div>'+result;
            }
            p_first = false;
        }
        $('ul#plan').append(result);
    }
    function transformProLoan(repay_list){
        var result = '';
        for (var i = 0; i < repay_list.length; i++) {
            var item = repay_list[i];
            result+='<li><a href="/LcInvest/investDetail/pid/'+item.id+'">'+
                        '<p class="part01">'+item.name+item.stage+'</p>'+
                        '<div class="part02 clearfix">'+
                            '<div class="profit">'+
                                '<p>年化收益</p>'+
                                '<p>'+item.income_rate+'%<span class="plus">+'+(item.more_income_rate-item.income_rate).toFixed(1)+'%</span></p>'+
                            '</div>'+
                            '<div class="time">'+
                                '<p>期限(天)</p>'+
                                '<p>'+item.term+'</p>'+
                            '</div>'+
                            '<div class="use">'+
                                '<p>剩余可投(元)</p>'+
                                '<p>'+NumberFormat.formatMoney(item.collect_funds - item.collected_funds,true)+'</p>'+
                            '</div>'+
                        '</div>'+
                        '<div class="part03 clearfix">'+
                            '<p><i class="icon2 icon-lcsafeguard01"></i><span>阳光保险承保</span></p>'+
                            '<p><i class="icon2 icon-lcsafeguard01"></i><span>本金保障</span></p>'+
                        '</div>'+
                        handleStatus(item.status) +
                    '</a></li>';
        }
        if(f_first){
            result = '<div class="head"><i></i><span>信用理财</span><span class="privi">信用特权</span></div>'+result;
        }
        f_first = false;
        return result;
    }
    function refresh() {
        getInvestList(1, page_size);
    }
    function loadmore(me) {
        getInvestList(page_index, page_size, me);
    }
    function getInvestList(page, psize, me) {
        if (page == 1) {
            showLoading();
        }
        brd_ajax({
            url: _url,
            data: { page: page, page_size: psize },
            success: function success(opts, response) {
                if(response.data.productLoan.length){
                    var finance = transformProLoan(response.data.productLoan);
                    $('ul#finance').append(finance);
                }
                if(response.data.productDirect.length){
                    transform(response.data.productDirect);
                    hideNoResultPage();
                    page_index = page + 1;
                }else{
                    //if (page == 1) {
                    //    showNoResultPage('暂无投资列表，去发现更多财富');
                    //    $('.dropload-down').hide();
                    //}
                    dropload.lock();
                    dropload.noData();
                    me.resetload();
                    return;
                }
                //控制加载更多
                if (document.querySelectorAll('ul#plan li').length < (page_index-1) * page_size) {
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
                if(page>1){
                    $.message({
                        'text': response.result.msg
                    });
                }else{
                    showNoResultPage(response.result.msg);
                }
            }
        });
    }
}
Domready(function(){
    investListsDropload();
});
