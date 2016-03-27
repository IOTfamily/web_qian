
// 理财我的投资页

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

function GetDateDiff(endDate) {
    var now = Date.parse(new Date());
    endDate = new Date(endDate).getTime();
    var dates = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return parseInt(dates);
}

// "create_time": "2016-02-24", //产品募集期开始时间
// "collect_period_end": "2016-03-01 19:11:46",//产品募集期结束时间 
// "create_time": "2016-03-03",//订单创建时间 
// "deadline": "2016-05-19",//到期日 
// "expect_income": "1650",//预计收益,单位分 
// "invest_funds": "99999",//总投资金额（本金+借款）,单位分 
// "loan_funds": "40000",//借款金额，单位：分 
// "loan_rate": "0.0500",//借款利率 
// "name": "倍率宝2号", //产品名称 
// "pid": "2", //产品id 
// "stage": "1", //产品期数 
// "status": "3", //状态-1,预约失败、1,预约中、3,已开始、4,已完成、5,逾期 
// "value_date": "2016-03-03", //起息日 
// "with_funding_income": "550" //配资收益 
function handleStatus(item) {
    var status = item.status,
        str = "";
    switch (status) {
        case "3":
            str += '<p>预计到期总收益：<span class="color">' + NumberFormat.formatMoney(Number(item.expect_income) + Number(item.with_funding_income), true) + '</span></p>';
            break;
        case "-1":
        case "6":
            str += '<p>预约时间：<span class="color">' + item.create_time + '</span></p>';
            break;
        case "1":
            str += '<p>预计起息时间：<span class="color">' + item.create_time + '</span></p>';
            break;
        case "4":
            str += '<p>已赚取收益：<span class="color">' + NumberFormat.formatMoney(Number(item.expect_income) + Number(item.with_funding_income), true) + '</span></p>';
            break;
    }
    return str + '<i class="icon icon-right"></i>';
}
function getStatus(item){
    var status = item.status, str = "";
    if(status==3){
        str += '<label>' + GetDateDiff(item.deadline) + '天后到期</label>';
    }else if(status==-1 || status==6){
        str += '<label>未成功</label>';
    }else if(status == 1){
        str += '<label>预约中</label>';
    }else if(status == 4){
        str += '<label>已到期</label>';
    }
    return str;
}
function getDetail(item) {
    var str = '';
    var loan_funds = NumberFormat.formatMoney(item.loan_funds, true),
        loan_rate = NumberFormat.formatMoney(item.loan_rate * 10000, true),
        with_funding_income = NumberFormat.formatMoney(item.with_funding_income, true);
    switch (item.status) {
        case "3":
        case "4":
            str += '<div class="detail clearfix">'+
                        '<div class="left">' +
                            '<p>起息时间：' + item.create_time + '</p>'+
                            '<p>本金投资：' + NumberFormat.formatMoney(item.invest_funds-item.loan_funds, true) + '</p>'+
                            (loan_rate ? '<p>借款利率：' + loan_rate + '%</p>' : '') +
                        '</div>' +
                        '<div class="right">' +
                            '<p>到期时间：' + item.deadline + '</p>'+
                            (loan_funds ? '<p>借款投资：' + loan_funds + '</p>' : '') +
                            (item.status == 4 && with_funding_income!=0 && with_funding_income ? '<p>借款多赚：' + with_funding_income + '</p>' : '')+
                        '</div>' +
                    '</div>';
            break;
    }
    return str;
}
function investDropload() {
    // dropload
    var dropload = $('#invest_list').dropload({
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
    }
    function showLoading() {
    }
    function hideLoading() {
    }
    function transform(repay_list, list_id) {
        var result = '';
        if (repay_list && repay_list.length) {
            for (var i = 0; i < repay_list.length; i++) {
                var item = repay_list[i];
                var statusClass = ["failing", "", "booking", "", "hold", "mature", "", "failing"][parseInt(item.status) + 1],
                    detail = (item.status == -1 || item.status == 6 || item.status == 1) ? '' : getDetail(item);
                result += '<li class="' + statusClass + '">' +
                            '<a href="/LcInvest/investDetail/pid/' + item.pid + '">' +
                                '<div class="produce">' +
                                    '<div class="part02">' +
                                        '<p>'+item.name+'<span>'+item.stage+'</span>'+getStatus(item)+'</p>'+
                                        '<p>投资金额：' + NumberFormat.formatMoney(Number(item.invest_funds), true) + '</p>' +
                                        handleStatus(item) +
                                    '</div>' +
                                '</div>' +
                                detail +
                            '</a>' +
                        '</li>';
            }
        }
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
                var result = transform(response.data.info);
                if (result != '') {
                    if (page == 1) {
                        //$('#invest_list ul').html('');
                    }
                    $('#invest_list ul').append(result);
                    hideNoResultPage();
                    page_index = page + 1;
                } else {
                    if (page == 1) {
                        showNoResultPage('暂无投资，去发现更多财富');
                    }
                    dropload.lock();
                    dropload.noData();
                    me.resetload();
                    return;
                }
                //控制加载更多
                if (document.querySelectorAll('#invest_list li').length < (page_index-1) * page_size) {
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
    investDropload();
});
