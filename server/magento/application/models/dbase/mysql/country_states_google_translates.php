<?php
/*
 * Class country_states_cities_google_translates
 */
namespace models\dbase\mysql;

use \services\classes\models\db\mysql;

final class country_states_cities_google_translates extends \vendor\DBase_Mysql
{

    public function get_table_name()
    {
        if (!$this->table_name) {
            $this->table_name = 'country_states_cities_google_translates';
        }
        return $this->table_name;
    }

    protected $fields = array(
        'country_id' => array(
            'rules' => array('numeric', 'required'),
        ),
        'state_id' => array(
            'rules' => array('numeric', 'required'),
        ),
        'language' => array(
            'rules' => array('required'),
        ),
        'google_name' => array(
            'rules' => array('required'),
        ),
        'translate' => array(
            'rules' => array('required'),
        ),
        'only_for_state' => array(
            'rules' => array(),
        ),
    );
}