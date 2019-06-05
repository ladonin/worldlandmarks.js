<?php

/*
 * Копирует директорию
 *
 * @param string $srcdir - копируемый путь папки
 * @param string $dstdir - путь куда копируем
 * @param boolean $verbose - отображение хода событий
 */
function dircopy($srcdir, $dstdir, $verbose = false)
{
    $num = 0;
    if (!is_dir($dstdir))
        mkdir($dstdir);
    if ($curdir = opendir($srcdir)) {
        while ($file = readdir($curdir)) {
            if ($file != '.' && $file != '..') {
                $srcfile = $srcdir . '/' . $file;
                $dstfile = $dstdir . '/' . $file;
                if (is_file($srcfile)) {
                    if (is_file($dstfile))
                        $ow = filemtime($srcfile) - filemtime($dstfile);
                    else
                        $ow = 1;
                    if ($ow > 0) {
                        if ($verbose)
                            echo "Copying $srcfile to $dstfile...";
                        if (copy($srcfile, $dstfile)) {
                            touch($dstfile, filemtime($srcfile));
                            $num++;
                            if ($verbose)
                                echo "OKn";
                        } else
                            echo "Error: File $srcfile could not be copied!n";
                    }
                }
                else if (is_dir($srcfile)) {
                    $num += dircopy($srcfile, $dstfile, $verbose);
                }
            }
        }
        closedir($curdir);
    }
    return $num;
}

/*
 * Очищает текст от возможных тегов и прочих ненужных, нечитаемых символов
 * Функция пустая, но можно добавить функционал при необходимости
 *
 * @param string $text
 * @return string
 */
function naking_text($text)
{
    return $text;
}

/*
 * Преобразование нелатинских символов в латинские
 *
 * @param string $var - преобразуемое слово
 *
 * @return string - преобразованное слово
 */
function my_prepare_strange_words($var)
{
    $words_from = array('ö', 'ü', 'ß', 'ć', 'ț', 'ș', 'í', 'ó', 'á', 'ñ', 'ô', 'Î', 'Ō', 'é','č', 'ž', 'ō','É');
    $words_to = array('o', 'u', 'ss', 't', 't', 's', 'i', 'o', 'a', 'n', 'o', 'i', 'o', 'e', 'c', 'z', 'o', 'e');
    return str_replace($words_from, $words_to, $var);
}

/*
 * Преобразование текста в одно слово на латинском языке
 *
 * @param string $var - преобразуемый текст
 * @param string $default - дефолтное значение, если преобразуемый текст пустой
 *
 * @return string - подготовленный текст
 */
function my_prepare_to_one_word($var = null, $default = MY_UNDEFINED_VALUE)
{
    if (!$var) {
        $var = $default;
    }

    $var = my_prepare_strange_words($var);
    return preg_replace('#[,\(\)\']*#', '', strtolower(prepare_to_dir_name($var)));
}

/*
 * Преобразование текста в одно слово, которое можно использовать в названии директории
 *
 * @param string $var - преобразуемый текст
 *
 * @return string - подготовленное слово
 */
function prepare_to_dir_name($var)
{
    return preg_replace('/[ \-\.\,\|«»]/', '_', preg_replace('/[\'\"]/', '', trim($var)));
}

/*
 * Убираем из текста специальные символы
 *
 * @param string $var - преобразуемый текст
 *
 * @return string - подготовленный текст
 */
function clear_special_symbols($text)
{
    return preg_replace('/[ \,\|«»]\'\"\`\!/', ' ', $text);
}

/*
 * Удаляем директорию вместе с содержимым
 *
 * @param string $delfile - путь до директории
 */
function removeDir($delfile)
{
    if (file_exists($delfile)) {
        chmod($delfile, 0777);
        if (is_dir($delfile)) {
            $handle = opendir($delfile);
            while ($filename = readdir($handle))
                if ($filename != "." && $filename != "..") {
                    removeDir($delfile . "/" . $filename);
                }

            closedir($handle);
            @rmdir($delfile);
        } else {
            @unlink($delfile);
        }
    }
}

function is_dir_empty($dir)
{
    $iterator = new \FilesystemIterator($dir);
    return !$iterator->valid();
}




/*
 * Переводим буквы текста с русского на английский (латинский)
 *
 * @param string $var - подготавливаемый текст
 *
 * @return string - подготовленный текст
 */
