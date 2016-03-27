

//import { echarts } from './util/echarts';
import { Domready } from './model/domready';
var echarts = require('./util/echarts');
function setChart(options){ 
    var total = options.total,
        canLoan = options.canLoan,
        bank = options.bank,
        own = options.own;
    var myChart = echarts.init(document.getElementById('echarts_bar'));
    console.log(myChart)
    // 指定图表的配置项和数据
    // var option = {
    //     grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '3%',
    //         containLabel: true
    //     },
    //     xAxis: [{
    //         type: 'category',
    //         data: ['借款购买','直接购买','银行理财']
    //     }],
    //     yAxis: [
    //         {
    //             type: 'value',
    //             name: '收益',
    //             nameGap: 18
    //         }
    //     ],
    //     series: [{
    //             name: '收益',
    //             type: 'bar',
    //             itemStyle : { normal: {label : {show: true, position: 'top'}, color: '#ff8706'}},
    //             data: [
    //                 canLoan , own , bank
    //             ]
    //         }]
    // };
    var option = {
            title: {
                x: '80',
                text: '用户曲线',
            },
            legend: {
                top: 'top',
                data:['每日新增']
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['借款购买','直接购买','银行理财']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    max: 500
                }
            ],
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 0,
                    end: 100
                }
            ],
            series: [
                {
                    name:'新增',
                    type:'bar',
                    smooth:true, 
                    symbol: 'none',
                    stack: '新增',
                    areaStyle: {
                        normal: {
                            color:'rgba(255,0,0,1)',
                            shadowColor : 'rgba(255,0,0,1)'
                        }
                    },
                    data: [1,2,3]
                }
            ]
        }

    myChart.setOption(option);

    // $('#product_buy').on('input', function(){
    //     if(!isNaN(Number($(this).val())) && Number($(this).val()) <= total){
    //         own = Number($(this).val());
    //         for(var i=0;i< 3; i++){
    //             var data = i==0 ? total-own : (i==1 ? own : bank);
    //             option.series[i].data[i] = data;
    //         }

    //         //myChart.setOption(option);
    //     }
    // })
}
Domready(function(){
    setChart({
        total: 9900,
        canLoan: 3000,
        bank: 100,
        own: 200
    });
})
