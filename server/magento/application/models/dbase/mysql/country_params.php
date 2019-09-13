<?php
/*
 * Class Country_Params
 */
namespace models\dbase\mysql;

use \services\classes\models\db\mysql;

final class Country_Params extends \vendor\DBase_Mysql
{

    public function get_table_name()
    {
        if (!$this->table_name) {
            $this->table_name = 'country_params';
        }
        return $this->table_name;
    }


    protected $fields = array(
        'country_id' => array(
            'rules' => array('numeric', 'required'),
        ),
        'has_states' => array(
            'rules' => array('numeric', 'required'),
        ),
    );
}