function my_translater_ru_to_en($text)
{
    $rus = array('А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я', 'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я', ' ');
    $lat = array('a', 'b', 'v', 'g', 'd', 'e', 'e', 'gh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh', 'sch', 'y', 'y', 'y', 'e', 'yu', 'ya', 'a', 'b', 'v', 'g', 'd', 'e', 'e', 'gh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh', 'sch', 'y', 'y', 'y', 'e', 'yu', 'ya', ' ');
    return str_replace($rus, $lat, $text);
}

/*
 * Подготавливаем путь до фотографии метки
 * Если фотография отсутствует на локальном сервере, то возвращается путь до удаленного хранилища, где она должна быть
 * Сделано, для экономии ресурсов локального сервера
 *
 * @param integer $id - id метки
 * @param string $name - название фотографии без префикса
 * @param string $prefix - префикс (обозначает размер фотографии)
 * @param boolean $only_dir - возвратить только путь до папки
 * @param boolean $is_url - путь - URL или внутреннний
 * @param string $service_name - название сервиса (имя сайта) - для многосервисных проектов
 *
 * @return string - подготовленный путь
 */
function prepare_photo_path($id, $name, $prefix, $only_dir = false, $is_url = false, $service_name = null)
{
    if (!$service_name) {
        $service_name = get_service_name();
    }

    $photo_path = MY_FILES_DIR . 'map/' . $service_name . '/' . $id . '/' . $prefix . $name;
    if (file_exists($photo_path)) {
        $photo_name = '';
        if (!$only_dir) {
            $photo_name = $prefix . $name;
        }
        if ($is_url) {
            $current_photo_path = MY_FILES_MAP_URL . $service_name . '/' . $id . '/' . $photo_name;
        } else {
            $current_photo_path = MY_FILES_DIR . 'map/' . $service_name . '/' . $id . '/' . $photo_name;
        }
    } else {
        $photo_name = '';
        if (!$only_dir) {
            $photo_name = $prefix . $name;
        }
        $current_photo_path = 'http://140706.selcdn.ru/mapstore/map/' . $service_name . '/' . $id . '/' . $photo_name;
    }
    return $current_photo_path;
}

/*
 * Возвращает имя сайта, прописанного в конфигурации сервиса
 *
 * @param string $service_name - имя сервиса
 *
 * @return string - имя сайта
 */
function get_site_name($service_name)
{
    $config = require(MY_SERVICES_DIR . $service_name . MY_DS . 'config' . MY_DS . 'config.php');
    if (isset($config['generic']['site_name'])) {
        return $config['generic']['site_name'];
    }
    return false;
}


/*
 * Проверяет - есть ли сервис с таким именем
 *
 * @param string $service_name - имя сервиса
 *
 * @return boolean
 */
function is_valid_service($service_name)
{
    if (is_dir(MY_SERVICES_DIR . $service_name)) {
        return true;
    }

    return false;
}

/*
 * Подготавливает имя страны:
 * Пример:
 *     Папский Престол (Государство-город Ватикан) (преобразует в)=> Ватикан
 *
 * @param string $name - имя страны
 *
 * @return string - подготовленное имя страны
 */
function prepare_country_name($name)
{
    $countries_names_replaces = require(MY_APPLICATION_DIR . 'components' . MY_DS . 'app' . MY_DS . 'countries' . MY_DS . 'countries_names_replaces.php');
    foreach ($countries_names_replaces as $replaced_name => $replace) {
        if ($name === $replaced_name) {
            return $replace;
        }
    }
    return $name;
}

/*
 * Подготавливает имя региона:
 * Пример (если у пользователя русский язык):
 *     'Niederösterreich' (преобразует в)=> 'Нижняя Австрия'
 *
 * @param string $country_code - код страны
 * @param string $state_name - имя региона
 * @param string $state_code - код региона
 * @param string $language - язык
 *
 * @return string - подготовленное имя региона
 */
