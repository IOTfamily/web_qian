'use strict';

// 旧版页面 js

// zepto,frozen
require('./util/zepto.min');
require('./util/zepto.cookie');
require('./util/zepto.alert');
require('./util/frozen');

// wechat
require('./wechat/wechat');
require('./wechat/brd_wechat');


// common
require('./model/common'); // 原common.js


// 下拉刷新
require('./util/dropload.min');

//信息提示组建
require('./model/message');

// 图片上传
import {UploadImage} from './model/uploadImage';
window['UploadImage'] = UploadImage;