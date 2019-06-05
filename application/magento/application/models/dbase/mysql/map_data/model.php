<?php
/*
 * Db модель map_data
 */
namespace models\dbase\mysql\map_data;

use \components\app as components;

abstract class Model extends \vendor\DBase_Mysql
{

    /*
     * Имя таблицы
     */
    public function get_table_name()
    {
        if (!$this->table_name) {
            $this->table_name = get_service_name() . '_map_data';
        }
        return $this->table_name;
    }

    /*
     * Поля таблицы
     */
    protected $fields = array(
        'x' => array(
            'rules' => array('numeric', 'required'),
        //'processing' => array('htmlspecialchars'),
        ),
        'y' => array(
            'rules' => array('numeric', 'required'),
        //'processing' => array('htmlspecialchars'),
        ),
        'comment' => array(
            'rules' => array(),
            'processing' => array('strip_tags', 'new_line', 'urls', 'spec_tags'),
        ),
        'comment_plain' => array(
            'rules' => array(),
            'processing' => array('strip_tags'),
        ),
        'title' => array(
            'rules' => array(),
            'processing' => array('strip_tags'),
        ),
        'user_id' => array(
            'rules' => array('numeric'),
        ),
        'category' => array(
            'rules' => array('numeric'),
        ),
        'subcategories' => array(
            'rules' => array(),
            'processing' => array('strip_tags'),
        ),
        'relevant_placemarks' => array(
            'rules' => array(),
            'processing' => array('strip_tags'),
        ),
        'seo_keywords' => array(
            'rules' => array(),
            'processing' => array('strip_tags'),
        ),
        'seo_description' => array(
            'rules' => array(),
            'processing' => array('strip_tags'),
        ),
    );

    /*
     * Добавляем новую метку в базу
     *
     * @param array $data - данные метки
     *
     * @return inteer - id добавленной метки
     */
    public function add_new_point($data)
    {

        $this->set_values_to_fields($data);

        return $this->insert();
    }

    /*
     * Обновляем метку
     *
     * @param array $data - новые данные метки
     *
     * @return boolean - статус обновления
     */
    public function update_point($data)
    {
        $id = $data['id'];
        unset($data['id']);

        // если не задавали координаты
        if ((isset($data['x']) && !$data['x']) || ((isset($data['y'])&& !$data['y']))) {
            unset($data['y']);
            unset($data['x']);
        }

        $this->set_values_to_fields($data);

        return $this->update($id);
    }

    /*
     * Получаем основные данные меток по списку их ids
     *
     * @param array $ids - список ids меток
     *
     * @return array - данные найденных меток
     */
    public function get_points_by_ids(array $ids)
    {
        $module = self::get_module(MY_MODULE_NAME_MAP);

        return $module->get_points_by_ids($ids);
    }

    /*
     * Получаем полное содержимое метки по её id
     *
     * @param integer $id - id метки
     *
     * @return array - данные метки
     */
    public function get_point_content_by_id($id)
    {
        $module = self::get_module(MY_MODULE_NAME_MAP);

        return $module->get_point_content_by_id($id);
    }

    /*
     * Получаем основные данные меток по диапазону координат
     *
     * @param array $coords - координаты
     *
     * @return array - данные найденных меток
     */
    function get_points_by_coords(array $coords)
    {

        $module = self::get_module(MY_MODULE_NAME_MAP);

        return $module->get_points_by_coords($coords);
    }

    /*
     * Получаем пачку меток для постепенного наполнения ими карты
     *
     * @return array - данные найденных меток
     */
    function get_points_bunch()
    {
        $module = self::get_module(MY_MODULE_NAME_MAP);
        $limit=self::get_module(MY_MODULE_NAME_SERVICE)->get_map_autofill_limit();
        return $module->get_points_by_limit($limit);
    }
}
