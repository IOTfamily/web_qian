<?php

/**
 * Created by PhpStorm.
 * User: lee
 * Date: 16-4-16
 * Time: 下午11:22
 */

class JsonFactory {
    private static $instance = null;

    private $headers = array();
    private $body = array();

    //api输出结果
    private $code = 'OK'; //错误码
    private $error_msg;   //错误提示

    private $data;
    private $api;
    private $v;

    public function __construct()
    {
        $this->data = new \stdClass();
        $this->init();
    }

    public function init()
    {
        $this->set_header('Content-Type', 'text/plain;charset=UTF-8');
    }

    public function set_header($name, $value)
    {
        $this->headers[$name] = $value;
    }

    public function set_body($name, $value)
    {
        $this->body[$name] = $value;
    }

    public function send_headers()
    {
        foreach ($this->headers as $name => $value) {
            header($name . ':' . $value);
        }
    }

    public function get_body($name)
    {
        if (array_key_exists($name, $this->body)) {
            return $this->body[$name];
        }
        return null;
    }

    public function get_header($name)
    {
        if (array_key_exists($name, $this->headers)) {
            return $this->headers[$name];
        }
        return null;
    }

    public function get_headers()
    {
        return $this->headers;
    }

    public function set_error_code($code)
    {
        $this->code = $code;
    }

    //自定义错误提示语
    public function set_error_msg($msg)
    {
        $this->error_msg = $msg;
    }

    public function set_data($data)
    {
        if (!empty($data)) {
            $this->data = $data;
        }
    }

    public function insert_data($k, $v)
    {
        //数字类型转换成string类型
        if (is_int($v) || is_float($v)) {
            $v = strval($v);
        }
        $this->data->$k = $v;
    }

    public function set_api($api)
    {
        $this->api = $api;
    }

    public function set_version($v)
    {
        $this->v = $v;
    }

    public function all_body()
    {
        if (!empty($this->api)) {
            $this->set_body('api', $this->api);
        }

        if (!empty($this->v)) {
            $this->set_body('v', $this->v);
        }

        //错误码提示文案
        if (empty($this->error_msg)) {
            $this->set_body('result', array("code" => $this->code, "msg" => C($this->code)));
        } else {
            $this->set_body('result', array("code" => $this->code, "msg" => $this->error_msg));
        }

        $this->set_body('data', $this->data);

        return $this->body;
    }

    public static function getInstance()
    {
        if (self::$instance == null) {
            self::$instance = new JsonFactory();
        }
        return self::$instance;
    }
}