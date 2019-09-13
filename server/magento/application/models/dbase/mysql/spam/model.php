<?php
/*
 * Db модель spam
 * Отправка писем людям из базы на почту
 */
namespace models\dbase\mysql\spam;

use \components\app as components;

abstract class Model extends \vendor\DBase_Mysql
{
    /*
     * Имя таблицы
     */
    public function get_table_name()
    {
        if (!$this->table_name) {
            $this->table_name =  get_service_name().'_spam';
        }
        return $this->table_name;
    }

    /*
     * Поля таблицы
     */
    protected $fields = array(
        // Email пользователя
        'email' => array(
            'rules' => array('email', 'required'),
        ),
        // Сайт-почтовик mail.ru, yandex.ru, google.com
        'site' => array(
            'rules' => array('required'),
        ),
        // Уникальный код письма
        'code' => array(
            'rules' => array('numeric','required'),
        ),
        // Поприветствовали ли мы этого человека на сайте
        'greeting' => array(
            'rules' => array('numeric'),
        ),
        // Ему интересно/не интересно/еще не ответил
        'status' => array(
            'rules' => array('numeric'),
        ),
        // Метка, с которой произошел вход на сайт
        'entry_points' => array(
            'rules' => array(),
        ),
        // Отправлено спам письмо, еще нет
        'is_sent' => array(
            'rules' => array('numeric'),
        ),
    );

    /*
     * Добавляем новую запись в базу
     *
     * @param array $data - данные
     *
     * @return inteer - id добавленной записи
     */
    public function add($data)
    {
        $this->set_values_to_fields($data);

        return $this->insert();
    }


    /*
     * Обновляем запись
     *
     * @param array $data - новые данные
     *
     * @return boolean - статус обновления
     */
    public function update_data($data)
    {
        $id = $data['id'];
        unset($data['id']);

        $this->set_values_to_fields($data);

        return $this->update($id);
    }




}
