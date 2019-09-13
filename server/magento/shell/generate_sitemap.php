<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
date_default_timezone_set('UTC');

define('MY_DS', DIRECTORY_SEPARATOR);
require_once(realpath(dirname(__FILE__)) . MY_DS . '..' . MY_DS . 'admin' . MY_DS . 'generic' . MY_DS . 'constants.php');

require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once(MY_APPLICATION_DIR . '..' . MY_DS . 'admin' . MY_DS . 'generic' . MY_DS . 'connection.php');
$config_allows = require_once(MY_APPLICATION_DIR . 'config' . MY_DS . 'allows.php');
$map = @$GLOBALS['argv'][1];
$site_name = get_site_name($map);
if (!is_valid_service($map) || !$site_name) {
    echo('Укажите валидный сервис');
    exit();
}
//для хостинга - указываем путь, где будет лежать sitemap файл
//define('MY_SITE_DOC_ROOT', realpath(dirname(__FILE__)) . MY_DS . '..' . MY_DS . '..' . MY_DS . $map . MY_DS);
define('MY_SITE_DOC_ROOT', realpath(dirname(__FILE__)) . MY_DS . '..' . MY_DS . '..' . MY_DS . '..' . MY_DS . $map . MY_DS . 'public_html' . MY_DS);

$sql = "SELECT "
        . "DISTINCT gc.country_code, gc.state_code, c.id "
        . "FROM " . $map . "_geocode_collection gc "
        . "LEFT JOIN " . $map . "_map_data c ON gc.map_data_id = c.id "
        . "WHERE gc.language='en'";

$countries = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
$result = array();
foreach ($countries as $country) {
    $result[$country['country_code']][$country['state_code']][$country['id']] = 1;
}
if (!$result) {
    echo('Сайт не найден по такому имени:' . $map);
    exit();
}



require_once(MY_APPLICATION_DIR . '..' . MY_DS . 'admin' . MY_DS . 'classes' . MY_DS . 'Sitemap.php');

// для www и без него - два файла
$site_types = array('www', '');

