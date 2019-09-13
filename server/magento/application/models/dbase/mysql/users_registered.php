<?php
/*
 * Class Users_Registered
 */
namespace models\dbase\mysql;

use \components\app as components;

final class Users_Registered extends \vendor\DBase_Mysql
{

    public function get_table_name()
    {
        if (!$this->table_name) {
            $this->table_name = 'users_registered';
        }
        return $this->table_name;
    }
    protected $fields = array(
        'role' => array(
            'rules' => array('numeric', 'required'),
        //'processing' => array('htmlspecialchars'),
        ),
        'name' => array(
            'rules' => array('word', 'required'),
        //'processing' => array('htmlspecialchars'),
        ),
        'password_hash' => array(
            'rules' => array('hash', 'required'),
        //'processing' => array('htmlspecialchars'),
        ),
    );

    public function add_new_user($data)
    {
        $this->set_values_to_fields($data);

        return $this->insert();
    }

}
