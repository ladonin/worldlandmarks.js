<?php
/*
 * Db модель articles
 */
namespace models\dbase\mysql\articles;

use \components\app as components;

abstract class Model extends \vendor\DBase_Mysql
{

    /*
     * Имя таблицы
     */
    public function get_table_name()
    {
        if (!$this->table_name) {
            $this->table_name = get_service_name() . '_articles';
        }
        return $this->table_name;
    }

    /*
     * Поля таблицы
     */
    protected $fields = array(
        'title' => array(
            'rules' => array('required'),
            'processing' => array('strip_tags'),
        ),
        'content' => array(
            'rules' => array('required'),
            'processing' => array('strip_tags', 'new_line', 'urls', 'spec_tags'),
        ),
        'content_plain' => array(
            'rules' => array('required'),
            'processing' => array('strip_tags'),
        ),
        'seo_description' => array(
            'rules' => array(),
            'processing' => array('strip_tags'),
        ),
        'country_id' => array(
            'rules' => array('required', 'numeric'),
        ),
        'categories' => array(
            'rules' => array('required'),
            'processing' => array('strip_tags'),
        ),
        'keywords' => array(
            'rules' => array(),
            'processing' => array('strip_tags'),
        ),
    );


    public function add_article($data)
    {
        $this->set_values_to_fields($data);
        return $this->insert();
    }

    public function update_article($data)
    {

        $id = $data['id'];
        unset($data['id']);

        $this->set_values_to_fields($data);

        return $this->update($id);
    }
}
