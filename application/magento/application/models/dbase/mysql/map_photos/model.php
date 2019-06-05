<?php
/*
 * Db модель map_photos
 */
namespace models\dbase\mysql\map_photos;

use \components\app as components;

abstract class Model extends \vendor\DBase_Mysql
{
    /*
     * Имя таблицы
     */
    public function get_table_name()
    {
        if (!$this->table_name) {
            $this->table_name = get_service_name() . '_map_photos';
        }
        return $this->table_name;
    }

    /*
     * Поля таблицы
     */
    protected $fields = array(
        'map_data_id' => array(
            'rules' => array('numeric', 'required'),
        //'processing' => array('htmlspecialchars'),
        ),
        'path' => array(
            'rules' => array('required'),
        //'processing' => array('htmlspecialchars'),
        ),
        'width' => array(
            'rules' => array('numeric', 'required'),
        //'processing' => array('htmlspecialchars'),
        ),
        'height' => array(
            'rules' => array('numeric', 'required'),
        //'processing' => array('htmlspecialchars'),
        ),
    );

    public function delete_photo($data_id = null, $path = null)
    {


        $module = self::get_module(MY_MODULE_NAME_MAP);

        return $module->delete_photo_files($data_id, $path);
    }

    /*
     * Добавляем новое фото метки в базу
     *
     * @param array $data - данные фото
     *
     * @return inteer - id добавленного фото
     */
    public function add_new_photo($data)
    {

        $this->set_values_to_fields($data);

        return $this->insert();
    }

    /*
     * Получаем фотографии метки по её id
     *
     * @return array - данные найденных фотографий
     */
    public function get_by_data_id($id)
    {
        $module = self::get_module(MY_MODULE_NAME_MAP);
        return $module->get_photos_by_data_id($id);
    }


}