foreach ($site_types as $type) {

    $sitemap = new Sitemap();

    if ($type) {
        $site = 'http://' . $type . '.' . $site_name;
    } else {
        $site = 'http://' . $site_name;
    }

    // Главная
    $sitemap->addItem(new SitemapItem(
            $site, // URL.
            time(), // Время в формате timestamp.
            SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
            1 // Приоритет страницы.
    ));

    // Карта сайта по странам - главная страница
    $sitemap->addItem(new SitemapItem(
            $site . '/catalog/sitemap_countries', // URL.
            time(), // Время в формате timestamp.
            SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
            1 // Приоритет страницы.
    ));




    // Карта сайта по категориям - главная страница
    $sitemap->addItem(new SitemapItem(
            $site . '/catalog/sitemap_categories', // URL.
            time(), // Время в формате timestamp.
            SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
            1 // Приоритет страницы.
    ));

    // Карта сайта по категориям - список категорий со всеми страницами
    $categories = get_categories(MY_LANGUAGE_RU, true, $map);
    foreach ($categories as $category) {
        $data_table = $map . '_map_data';
        $sql = "SELECT COUNT(*) as count FROM $data_table where category = " . (int) $category['id'] . " OR subcategories REGEXP '[[:<:]]" . (int) $category['id'] . "[[:>:]]'";
        $placemarks = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
        $placemark_count = $placemarks['count'];
        if ($placemark_count > 0) {
            $pages_count = ceil($placemark_count / $config_allows['max_pager_rows']);

            for ($i = 1; $i <= $pages_count; $i++) {
                $sitemap->addItem(new SitemapItem(
                        $site . '/catalog/sitemap_categories/' . $category['id'] . '/' . $i, // URL.
                        time(), // Время в формате timestamp.
                        SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
                        0.9 // Приоритет страницы.
                ));
            }
        }
    }



    // Каталог - список стран
    $sitemap->addItem(new SitemapItem(
            $site . '/catalog', // URL.
            time(), // Время в формате timestamp.
            SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
            0.9 // Приоритет страницы.
    ));

    foreach ($result as $country_code => $states) {

        // Страна
        $sitemap->addItem(new SitemapItem(
                $site . '/catalog/' . $country_code, // URL.
                time(), // Время в формате timestamp.
                SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
                0.8 // Приоритет страницы.
        ));

        // Карта сайта по странам - список стран со всеми страницами
        $sql = "SELECT COUNT(*) as count FROM " . $map . "_geocode_collection WHERE country_code='$country_code'";
        $placemarks = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
        $placemark_count = $placemarks['count'];
        if ($placemark_count > 0) {
            $pages_count = ceil($placemark_count / $config_allows['max_pager_rows']);

            for ($i = 1; $i <= $pages_count; $i++) {
                $sitemap->addItem(new SitemapItem(
                        $site . '/catalog/sitemap_countries/' . $country_code . '/' . $i, // URL.
                        time(), // Время в формате timestamp.
                        SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
                        0.9 // Приоритет страницы.
                ));
            }
        }


        foreach ($states as $state_name => $placemarks) {

            // Регионы
            if ($state_name !== MY_UNDEFINED_VALUE) {
                $sitemap->addItem(new SitemapItem(
                        $site . '/catalog/' . $country_code . '/' . $state_name, // URL.
                        time(), // Время в формате timestamp.
                        SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
                        0.7 // Приоритет страницы.
                ));
            }

            foreach ($placemarks as $id => $value) {
                // Метки
                $url = $site . '/catalog/' . $country_code . '/' . $state_name . '/' . $id;
                if ($state_name === MY_UNDEFINED_VALUE) {
                    $url = $site . '/catalog/' . $country_code . '/' . $id;
                }
                $sitemap->addItem(new SitemapItem(
                        $url, // URL.
                        time(), // Время в формате timestamp.
                        SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
                        0.5 // Приоритет страницы.
                ));
            }
        }
    }



    // Список статей по странам - главная страница
    $sitemap->addItem(new SitemapItem(
            $site . '/article/countries', // URL.
            time(), // Время в формате timestamp.
            SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
            1 // Приоритет страницы.
    ));


    // Список статей по категориям - главная страница
    $sitemap->addItem(new SitemapItem(
            $site . '/article/categories', // URL.
            time(), // Время в формате timestamp.
            SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
            1 // Приоритет страницы.
    ));


    // Список статей по странам - страницы для каждой страны
    // Взять количество меток для каждой страны
    $sql = "SELECT
            COUNT(*) as count,
            country.local_code as code
        FROM {$map}_articles
        LEFT JOIN
            country on {$map}_articles.country_id = country.id
        GROUP BY {$map}_articles.country_id";
    $countries_data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

    // Для каждой страны
    foreach ($countries_data as $data) {

        $articles_count = $data['count'];
        if ($articles_count > 0) {
            $pages_count = ceil($articles_count / $config_allows['max_pager_rows']);

            for ($i = 1; $i <= $pages_count; $i++) {
                $sitemap->addItem(new SitemapItem(
                        $site . '/article/countries/' . $data['code'] . '/' . $i, // URL.
                        time(), // Время в формате timestamp.
                        SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
                        0.9 // Приоритет страницы.
                ));
            }
        }
    }

    // Список статей по категориям - страницы для каждой категории
    // Берем все категории
    $categories = get_categories(MY_LANGUAGE_RU, true, $map);
    foreach ($categories as $category) {

        // Взять количество меток для каждой категории
        $sql = "SELECT
                COUNT(*) as count
            FROM {$map}_articles
            WHERE categories REGEXP '[[:<:]]" . $category['id'] . "[[:>:]]'
            ";
        $articles_data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
        $articles_count = $articles_data['count'];
        if ($articles_count > 0) {
            $pages_count = ceil($articles_count / $config_allows['max_pager_rows']);

            for ($i = 1; $i <= $pages_count; $i++) {
                $sitemap->addItem(new SitemapItem(
                        $site . '/article/categories/' . $category['code'] . '/' . $i, // URL.
                        time(), // Время в формате timestamp.
                        SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
                        0.9 // Приоритет страницы.
                ));
            }
        }
    }

    // Собственно сами страницы статей
    $sql = "SELECT *
        FROM {$map}_articles";
    $articles_data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

    // Для каждой статьи
    foreach ($articles_data as $data) {

        $sitemap->addItem(new SitemapItem(
                $site . '/article/' . $data['id'], // URL.
                time(), // Время в формате timestamp.
                SitemapItem::weekly, //Частота обновления (константы класса SitemapItem).
                0.7 // Приоритет страницы.
        ));
    }

    $sitemap->generate(MY_SITE_DOC_ROOT . $type . 'sitemap.xml');

    echo("+++");
}
?>