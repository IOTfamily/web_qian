//el, count, title
window['countdown'] = function() {
    var el = arguments[0];
    var count = arguments[1];
    var title = arguments[2] ? arguments[2] : '发送验证码';


    var djs = {};
    djs.count = count;
    djs.timer = null;

    //开始倒计时
    djs.start_timer = function() {
        el.addClass('disabled');
        el.attr('disabled', 'disabled');

        clearInterval(djs.timer);
        djs.timer = setInterval(function() {
            el.text(djs.count-- + "秒");

            if (djs.count < 0) {
                djs.stop_timer();
            }
        }, 1000);
    };

    //关闭倒计时
    djs.stop_timer = function() {
        djs.reset_timer();

        el.text(title);
        el.removeClass('disabled');
        el.removeAttr('disabled');
    };

    //重置时间
    djs.reset_timer = function() {
        clearInterval(djs.timer);
        djs.count = count;
    };

    return djs;
};

window['NumberFormat'] = {
    /**
     * 格式化小数：
     * @param src 原数字
     * @param pos 需要保留小数点后几位
     */
    format: function(src, pos) {
        if(!src){
            return '';
        }
        if (src) {
            return src.toFixed(pos);
        } else {
            return 0;
        }
    },

    /**
     * 限制输入内容必须为金额
     * 使用方法如下： <input oninput="NumberFormat.limitAmount(this)" />
     */
    limitAmount: function(text) {
        while (true) {
            var val = $(text).val();
            if (!/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){0,2})?$/.test(val)) {
                if (val.length > 0) {
                    text.value = val.substring(0, val.length - 1);
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    },

    /**
     * 限制输入内容必须为数字
     * 使用方法如下： <input onkeyup="this.value = NumberFormat.limitNumber(this.value)" />
     *
     * @param val   被判断的值
     * @return      过滤非法字符之后的源字符串
     */
    limitNumber: function(val) {
        if (!val) {
            return "";
        }
        val = val.replace(/[^\d]+/g, "");
        return val;
    },

    /**
     * 限制输入内容必须为数字,并且限制长度
     * 使用方法如下： <input onkeyup="this.value = NumberFormat.limitNumLength(4 , this.value)" />
     *
     * @param len   允许输入的最大长度
     * @param val   被判断的值
     * @return 过滤非法字符之后的源字符串
     */
    limitNumLength: function(len, val) {
        if (!val) {
            return "";
        }
        val = val.replace(/[^\d]+/g, "");
        if (val.length > len) {
            val = val.substring(0, len);
        }
        return val;
    },
    /**
     * 将手机号码按照3,4,4分段,13911111111  转为 139 1111 1111
     * js使用方法如下： NumberFormat.formatPhone($('#phone').val())"
     *
     * @param val   被判断的值
     * @return      格式后的手机号
     */
    formatPhone: function(val) {
        if (!val) {
            return "";
        }
        val = val.replace(/\s/g, "");
        val = val.replace(/(\d{3})/, "$1 ");
        val = val.replace(/(\d{4})/, "$1 ");
        return val;
    },
    /**
     * 将银行卡号按照4,4,4,4,3分段，6227002872000205123  转为 6227 0028 7200 0205 123
     * js使用方法如下： NumberFormat.formatBankCardNo($('#bankCardNo').val())"
     * @param val   被判断的值
     * @return      格式后的手机号
     */
    formatBankCardNo: function(val) {
        if (!val) {
            return "";
        }
        val = val.replace(/\s/g, "");
        val = val.replace(/(\d{4})/g, "$1 ");
        return val;
    },
    formatCredentialsNo: function(val) {
        if (!val) {
            return "";
        }
        val = val.replace(/\s/g, "");
        if (val.length <= 14) {
            val = val.replace(/(\d{6})/, "$1 ");
        } else {
            val = val.replace(/(\d{6})(\d{8})/g, "$1 $2 ");
        }
        return val;
    }

    /**
     * 金额格式化函数。如：123400=>1,234  123480=>1,234.8  123488=>1,234.88;
     * @param s 数值(Number或者String)金额,单位分。
     * @param f 是否强制显示2位小数。如果为true，则返回两位小数(1,234.00); 否则返回1,234。
     * @return 金额格式的字符串,如'1,234,567.45'
     */
    ,
    formatMoney: function(s, f) {
        if(!s){
            return '';
        }
        s = s.toString().replace(/\$|\,/g, '');
        isNaN(s) ? s = "0" : s = s / 100;
        var n = 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        var t = "";
        for (var i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        if (f) {
            return t.split("").reverse().join("") + "." + r;
        } else {
            if (r == '00') {
                return t.split("").reverse().join("");
            } else {
                return (t.split("").reverse().join("") + "." + r).replace(/0$/gi, '');
            }
        }
    }
};

/**
 * 隐藏部分字符串（手机号、身份证号、银行卡、姓名）脱敏处理，不做有效性检验，只检验长度是否合法
 * 不管多长，按照一半内容进行脱敏，如果小于2个字符则直接返回
 * @param $str
 * @return mixed|string
 */
window['hide_part_str'] = function(str) {
    if (str.length <= 2) {
        return str;
    }
    var tmLength = Math.floor(str.length / 2);
    var startIndex = Math.floor((str.length - tmLength) / 2);
    var subString = str.substr(startIndex, tmLength);
    str = str.replace(subString, str_out_times('*', tmLength));
    console.log(str);
    return str;
};


/**
 * 计算两个时间之间的间隔天数
 * @param string $str 基准时间
 * @param string $str 需要计算间隔的时间
 * @return mixed|string
 */
window['date_interval'] = function(date1, date2) {
    var endLogTimeDate = new Date(Date.parse(date2.replace(/-/g, "/")));
    var startLogTimeDate = new Date(Date.parse(date1.replace(/-/g, "/")));
    var iDays = parseInt((endLogTimeDate - startLogTimeDate) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数
    return iDays
}

//生成重复字符串
window['str_out_times'] = function(str, count) {
    if(!str) return '';
    var return_str = str;
    for (var i = 0; i < count - 1; i++) {
        return_str += str;
    }
    return return_str;
};

window['send_vcode'] = function(options) {
    var opts = $.extend({
        count: 60,
        url: '/reg/smscode'
    }, options);

    var mobile = $.trim(opts.mobile);
    var regexp = /^(1+[34578]+\d{9})$/;

    if (mobile.length == 0) {
        $.alert('手机号不能为空');
        return;
    }

    if (!regexp.test(mobile)) {
        $.alert('请输入正确的手机号码');
        return;
    }

    var djs = new countdown(opts.button, opts.count);
    djs.start_timer();

    $.ajax({
        url: opts.url,
        data: {
            mobile: opts.mobile,
            register: opts.register
        },
        success: function(response) {
            console.log(response);
            response = JSON.parse(response);
            if (response.result.code == 'OK') {
                opts.ccode.val(response.data.ccode);
            } else {
                djs.stop_timer();
                $.alert(response.result.msg);
            }
        },
        error: function(xhr, type) {
            djs.stop_timer();
            $.alert('貌似没有连接到网络');
        }
    });
};

window['brd_ajax'] = function(options) {
    (function(options) {
        var opts = $.extend({
            log: false
        }, options);

        if (opts.before) {
            opts.before(opts);
        }

        var setting = {
            url: opts.url,
            type: 'POST',
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
                    $.alert('您没有权限访问此地址');
                } else {
                    if (opts.error) {
                        opts.error(opts, response);
                    } else {
                        $.alert(response.result.msg);
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
                    $.alert('貌似没有连接到网络');
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


window['StateTransform'] = {
    /**
     * 信用账户类型的描述文案
     *
     * @param $type 类型：0其他，1充值，2提现，3投资理财，4投资收益，5借款，6还款，7提现失败返还',
     * @return string
     */
    lcAccountType2Str: function(val) {
        switch (val) {
            case '1':
                return '充值';
            case '2':
                return '提现';
            case '3':
                return '投资理财';
            case '4':
                return '投资收益';
            case '5':
                return '借款';
            case '6':
                return '还款';
            case '7':
                return '提现失败返还';
            case '0':
                return '其他费用';
            default:
                return '其他费用';
        }
    },
    /**
     * 借款单状态转换为字符串：
     * @param val 借款单状态数值
     */
    loanStatus2Str: function(val) {
        var status_desc;
        switch (val) {
            case '0':
                status_desc = '未提交审核';
                break;
            case '1':
                status_desc = '审核中';
                break;
            case '2':
                status_desc = '投标中';
                break;
            case '3':
                status_desc = '还款中';
                break;
            case '4':
                status_desc = '还款结束';
                break;
            case '-1':
                status_desc = '取消借款';
                break;
            case '-2':
                status_desc = '审核不通过';
                break;
            default:
                status_desc = '未知状态';
                break;
        }
        return status_desc;
    },
    /**
     * 担保记录单状态转换为字符串：
     * @param val 担保记录单状态数值
     */
    vouchStatus2Str: function(val) {
        var status_desc;
        switch (val) {
            case '0':
                status_desc = '同意担保';
                break;
            case '1':
                status_desc = '担保已生效';
                break;
            case '2':
                status_desc = '担保结束';
                break;
            case '3':
                status_desc = '担保取消';
                break;
            case '-1':
                status_desc = '担保取消';
                break;
            default:
                status_desc = '未知状态';
                break;
        }
        return status_desc;
    },
    /**
     * 担保记录单状态转换为字符串：
     * @param val 担保记录单状态数值
     */
    qbVouchStatus2Str: function(val) {
        var status_desc;
        switch (val) {
            case '0':
                status_desc = '担保未生效';
                break;
            case '1':
                status_desc = '担保已生效';
                break;
            case '2':
                status_desc = '担保结束';
                break;
            case '3':
                status_desc = '担保取消';
                break;
            case '-1':
                status_desc = '担保取消';
                break;
            default:
                status_desc = '未知状态';
                break;
        }
        return status_desc;
    },
    /**
     * 还款状态转换为字符串：
     * @param val 还款状态数值0待还，1准时还款，2逾期还款，3逾期待还
     */
    repayStatus2Str: function(val) {
        var status_desc;
        switch (val) {
            case '0':
                status_desc = '待还';
                break;
            case '1':
                status_desc = '准时还款';
                break;
            case '2':
                status_desc = '逾期还款';
                break;
            case '3':
                status_desc = '逾期待还';
                break;
            default:
                status_desc = '未知状态';
                break;
        }
        return status_desc;
    },

    /**
     * 提现状态转换为字符串：
     * @param val 0：创建提现订单，1已打款，2已到账，3已还款，-1提现失败',
     */
    qbLoanStatus2Str: function(val) {
        var status_desc;
        switch (val) {
            case '0':
                status_desc = '已提交';
                break;
            case '1':
                status_desc = '打款中';
                break;
            case '2':
                status_desc = '还款中';
                break;
            case '3':
                status_desc = '已还完';
                break;
            case '-1':
                status_desc = '提现失败';
                break;
            case '-2':
                status_desc = '打款失败';
                break;
            default:
                status_desc = '未知状态';
                break;
        }
        return status_desc;
    },

    /**
     * 信用账户类型的描述文案
     *
     * @param $type 类型：0其他，1提现，2还款，3担保费，4充值，5取款，6取款失败返还，7投资，8奖金，9平台服务费
     * @return string
     */
    qbAccountType2Str: function(val) {
        switch (val) {
            case '1':
                return '提现';
            case '2':
                return '还款';
            case '3':
                return '担保费';
            case '4':
                return '充值';
            case '5':
                return '取款';
            case '6':
                return '取款失败返还';
            case '7':
                return '投资';
            case '8':
                return '奖金';
            case '9':
                return '提现手续费';
            case '10':
                return '定向借款';
            case '11':
                return '定向支付';
            case '0':
                return '其他费用';
            default:
                return '其他费用';
        }
    },

    /**
     * 获取还款状态错误码描述：
     * @param val 还款状态错误码
     */
    qbRepayStatus2Str: function(status) {
        switch (status) {
            case '0':
            case '1':
            case '2':
                return '还款处理中';
            case '3':
                return '还款完成';
            case '-1':
                ;
            case '-2':
                return '还款失败';
            default:
                return '未知状态';
        }
    },

    qbApplyStatus2Str : function(status) {
        switch (status) {
            case '0':
            case '1':
            case '2':
                return '审核中';
            case '3':
                return '还款中';
            case '-1':
                return '未通过';
            case '9':
                return '已结清';
            default:
                return '未知状态';
        }
    }

};

window['showHintImage'] = function(src) {
    var maskBackgroud = document.body.children['testdiv'];
    if (maskBackgroud == null) {
        maskBackgroud = document.createElement("div");
        document.body.appendChild(maskBackgroud);
        maskBackgroud.setAttribute("id", "testdiv")
        $('#testdiv').css('background-color', '#333');
        $('#testdiv').css('position', 'fixed');
        $('#testdiv').css('top', 0);
        $('#testdiv').css('opacity', '0.6');
        $('#testdiv').css('width', '100%');
        $('#testdiv').css('height', '100%');
        $('#testdiv').css('z-index', '10');
    }
    $('#testdiv').css('display', 'block');

    var image = document.body.children['blockImage'];
    if (image == null) {
        image = document.createElement("img");
        document.body.appendChild(image);
        image.setAttribute('id', 'blockImage');
        $('#blockImage').attr('src', src);
        $('#blockImage').css('position', 'fixed');
        $('#blockImage').css('top', 0);
        $('#blockImage').attr('width', '100%');
        $('#blockImage').css('z-index', '11');
    }
    $('#blockImage').css('display', 'block');

    $('#blockImage').on('click', function() {
        document.body.removeChild(image);
        document.body.removeChild(maskBackgroud);
    });

    $('#testdiv').on('click', function() {
        document.body.removeChild(image);
        document.body.removeChild(maskBackgroud);
    });
};

function get_status_class(str) {
    if (str == 0) {
        return 'ui-status-checking';
    } else if (str == 1) {
        return 'ui-status-pass';
    } else if (str == 2) {
        return 'ui-status-overdue';
    } else {
        return 'ui-status-nopass';
    }
    return str;
}
window['get_status_class'] = get_status_class;
/* 
 * 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒 
 * 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00 
 * 返回精度为：秒，分，小时，天
 */
function GetDateDiff(startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");

    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime); //开始时间
    var eTime = new Date(endTime); //结束时间
    //作为除数的数字
    var divNum = 1;
    switch (diffType) {
        case "second":
            divNum = 1000;
            break;
        case "minute":
            divNum = 1000 * 60;
            break;
        case "hour":
            divNum = 1000 * 3600;
            break;
        case "day":
            divNum = 1000 * 3600 * 24;
            break;
        default:
            break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
}
window['GetDateDiff'] = GetDateDiff;

function format_money(currency) {
    var money = parseFloat(currency);
    var left = 2;
    if (money % 100 == 0) {
        left = 0;
    } else if (money % 10 == 0) {
        left = 1;
    }
    return money.toFixed(left).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
}
window['format_money'] = format_money;




/*
 *
 * 互信钱包图片上传功能
 * 1、动态创建iframe
 * 2、callback 返回缩略图,原图路径
 * 
 **/
 ;(function(window,document){

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
        if(opts.params){
            for(var key in opts.params){
                inner += '<input type="hidden" name="'+key+'" value="'+ opts.params[key] +'" />'
            }
        }
        form.innerHTML = inner;
        return [frame,form];
    }

    function upload(obj,opts){
        /**
            obj : id/obj
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
        if(!obj || !opts){
            return;
        }
        var obj = Object.prototype.toString.call(obj) === '[object String]' ? document.querySelector(obj) : obj,
            forms = createForm(opts),
            frame = forms[0],
            form = forms[1],
            fileInput = form.querySelector('input[type=file]'),
            fread = new FileReader(),
            
            event = new MouseEvent('click',{
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
        insert();

        fileInput.addEventListener('change',function(){
            fread.readAsDataURL(fileInput.files[0]);
            form.submit();
        },false);

        fread.addEventListener('load',function(e){
            var result = e.target.result;
            if(obj.querySelector('img[data-type=pre]')){
                obj.removeChild(obj.querySelector('img[data-type=pre]'))
            }
            var img = new Image();
            img.src = result;
            img.style.cssText+=';width:100%;height:100%;';
            img.dataset.type='pre';
            obj.appendChild(img);
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

        obj.addEventListener('click',function(){
            fileInput.dispatchEvent(event);
        },false);

        function insert(){
            document.body.insertBefore(form,document.body.firstChild);
            document.body.insertBefore(frame,document.body.firstChild);
        }

        
    }
    //window['UploadImage'] = upload;
 })(window,document);




 /**
    监听location，stateChange
    localStorage中包含当前地址，显示已完成弹层
 **/
 // ;(function(window,document){
 //    window.onpopstate = function(){
 //        console.log('change',location.href)
 //    }
 //    window.addEventListener('popstate',function(e){
 //        console.log('change2',location.href)
 //        // var link = location.href;
 //        // if(localStorage.getItem('link')){
 //        //     $(".ui-dialog").dialog("show");
 //        // }
 //    },false);
 // })(window,document);


/*
*
*  input focus时，隐藏fixed的层
*        blur时，再放出来
*
**/
// ;(function(window,document){
//     var y;
//     function hide(e){
//         var obj = document.querySelector('.m-fixed-menu'),
//             space = document.querySelector('.m-space');
//         y = window.scrollY;
//         if(obj){
//             obj.style.cssText += ';position:initial';
//             if(space) space.style.cssText += ';height:20px';
//         }
//     }
//     function restore(e){
//         var obj = document.querySelector('.m-fixed-menu'),
//             space = document.querySelector('.m-space');
//         if(obj){
//             obj.style.cssText = '';
//             if(space) space.style.cssText = '';
//             if(y||y==0){
//                 window.scrollTo(0,y);
//             }
//         }
//     }
//     $(function(){
//         var inputs = document.querySelectorAll('input') || [],
//             textarea = document.querySelectorAll('textarea') || [],
//             all,
//             i,l;
//         inputs = Array.prototype.slice.call(inputs);
//         textarea = Array.prototype.slice.call(textarea);
//         all = inputs.concat(textarea);
//         function set(item){
//             item.addEventListener('focus',hide,false);
//             item.addEventListener('blur',restore,false);
//         }
//         for(var i = all.length-1;i>-1;i--){
//             set(all[i]);
//         }
//     })
// })(window,document);


// school select
;(function(window,document){
    var school_selects,selects,defaultValue = '<option value="">请选择学校</option>',
        url = '/Apply/selectSchools'; // 请求地址

    function init(){
        school_selects = document.querySelector('.school_select');
        if(!school_selects){
            console.log('无school_select节点');
            return;
        }
        selects = school_selects.querySelectorAll('select');

        selects[0].addEventListener('change',get,false);
    }
    
    function get(e){
        var value = e.target.value;
        if(!value){
            return;
        }
        brd_ajax({
            url : url,
            data : {
                code : value
            },
            success:function(opts,res){
                change(res);
            }
        })
    }
    function change(res){
        var i=0,data=res.data.schools,l=data.length,str='';
        for(;i<l;i++){
            str += '<option value="'+ data[i].id +'">'+ data[i].school_name +'</option>';
        }
        selects[1].innerHTML = defaultValue+str;
    }

    window['school_select'] = init;
})(window,document);



/*
判断判断表单是否可以提交
设定'#btn_submit'的可点击状态
 */

//做判断
function is_canSubmit() {
    //如果页面中存在check，先检查check的状态
    if(document.querySelector('.pact span') && document.querySelector('.pact span').classList.contains('m-uncheck')){
        return false;
    }
    var a = document.querySelectorAll('*[required=required]');
    if (a.length == 0) {
        return false;
    }
    for (var i = 0; i < a.length; i++) {
        if(a[i].offsetHeight!=0){
            if (!a[i].value) {
                return false;
            }
        }
    }
    return true;
}
window['is_canSubmit'] = is_canSubmit;

//判断并执行执行动作
function change_btn_clickable(){

    if (is_canSubmit()) {
        $('#btn_submit').prop('disabled', false);
    } else {
        $('#btn_submit').prop('disabled', true);
    }
}
window['change_btn_clickable'] = change_btn_clickable;

function set_btn_clickable(){

       change_btn_clickable();

    $('*[required=required]').on('keyup',function () {
       change_btn_clickable();
    })
    $('*[required=required]').on('change',function () {
        setTimeout(function(){
            change_btn_clickable();
        },10)
    })

    if(document.querySelector('.pact span')){
        var check = document.querySelector('.pact span');
        check.addEventListener('click',function(){
            if(check.classList.contains('m-check')){
                check.className = 'm-uncheck';
            }else{
                check.className = 'm-check';
            }
            change_btn_clickable();
        });
    }
}
window['set_btn_clickable'] = set_btn_clickable;



;(function(window,document){
    var input,btn,timer;
    function init(inputId,btnId){
        input = document.querySelector(inputId);
        btn = document.querySelector(btnId);
        input.addEventListener('focus',show,false);
        //input.addEventListener('blur',hide,false);
    }
    function show(){
        clear();
        btn.disabled = false;
    }
    function hide(){
        if(timer) return;
        timer = setTimeout(function(){
            btn.disabled = 'disabled';
        },200)
    }
    function clear(){
        clearTimeout(timer);
        timer = null;
    }

    window['organizationChange'] = {
        init :init,
        show : show,
        hide : hide
    }
})(window,document);

var show_footer = function(options){
    (function(options) {
        var opts = $.extend({
            trigger: '#show-footer',
            modalName: '.footer-modal',
            item: '',
            className: 'active'
        }, options);

        $(opts.trigger).on('click', function(){
            $(opts.modalName).addClass(opts.className);
            $('body').css("overflow", "hidden");
        });
        $('.footer-modal').on('click', function(){
            $(opts.modalName).removeClass(opts.className);
            $('body').css("overflow", "auto");
        });
        $(opts.item).on('click', function(e){
            e.stopPropagation();
        })

    })(options);
};
window['show_footer'] = show_footer;

