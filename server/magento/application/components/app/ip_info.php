<?php

namespace components\app;

use \vendor\component;

final class Ip_Info extends Component
{

    use \vendor\traits\patterns\t_singleton;

    protected $self_data = array();
    protected $self_ip = null;


    public function get($ip = NULL)
    {
        $self_ip_data_detect = false;
        if (!$ip) {
            //определяем личные данные
            $ip = $this->get_self_ip();
            if (my_array_is_not_empty($this->self_data)) {
                //возвращаем уже определенные личные данные
                return $this->self_data;
            }
            $self_ip_data_detect = true;
        }

        $ipdat = (array) @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=" . $ip));


        if ($self_ip_data_detect === true) {
            // записываем личные данные
            $this->self_data = $ipdat;
        }

        return $ipdat;
    }


    public function get_self_ip()
    {
        if ($this->self_ip) {
            return $this->self_ip;
        }

        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {   //check ip from share internet
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {   //to check ip is pass from proxy
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        $this->self_ip = $ip;
        return $ip;
    }


    public function get_country_code($ip = NULL)
    {
        $result = $this->get($ip);
        //если запускаем сайт на локалке, то данные по своему IP не получим
        return isset($result[GEOPLUGIN_SERVICE_PARAMETER_COUNTRY_CODE_CODE]) ? $result[GEOPLUGIN_SERVICE_PARAMETER_COUNTRY_CODE_CODE] : MY_COUNTRY_CODE_RU_CODE;
    }
}
