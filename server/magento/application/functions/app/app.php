<?php

use \components\app as components;
use \vendor\Component;
/*
 * Возвращает подготовленный html код для кнопки с картинкой внутри
 *
 * @param string $title - заголовок внутри кнопки
 * @param string $device - картинки мобильной версии или десктопной
 *
 * @return string
 */
function my_htmlller_buttons($title = null, $device = null)
{
    if (!$device) {
        $device = get_device();
    }
    $icons = 'icons_' . $device . '.png';

    $return = ''
            . '<div class="icon">'
            . '<img src="/img/' . $icons . '">'
            . '</div>';
    if ($title) {
        $return .= '<div class="button_text">'
                . my_pass_through(@$title)
                . '</div>';
    }
    return $return;
}






/*
 * Проверяет координаты на достоверность
 *
 * @param float $x - x
 * @param float $y - y
 *
 * @return boolean
 */
function my_check_coords($x = null, $y = null, $error_call = true)
{
    if (!$x || !$y || $x >= 180 || $x <= -180 || $y <= -90 || $y >= 90) {
        if ($error_call) {
            Component::concrete_error(array(MY_ERROR_WRONG_COORDS, 'x:' . $x . ', y:' . $y));
        } else {
            return false;
        }
    }
    return true;
}





/*
 * Возвращает url картинки флага
 *
 * @param string $country_code - код страны
 *
 * @return string
 */
function get_flag_url($country_code)
{
    return MY_IMG_URL . "flags/" . $country_code . ".png";
}

/*
 * Возвращает случайную картинку метки
 *
 * @param array $photos - фотки метки
 * @param string $prefix - префикс размера фотки
 * @param boolean $return_sizes - возвращаем url с размерами или просто url
 *
 * @return string/array
 */
function get_random_placemark_photo(array $photos, $prefix, $return_sizes = false)
{
    $count = count($photos) - 1;
    $photo_id = 0; //////////////$photo_id = rand(0, $count);
    $url = my_pass_through(@$photos[$photo_id]['dir']) . my_pass_through(@$prefix) . '_' . my_pass_through(@$photos[$photo_id]['name']);

    if ($return_sizes) {
        return array(
            'url' => $url,
            'width' => $photos[$photo_id]['width'],
            'height' => $photos[$photo_id]['height']
        );
    }

    return $url;
}

/*
 * Обрезание текста с сохраненим целостности слов
 *
 * @param string $text - обрезаемый текст
 * @param integer $length - длина обрезки
 *
 * @return string - обрезанный текст
 */
function get_cutted_text($text, $length, $dots = true)
{
    if (!$text) {
        return '';
    }

    $text = naking_text($text);

    //Первым делом, уберём все html элементы:
    $text = strip_tags($text);


    $str_length = mb_strlen($text, 'UTF-8');
    //может и не надо обрезать
    if ($str_length < $length) {
        return $text;
    }

    //Теперь обрежем его на определённое количество символов:
    $text = mb_substr($text, 0, $length, 'UTF-8');
    //Затем убедимся, что текст не заканчивается восклицательным знаком, запятой, точкой или тире:
    $text = rtrim($text, "!,.-");

    //Напоследок находим последний пробел, устраняем его и ставим троеточие:
    $text = preg_replace('#(.*?)(?: [^ ]*)$#', '$1', $text);

    return $text . ($dots ? ' ...' : '');
}

/*
 * Перевод имени региона на язык пользователя
 *
 * @param string $state_name - имя региона
 * @param string $state_code - код региона
 *
 * @return string - переведенное имя региона
 */
function auto_translate_state($state_name, $state_code)
{
    $language_component = components\Language::get_instance();
    $countries_component = components\Countries::get_instance();
    $language = $language_component->get_language();
    $country_code = $countries_component->get_country_code_from_url();
    return $countries_component->translate_state_names($language, $country_code, $state_name, $state_code);
}


function my_get_request_uri(){
return  MY_DOMEN . $_SERVER['REQUEST_URI'];

}