<?php
/*
 * Class Emails_Sends
 */
namespace models\dbase\mysql;

use \components\app as components;

final class Emails_Sends extends \vendor\DBase_Mysql
{
    public function get_table_name()
    {
        if (!$this->table_name) {
            $this->table_name = 'emails_sends';// . get_service_name();
        }
        return $this->table_name;
    }


    protected $fields = array(
        'map_table' => array(
            'rules' => array('db_table_name', 'required'),
        ),
        'data_id' => array(
            'rules' => array('numeric', 'required'),
        ),
        'from_email' => array(
            'rules' => array('email', 'required'),
        ),
        'from_name' => array(
            'rules' => array('name'),
        ),
        'recipient_email' => array(
            'rules' => array('email', 'required'),
        ),
        'recipient_name' => array(
            'rules' => array('name'),
        ),
        'is_html' => array(
            'rules' => array('numeric', 'required'),
        ),
        'subject' => array(
            'rules' => array('required'),
        ),
        'body' => array(
            'rules' => array('required'),
        ),
        'plain_text' => array(
            'rules' => array('required'),
        ),
    );

    public function add($data)
    {
        $this->set_values_to_fields($data);

        return $this->insert();
    }


}
