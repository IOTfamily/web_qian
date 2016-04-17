<?php
/**
 * Created by PhpStorm.
 * User: lee
 * Date: 16-4-16
 * Time: 下午10:13
 */
require './JsonFactory.php';
echo 'dd';
$factory = JsonFactory::getInstance();
echo 'dfds';


$code = $_POST['code'];
$code = "1q";

$link = mysql_connect('139.129.4.4','root','e1d524ad92');
if (!$link) {echo '数据库连接错误';}
mysql_select_db('yes_test',$link);
$sel = "SELECT status FROM jlm_activity_exchange_code where code='".$code."'";
$res = mysql_query($sel);
$data = mysql_fetch_assoc($res);
var_dump($data['status']);
mysql_free_result($res);
mysql_close($link);

jsonReturn($factory);

/**
 * json输出，中文不被编译为Unicode，要求PHP >= 5.4
 * @param JsonFactory $factory
 */
function jsonReturn(JsonFactory $factory) {
    $factory->send_headers();
    exit(json_encode($factory->all_body(), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