function translate_state_names($country_code, $state_name, $state_code, $language)
{
    global $connect;

    // Дефолтное значение
    $result = $state_name;

    $sql = "SELECT ct.*, cs.url_code
            FROM country c
            LEFT JOIN country_states_cities_google_translates ct on c.id = ct.country_id
            LEFT JOIN country_states cs on cs.id = ct.only_for_state
            WHERE c.local_code = '" . $country_code . "' AND ct.google_name = \"" . $state_name . "\" AND language = '" . $language . "' AND is_city=0";
    // NOTE  - cs.url_code может равняться null, когда нет указан only_for_state, в таком случае может сработать только первое условие ниже
    $datas = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

    if (count($datas) === 1) {// по сути это единственное условие, условие ниже может сработать если как раньше было (город санкт перербург был указан гуглом 2 раза для двух мест сразу одним названием)
        if ((!$datas[0]['url_code']) || ($datas[0]['url_code'] === $state_code)) {
            $result = $datas[0]['translate'];
        }
    } else {
        foreach ($datas as $data) {
            if ($data['url_code'] === $state_code) {
                $result = $data['translate'];
            }
        }
    }






    return $result ?: $state_name;
}








/*
 * Подготавливает имя города:
 * Пример (если у пользователя русский язык):
 *     'Matale' (преобразует в)=> 'Матале'
 *
 * @param string $country_code - код страны
 * @param string $state_name - имя города
 * @param string $state_code - код региона
 * @param string $language - язык
 *
 * @return string - подготовленное имя города
 */
function translate_city_names($country_code, $city_name, $state_code, $language)
{
    global $connect;

    // Дефолтное значение
    $result = $city_name;

    $sql = "SELECT ct.translate
            FROM country c
            LEFT JOIN country_states_cities_google_translates ct on c.id = ct.country_id
            LEFT JOIN country_states cs on cs.id = ct.only_for_state
            WHERE cs.url_code = '" . $state_code . "' AND c.local_code = '" . $country_code . "' AND ct.google_name = \"" . $city_name . "\" AND language = '" . $language . "' AND is_city=1 LIMIT 1";
    // NOTE  - cs.url_code может равняться null, когда нет указан only_for_state, в таком случае может сработать только первое условие ниже
    $data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();


    if (!$data['translate']) {
        // значит страна без штатов (или гугл думает что в ней нет штатов) и надо подобрать перевод для города не относящегося к штату
    $sql = "SELECT ct.translate
            FROM country c
            LEFT JOIN country_states_cities_google_translates ct on c.id = ct.country_id
            LEFT JOIN country_states cs on cs.id = ct.only_for_state
            WHERE c.local_code = '" . $country_code . "' AND ct.google_name = \"" . $city_name . "\" AND language = '" . $language . "' AND is_city=1 LIMIT 1";

        $data = $conn->query($sql, \PDO::FETCH_ASSOC)->fetch();

    }


    if ($data['translate']) {
        $result = $data['translate'];
    }

    return $result ?: $city_name;
}







/*
 * Проверяет - имеет ли страна регионы
 *
 * @param string $country_code - код страны
 *
 * @return boolean
 */
function has_states($country_code)
{
    global $connect;

    if ($country_code === MY_UNDEFINED_VALUE) {
        // например в случае, если гугл не знает местопложения и country_code от этого стал undefined
        return false;
    }

    $sql = "SELECT cp.has_states
        FROM country c
        LEFT JOIN country_params cp on c.id = cp.country_id
        WHERE c.local_code = '".$country_code."'";

    $data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();

    $result = isset($data['has_states']) ? (boolean)$data['has_states'] : false;

    return $result;
}






/*
 * Берет все страны
 *
 * @return array
 */
function get_countries($language = MY_LANGUAGE_RU)
{
    global $connect;

    $sql = "SELECT
            c.id as id,
            c.local_code as code,
            cn.name as name
        FROM country c
        LEFT JOIN country_name cn on c.id = cn.country_id
        WHERE cn.language = '".$language."'
        ORDER by cn.name";

    return $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
}



/*
 * Берет статью по id
 *
 * @return array
 */
function get_articles($id=null)
{
    global $connect;

    $id = (int)$id;
    if ($id) {
        $sql = "SELECT *
            FROM ".get_service_name()."_articles
            WHERE id = " .(int)$id;

        return $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
    } else {
        $sql = "SELECT *
            FROM ".get_service_name()."_articles";

        return $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
    }
}



/*
 * Хеширует введенное значение
 *
 * @param string $value - хешируемое значение
 *
 * @return string - хешированное значение
 */
function hashing($value)
{
    $salt = generate_salt();
    $hash = crypt($value, $salt);
    return $hash;
}

/*
 * Возвращает соль для хеширования
 *
 * @return string - соль
 */
