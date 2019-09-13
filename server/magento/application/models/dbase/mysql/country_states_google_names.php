<?php
/*
 * Class Country_States_Google_Names
 */
namespace models\dbase\mysql;

use \services\classes\models\db\mysql;

final class Country_States_Google_Names extends \vendor\DBase_Mysql
{

    public function get_table_name()
    {
        if (!$this->table_name) {
            $this->table_name = 'country_states_google_names';
        }
        return $this->table_name;
    }

    protected $fields = array(
        'state_id' => array(
            'rules' => array('numeric', 'required'),
        ),
        'name' => array(
            'rules' => array('required'),
        ),
        'language' => array(
            'rules' => array(),
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
        if ($data['state_id'] && $data['name'] && $data['language']) {
            $result =  $this->get_by_condition("
                state_id = \"".$data['state_id']."\"
                AND name = \"".$data['name']."\"
                AND language = \"".$data['language']."\"
                    ", '', '', 'count(*) as c', 1, false);
            if ($result['c'] == 0) {
                return $this->add($data);
            }
        }
        return false;
    }
}