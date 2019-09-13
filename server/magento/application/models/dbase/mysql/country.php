<?php
/*
 * Class Country
 */
namespace models\dbase\mysql;

use \services\classes\models\db\mysql;

final class Country extends \vendor\DBase_Mysql
{

    public function get_table_name()
    {
        if (!$this->table_name) {
            $this->table_name = 'country';
        }
        return $this->table_name;
    }


    protected $fields = array(
        'code2' => array(
            'rules' => array('required'),
        ),
        'local_code' => array(
            'rules' => array('required'),
        ),
    );
}