function generate_salt()
{
    $random = return_random();
    return MY_CRYPT_HASH_ALGORYTM_CODE . $random;
}

function is_same($a, $b)
{
    if (!is_string($a) || !is_string($b))
        return false;

    $mb = function_exists('mb_strlen');
    $length = $mb ? mb_strlen($a, '8bit') : strlen($a);
    if ($length !== ($mb ? mb_strlen($b, '8bit') : strlen($b)))
        return false;

    $check = 0;
    for ($i = 0; $i < $length; $i+=1)
        $check|=(ord($a[$i]) ^ ord($b[$i]));

    return $check === 0;
}
/*
 * Проверяет соответствие пароля хешу
 *
 * @param string $value - сравниваемое значение
 * @param string $hash - хеш
 *
 * @return boolean
 */
function hash_equals_to_value($value, $hash)
{
    $test = crypt($value, $hash);
    return is_same($test, $hash);
}

/*
 * Возвращает случайное слово
 *
 * @param integer $lenght - длина слова
 *
 * @return string - случайное слово
 */
function return_random($lenght = 3)
{
    $random = '';
    for ($i = 0; $i < $lenght; $i++) {
        $random.=chr(rand(97, 122));
    }
    return $random;
}

/*
 * Подготавливает из переменной массив,
 * если переменная не массив, то возвратится пустой массив
 *
 * @param mix $value - переменная
 *
 * @return array - подготовленный массив
 */
function prepare_to_array($value)
{
    return my_array_is_not_empty($value) ? $value : array();
}

/*
 * Возвращает тип базы данных (mysql, redis и т.д.)
 *
 * @return string - тип базы данных
 */
function get_db_type()
{
    static $config;
    if (!isset($config) || !$config) {
        $config = require(MY_APPLICATION_DIR . 'config' . MY_DS . 'config.php');
    }
    return key($config['db']);
}

/*
 * Возвращает имя сервиса
 *
 * @return string - имя сервиса
 */
function get_service_name()
{
    if (isset($_REQUEST[MY_SERVICE_VAR_NAME]) && ($_REQUEST[MY_SERVICE_VAR_NAME])) {
        return $_REQUEST[MY_SERVICE_VAR_NAME];
    }
    return \components\app\Map::get_name();
}

/*
 * Возвращает список данных категорий сервиса
 *
 * @param string $language - язык, на котором требуется получить именя категорий
 * @param integer $sort_by_id - сортировка по id или нет
 * @param string $service_name - имя сервиса
 *
 * @return array - список данных категорий сервиса
 */
function get_categories($language, $sort_by_id = true, $service_name=null)
{
    if(is_null($service_name)){
        $service_name = $_REQUEST[MY_SERVICE_VAR_NAME];
    }
    $string = 'form/map_new_point/category/';
    $categories = require(MY_SERVICES_DIR . $service_name . MY_DS . 'config' . MY_DS . 'config.php');
    $words = require(MY_SERVICES_DIR . $service_name . MY_DS . 'language' . MY_DS . $language . '.php');

    foreach ($categories['categories']['categories_codes'] as &$data) {
        $data['name'] = $words['form/map_new_point/category/' . $data['id']];
    }
    unset($data);

    $result = $categories['categories']['categories_codes'];

    if ($sort_by_id) {
        $result_sorted = array();
        foreach ($result as $data) {

            $result_sorted[$data['id']] = $data;
        }
        ksort($result_sorted);
        $result = $result_sorted;
    }
    return $result;
}


/*
 * Копируем файлы со сторонних сайтов, даже защищенных
 */
function download_image_by_url($image_url, $image_file)
{
    $fp = \fopen($image_file, 'w+');// open file handle

    $ch = \curl_init($image_url);

    $agent = 'Accept:image/jpeg,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8 User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11';

    \curl_setopt($ch, CURLOPT_USERAGENT, $agent);

    \curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    \curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
    \curl_setopt($ch, CURLOPT_TIMEOUT, 44000);
    \curl_setopt($ch, CURLOPT_AUTOREFERER, false);
    \curl_setopt($ch, CURLOPT_REFERER, "http://google.com");
    \curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    \curl_setopt($ch, CURLOPT_HEADER, 0);
    \curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE); // Follows redirect responses.
    \curl_setopt($ch, CURLOPT_USERPWD, "user:password");

    $raw = \curl_exec($ch);

    $httpCode = \curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (($raw === false) || ($httpCode == 404) || ($httpCode == 403)) {
        return false;
    }

    \curl_close($ch);
    $localName = $image_file; // The file name of the source can be used locally
    if (\file_exists($localName)) {
        \unlink($localName);
    }

    $fp = \fopen($localName, 'x');
    \fwrite($fp, $raw);
    \fclose($fp);
    return true;
}









