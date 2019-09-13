<?php
/*
 * Class Country_Name
 */
namespace models\dbase\mysql;

use \services\classes\models\db\mysql;

final class Country_Name extends \vendor\DBase_Mysql
{

    public function get_table_name()
    {
        if (!$this->table_name) {
            $this->table_name = 'country_name';
        }
        return $this->table_name;
    }

    protected $fields = array(
        'country_id' => array(
            'rules' => array('numeric', 'required'),
        ),
        'name' => array(
            'rules' => array('required'),
        ),
        'language' => array(
            'rules' => array('required'),
        ),
    );
}