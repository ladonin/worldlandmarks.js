<?php
/*
 * Class Country_States
 */

namespace models\dbase\mysql;

use \services\classes\models\db\mysql;

final class Country_States extends \vendor\DBase_Mysql
{


    public function get_table_name()
    {
        if (!$this->table_name) {
            $this->table_name = 'country_states';
        }
        return $this->table_name;
    }

    protected $fields = array(
        'url_code' => array(
            'rules' => array('required'),
        ),
        'country_id' => array(
            'rules' => array('numeric', 'required'),
        ),
    );


    public function add($data)
    {
        $this->set_values_to_fields($data);

        return $this->insert();
    }


    /*
     * Добавление уникальной строки
     */
    public function add_once($data)
    {
        if ($data['url_code'] != MY_UNDEFINED_VALUE) {
            if ($data['url_code'] && $data['country_id']) {
                $result = $this->get_by_condition("url_code = \"" . $data['url_code'] . "\" AND country_id = \"" . $data['country_id'] . "\"", '', '', 'count(*) as c', 1, false);
                if ($result['c'] == 0) {
                    return $this->add($data);
                }
            }
        }
        return false;
    }
}