function real_ip()
{
    $header_checks = array(
        'HTTP_CLIENT_IP',
        'HTTP_PRAGMA',
        'HTTP_XONNECTION',
        'HTTP_CACHE_INFO',
        'HTTP_XPROXY',
        'HTTP_PROXY',
        'HTTP_PROXY_CONNECTION',
        'HTTP_VIA',
        'HTTP_X_COMING_FROM',
        'HTTP_COMING_FROM',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_FORWARDED',
        'HTTP_X_CLUSTER_CLIENT_IP',
        'HTTP_FORWARDED_FOR',
        'HTTP_FORWARDED',
        'ZHTTP_CACHE_CONTROL',
        'REMOTE_ADDR'
    );

    foreach ($header_checks as $key)
    {
        if (array_key_exists($key, $_SERVER) === true)
        {
            foreach (explode(',', $_SERVER[$key]) as $ip)
            {
                $ip = trim($ip);

                //filter the ip with filter functions
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) !== false)
                {
                    return $ip;
                }
            }
        }
    }
}
function isSearchBot($ip=''){

    if (!$ip) {
        $ip = real_ip();
    }
    $ips = array(
        '77.88.22.',
        '77.88.23.',
        '87.250.224.',
        '87.250.255.',
        '93.158.12',
        '93.158.13',
        '93.158.14',
        '93.158.15',
        '93.158.16',
        '93.158.17',
        '93.158.18',
        '93.158.19',
        '95.108.12',
        '95.108.13',
        '95.108.14',
        '95.108.15',
        '95.108.16',
        '95.108.17',
        '95.108.18',
        '95.108.19',
        '95.108.20',
        '95.108.21',
        '95.108.22',
        '95.108.23',
        '95.108.24',
        '95.108.25',
        '213.180.19',
        '213.180.20',
        '213.180.21',
        '64.68.80.',
        '64.68.81.',
        '64.68.82.',
        '64.68.83.',
        '64.68.84.',
        '64.68.85.',
        '64.68.86.',
        '64.68.87.',
        '64.233.160.',
        '64.233.161.',
        '64.233.162.',
        '64.233.163.',
        '64.233.164.',
        '64.233.165.',
        '64.233.166.',
        '64.233.167.',
        '64.233.168.',
        '64.233.169.',
        '64.233.170.',
        '64.233.171.',
        '64.233.172.',
        '64.233.173.',
        '64.233.174.',
        '64.233.175.',
        '66.102.0.',
        '66.102.1.',
        '66.102.2.',
        '66.102.3.',
        '66.102.4.',
        '66.102.5.',
        '66.102.6.',
        '66.102.7.',
        '66.102.8.',
        '66.102.9.',
        '66.102.10.',
        '66.102.11.',
        '66.102.12.',
        '66.102.13.',
        '66.102.14.',
        '66.102.15.',
        '66.231.188.',
        '66.249.6',
        '66.249.7',
        '66.249.8',
        '66.249.9',
        '72.14.19',
        '72.14.20',
        '72.14.21',
        '72.14.22',
        '72.14.23',
        '72.14.24',
        '72.14.25',
        '209.85.1',
        '209.85.2',
        '216.239.3',
        '216.239.4',
        '216.239.5',
        '216.239.6',
        '67.195.',
        '69.147.6',
        '69.147.7',
        '69.147.8',
        '69.147.9',
        '69.147.10',
        '69.147.11',
        '69.147.12',
        '72.30.',
        '74.6.',
        '81.19.64.',
        '81.19.65.',
        '81.19.66.',
        '94.100.17',
        '94.100.18',
        '195.239.211.',
        '65.52.',
        '65.53.',
        '65.54.',
        '65.55.',
        '207.46.',
        '88.212.202.',
        '77.91.224.',
        );

        $pattern = implode('|', $ips);
        $pattern = str_replace('.', '\.', $pattern);

        return (boolean)preg_match("#$pattern#", $ip);
}