/*
 * Module application/components/express/Language
 * const Language = require('application/components/express/Language');
 *
 * Responsible for language of rendered text in views
 */

const Consts = require('application/express/settings/Constants');
const Component = require('vendor/Component');
const Service = require('application/express/components/base/Service');

class Language extends Component{

    constructor(){
        super();
        /*
         * Default language
         *
         * @type string
         */
        this.default_language = Consts.MY_LANGUAGE_RU;


        /*
         * Application language
         *
         * @type string
         */
        this.language;

        /*
         * Available languages
         *
         * @type array
         */
        this.available_languages=[
            Consts.MY_LANGUAGE_RU,
            Consts.MY_LANGUAGE_EN
        ];

        /*
         * Basic dictionary
         *
         * @type array
         */
        this.base_words;

        /*
         * Service dictionary
         *
         * @type array
         */

        nextTTTTTTTTTTTT - продолжать с этого момента
        this.service_words = Service.get_words(this.get_language())
        $this->base_words = require_once(MY_APPLICATION_DIR . 'config' . MY_DS . 'language' . MY_DS . $this->get_language() . '.php');




    }













}




final class Language extends Component
{

    use \vendor\traits\patterns\t_singleton;








    /*
     * Проверка - доступен ли такой язык
     *
     * @param string $language - проверяемый код языка
     *
     * @return boolean
     */
    public function is_available_language($language)
    {
        if (in_array($language, self::$available_languages)) {
            return true;
        }
        self::concrete_error(array(MY_ERROR_LANGUAGE_CODE_NOT_FOUND, 'language="' . $language . '"'));
    }

    /*
     * Получить текст из массива по его идентификатору (адресу)
     *
     * @param string $adress - адрес текста в массиве
     * @param array $vars - дополнительные переменные, которыми может быть заменена часть возвращаемого текста
     *
     * @return string - найденный подготовленный текст
     */
    public function get_text($adress, $vars = null)
    {
        if (isset($this->base_words[$adress])) {

            $text = $this->base_words[$adress];

            if (is_array($vars)) {
                foreach ($vars as $key => $value) {
                    $text = str_replace('%' . $key . '%', $value, $text);
                }
            }
            return $text;
        } else if (isset($this->service_words[$adress])) {
            $text = $this->service_words[$adress];
            if (is_array($vars)) {
                foreach ($vars as $key => $value) {
                    $text = str_replace('%' . $key . '%', $value, $text);
                }
            }
            return $text;
        } else {
            self::concrete_error(array(MY_ERROR_LANGUAGE_WORD_NOT_FOUND, 'language="' . $this->get_language() . '", word="' . $adress . '"'));
        }
    }

    /*
     * Записать язык в сессию
     *
     * @param string $language - код языка
     */
    public function set_language_in_session($language)
    {
        if (in_array($language, self::$available_languages)) {
            $_SESSION['site']['language'] = $language;
        } else {
            $_SESSION['site']['language'] = self::DEFAULT_LANGUAGE;
        }
    }

    /*
     * Установить язык приложения
     */
    public static function set_language()
    {
        if (my_is_not_empty(@$_SESSION['site']['language'])) {
            if (in_array($_SESSION['site']['language'], self::$available_languages)) {
                $language = $_SESSION['site']['language'];
            } else {
                $language = self::DEFAULT_LANGUAGE;
            }
            unset($_SESSION['site']['language']);
            //обновляем куки
            self::set_cookie(MY_COOKIE_NAME_SITE_LANGUAGE, $language, MY_COOKIE_MAX_LIFETIME_VALUE);
        }

        $cookie_language = self::get_cookie(MY_COOKIE_NAME_SITE_LANGUAGE);
        //если куки нет или её значение неопознанно
        if (is_null($cookie_language) || (!in_array($cookie_language, self::$available_languages))) {
            //если первый раз зашли и сессия с куками пустые, то определяем язык из данных клинета
            $cookie_language = self::get_client_language();
            self::set_cookie(MY_COOKIE_NAME_SITE_LANGUAGE, $cookie_language, MY_COOKIE_MAX_LIFETIME_VALUE);
        }

        self::$language = $cookie_language;
    }

    /*
     * Получить язык приложения
     *
     * @return string
     */
    public function get_language()
    {
        return self::$language;
    }

    /*
     * Орпеделить язык клиента
     *
     * @return string - код языка клиента
     */
    public static function get_client_language()
    {

        $languages_data=self::get_module(MY_MODULE_NAME_SERVICE)->get_languages();
        $client_language=isset($_SERVER["HTTP_ACCEPT_LANGUAGE"])?$_SERVER["HTTP_ACCEPT_LANGUAGE"]:'';

        foreach ($languages_data as $language) {

            if(preg_match('/^'.$language['code'].'\-/',$client_language)){
                return $language['code'];
            }
        }

        return self::DEFAULT_LANGUAGE;
    }
}
