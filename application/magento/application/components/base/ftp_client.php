<?php
/*
 * Класс Ftp_Client
 *
 * Отвечает за работу с данными на удаленном ftp сервере
 */

namespace components\base;

use \vendor\component;

final class Ftp_Client extends Component
{
    private static $connects = array();
    private static $current_server_name;

    /*
     * Соединяется с ftp сервером
     *
     * @param string $server_name - к какому серверу коннектимся
     */
    public static function connect($server_name = MY_FTP_DEFAULT_SERVER_NAME)
    {
        self::$current_server_name = $server_name;

        if (my_is_not_empty(@self::$connects[$server_name])) {
            return true;
        }
        $ftp_data= self::get_module(MY_MODULE_NAME_SERVICE)->get_ftp_data($server_name);

        $server_url = $ftp_data['url'];
        $user_name = $ftp_data['user_name'];
        $user_password = $ftp_data['user_password'];

        // Установка соединения
        $conn = ftp_connect($server_url);

        // Вход с именем пользователя и паролем
        $login_result = ftp_login($conn, $user_name, $user_password);

        if ((!$conn) || (!$login_result)) {
             self::concrete_error(array(MY_ERROR_FTP_CONNECTION,
                 'server_url:' . $server_url . ', '
                 . 'user_name:' . $user_name . ', '
                 . 'user_password:' . $user_password . ''
                ));
        }
        // Делаем пассивный режим
        ftp_pasv($conn, true);
        self::$connects[$server_name] = $conn;
    }


    /*
     * Загружаем файлы на сервер
     * Перед загрузкой нужно, чтобы было соединение с сервером
     * Последующие загрузки будут происходить по последнему соединению (если не передавать $server_name) или явно указанному $server_name,
     * соединение по которому было установлено ранее (не важно когда, главное, что он есть в массиве self::$connects)
     */
    public static function load($source_file, $destination_file, $server_name = null) {

        $server_name = self::check_server_name($server_name);

        if (my_is_empty(@$source_file)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'source_file:' . $source_file));
        }
        check_local_file($source_file);

        if (my_is_empty(@$destination_file)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'destination_file:' . $destination_file));
        }

        $ftp_data= self::get_module(MY_MODULE_NAME_SERVICE)->get_ftp_data($server_name);

        $destination_file = $ftp_data['root_directory'] . MY_DS . $destination_file;

        // Закачивание файла
        $upload = ftp_put(self::$connects[$server_name], $destination_file, $source_file, FTP_BINARY);
        // Проверка результата
        if (!$upload) {
            self::concrete_error(array(MY_ERROR_FTP_LOAD_FILE, 'server_name:' . $server_name . ', source_file:' . $source_file . ', destination_file:' . $destination_file));
        }
        return true;
    }

    public static function make_dir($directory_path, $server_name = null)
    {
        $server_name = self::check_server_name($server_name);

        if (my_is_empty(@$directory_path)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'directory_path:' . $directory_path));
        }

        $ftp_data= self::get_module(MY_MODULE_NAME_SERVICE)->get_ftp_data($server_name);
        $directory_path = $ftp_data['root_directory'] . MY_DS . $directory_path;

        if (!ftp_mkdir(self::$connects[$server_name], $directory_path)) {
            self::concrete_error(array(MY_ERROR_FTP_CREATE_DIR, 'server_name:' . $server_name . ', directory_path:' . $directory_path));
        }
    }

    public static function replace_to_ftp($source_dirname, $source_filename, $destination_file, $server_name = null)
    {
        $source_file = $source_dirname . MY_DS . $source_filename;
        //загружаем туда
        self::load($source_file, $destination_file, $server_name);
        //удаляем отсюда
        unlink($source_file);
        //если папка тут пуста - удаляем
        //if (is_dir_empty($source_dirname)) {
        //    rmdir($source_dirname);
        //}
    }


    // Удаляем файл из ftp хранилища
    public static function delete_file_from_ftp($destination_file, $server_name = null, $strict = false)
    {
        $server_name = self::check_server_name($server_name);

        if (my_is_empty(@$destination_file)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'destination_file:' . $destination_file));
        }

        $ftp_data= self::get_module(MY_MODULE_NAME_SERVICE)->get_ftp_data($server_name);
        $destination_file = $ftp_data['root_directory'] . MY_DS . $destination_file;

        if ($strict === true) {
            ftp_delete(self::$connects[$server_name], $destination_file);
        } else {
            @ftp_delete(self::$connects[$server_name], $destination_file);
        }
    }


    // Удаляем папку из ftp хранилища - должна быть пустой!!
    public static function delete_dir_from_ftp($destination_dir, $server_name = null, $strict = false)
    {
        $server_name = self::check_server_name($server_name);

        if (my_is_empty(@$destination_dir)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'destination_dir:' . $destination_dir));
        }

        $ftp_data= self::get_module(MY_MODULE_NAME_SERVICE)->get_ftp_data($server_name);
        $destination_dir = $ftp_data['root_directory'] . MY_DS . $destination_dir;

        if ($strict === true) {
            ftp_rmdir(self::$connects[$server_name], $destination_dir);
        } else {
            @ftp_rmdir(self::$connects[$server_name], $destination_dir);
        }
    }



    /*
     * Разъединяется с ftp сервером
     */
    public static function disconnect($server_name)
    {
        ftp_close(self::$connects[$server_name]);
    }


    /*
     * Разъединяется со всеми ftp серверами
     */
    public static function disconnectAll()
    {
        foreach(self::$connects as $connect) {
            ftp_close($connect);
        }
    }

    /*
     * Проверяем коннект для данного сервера
     */
    private static function check_server_name($server_name){
        if (is_null($server_name)) {
            $server_name = self::$current_server_name;
            if (!$server_name) {
                self::concrete_error(array(MY_ERROR_FTP_SERVER_NAME_NOT_DEFINED));
            }
        }
        if (my_is_empty(@self::$connects[$server_name])){
            self::concrete_error(array(MY_ERROR_FTP_CONNECTION_FOR_SERVER_NAME_NOT_SET, 'server_name:' . $server_name));
        }
        return $server_name;
    }
}
