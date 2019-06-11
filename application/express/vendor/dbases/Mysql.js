/*
 * File application/express/vendor/dbases/DBaseMysql.js
 *
 * Base database component for MySql
 */




const syncMySql = require('sync-mysql');
const asyncMySql = require('mysql2');

const MySqlConfig = require('application/express/settings/gitignore/MySql');
const Functions = require('application/express/functions/BaseFunctions');
const ErrorHandler = require('application/express/components/ErrorHandler');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');
const Model = require('vendor/Model');
const Service = require('application/express/components/base/Service');


//######### Create connections #########

// You can use only one of two connections per request
//
// If your request requires only fetching data from db (SELECT queries)
// then you can use either async or sync conneection
//
// If your request also make changes in db,
// then you should use ONLY sync connection to provide correct transaction work
//
// Connection by default is sync

/*
 * DB sync connection
 * Use in requests where needed db changes
 *
 * @type object
 */
let syncConnection = new syncMySql(MySqlConfig.connect);

// Checking sync connection
try{
    syncConnection.query("SELECT 1");
} catch(e){
    ErrorHandler.process(ErrorCodes.ERROR_DB_NO_CONNECT, 'mysql: ' +  e.code);
}

/*
 * DB async connection
 *
 * @type resource
 */
const asyncConnection = asyncMySql.createPool(MySqlConfig.connect).promise();

//######################################


class DBase_Mysql extends Model
{

    constructor(){
        super();

        /*
         * Table name
         *
         * @type string
         */
        this.table_name;

        /*
         * DB table Fields
         *
         * @type object
         */
        this.fields;

        /*
         * Initial db fields data for returning updated fields to initial statement
         *
         * @type object
         */
        this.fields_initial_data;
    }

////ATTENTION - обратите внимание
    snapshot_fields_data(){
        this.fields_initial_data = Functions.clone(this.fields);
    }





    /*
     * Get connection
     *
     * @param boolean async - should we use async query or sync
     *
     * @return resource/object
     */
    get_connection(async = false)
    {
        return async === true ? asyncConnection : syncConnection;
    }


    /*
     * Execute query and return result
     *
     * @param string - sql query
     * @param optional array - values to be escaped
     * @param boolean async - should we use async query or sync
     *
     * @return array of objects or empty array / promise
     */
    query(sql, values = [], async = false) {

        return async === true ? query_async(sql, values) : query_sync(sql, values);
    }

    /*
     * Async query
     *
     * @param string - sql query
     * @param optional array - values to be escaped
     *
     * @return promise
     */
    query_async(sql, values = []){
        return this.get_connection(true)
            .query(sql, values)
            .catch(err => {
                ErrorHandler.process(
                    ErrorCodes.ERROR_MYSQL
                        + ': ' + err.code
                        + ': request[' +  sql + '], values[' + Functions.toString(values) + ']',
                    Consts.LOG_MYSQL_TYPE
                );
            });//.then(r=>{console.log(r[0])});
    }


    /*
     * Sync query
     *
     * @param string - sql query
     * @param optional array - values to be escaped
     *
     * @return array of objects or empty array
     */
    query_sync(sql, values = []) {
        let result = [];
        try {
            result = this.get_connection().query(sql, values);
        } catch(e){
            ErrorHandler.process(
                ErrorCodes.ERROR_MYSQL
                    + ': ' + e.code
                    + ': request[' +  sql + '], values[' + Functions.toString(values) + ']',
                Consts.LOG_MYSQL_TYPE
            );
        }
        return result;
    }





    /*
     * Get data by id
     *
     * @param integer idValue - id key value
     * @param boolean async - should we use async query or sync
     *
     * @return array / promise
     */
    get_by_id(idValue, async = false)
    {
        let id = Functions.toInt(idValue)

        if (!id) {
            ErrorHandler.process(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'id [ ' +  Functions.toString(idValue) + ']');
        }

        return query("SELECT * FROM " + this.get_table_name() + " WHERE id = " + id, [], async);
    }






    /*
     * Validate all fields
     *
     * @param string filter_type - validation type
     *
     * @return boolean
     */
    filter_all_fields(filter_type = Consts.FILTER_TYPE_ALL)
    {
        // Check all model fields
        for(let key in this.fields) {
           this.filter(key, this.fields[key]['value'], filter_type);
        }
        return true;
    }
















    /*
     * Sync update field by id
     *
     * @param integer idValue - id key value
     *
     * @return boolean
     */
    update(idValue = null)
    {

        let id = Functions.toInt(idValue)

        if (!id) {
            ErrorHandler.process(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'id [ ' +  Functions.toString(idValue) + ']');
        }

        this.filter_all_fields(Consts.FILTER_TYPE_WITHOUT_REQUIRED);

        try {
            array_values = [];

            let sql = 'update ' + this.get_table_name() + " set modified='" + Consts.TIME_CURRENT + "'";



            for(let field_name in this.fields) {

                let field = this.fields[field_name];

                // Field (column) will be updated ONLY if we set a value to field
                if (Functions.isSet(field['value'])) {

                    /*
                     * Rule 'none' tells that we should not update this field by hand
                     * For example - 'created' field (if specified in model fields)
                     */
                    if (Functions.in_array('none', field['rules'])) {
                        continue;
                    }

                    sql += ',' + field_name + '=?';

                    this.processing_value(field);
                    array_values.push(field['value']);













                }
            }
            $sql .= ' where id = ' . (int) $id;

            $stmt = self::$connect->prepare($sql);

            $stmt = $this->execute($stmt, $array_values);

            // сбрасываем данные
            $this->fields = $this->fields_primary_data;
            return true;
        } catch (\PDOException $e) {
            self::concrete_error(array(MY_ERROR_MYSQL, '[error update] ' . $e->getMessage()), MY_LOG_MYSQL_TYPE);
        }
    }











    /*
     * Processing field value according its 'processing' settings
     *
     * @param array field - field data
     */
    processing_value(field)
    {
        if (Functions.is_not_empty(field['processing']) && Functions.is_not_empty(field['value'])) {

            if (Functions.in_array("strip_tags", field['processing'])) {
                field['value'] = Functions.strip_tags(field['value']);
            }

            if (Functions.in_array("htmlspecialchars", field['processing'])) {
                field['value'] = Functions.escapeHtml(field['value']);
            }

            if (Functions.in_array("strip_spec_tags", field['processing'])) {
                field['value'] = field['value'].replace(/\[.*?\]/gi, '');
            }

            let flag_a_tag_used = false;
            if (Functions.in_array("spec_tags", field['processing'])) {

                let tags = Service.get_text_form_tags();














                foreach ($tags as $tag) {
                    if ($tag['code'] === MY_FORM_TEXT_TAG_CODE_B) {
                        $value['value'] = preg_replace('#\[b\](.+?)\[\/b\]#', '<b>$1</b>', $value['value']);
                    } else if ($tag['code'] === MY_FORM_TEXT_TAG_CODE_P) {

                        // Удаляем переносы строк в абзаце
                        $value['value'] = preg_replace_callback(
                                "#\[p\](.+?)\[\/p\]#s", function ($matches) {
                            return str_replace("\n", '', str_replace("\n\r", '', str_replace("\r\n", '', $matches[0])));
                        }, $value['value']);
                        $value['value'] = preg_replace('#\[p\](.+?)\[\/p\]#s', '<p class="text_form_tag_p">$1</p>', $value['value']);
                        //убираем переносы строк после блока, которые добавляли для наглядности редакторе
                        $value['value'] = str_replace("</p>\n", '</p>', str_replace("</p>\n\r", '</p>', str_replace("</p>\r\n", '</p>', $value['value'])));
                    } else if ($tag['code'] === MY_FORM_TEXT_TAG_CODE_STRONG) {
                        $value['value'] = preg_replace('#\[strong\](.+?)\[\/strong\]#', '<strong>$1</strong>', $value['value']);
                    } else if ($tag['code'] === MY_FORM_TEXT_TAG_CODE_A) {
                        if (self::get_module(MY_MODULE_NAME_ACCOUNT)->is_admin()) {
                            $follow = '';
                        } else {
                            $follow = 'rel="nofollow"';
                        }
                        $flag_a_tag_used = true;
                        $value['value'] = preg_replace('#\[a\=(.+?)\](.+?)\[\/a\]#s', '<a href="$1" ' . $follow . '>$2</a>', $value['value']);
                        $value['value'] = preg_replace('#\[a\=(.+?)\]\[\/a\]#', '<a href="$1" ' . $follow . '>$1</a>', $value['value']);
                    } else if ($tag['code'] === MY_FORM_TEXT_TAG_CODE_IMAGE_ADVANCED) {
                        $value['value'] = preg_replace('#\[img url=\"(.+?)\" style=\"(.+?)\"]#', '<img src="$1" style="$2"/>', $value['value']);
                    }



                }
            }

            if ( in_array("urls", $value['processing'])) {

                if (((self::get_module(MY_MODULE_NAME_ACCOUNT)->is_admin()||(components\User::admin_access_authentication())) && (self::get_module(MY_MODULE_NAME_SERVICE)->is_available_to_process_links_in_text_for_admin())) || (self::get_module(MY_MODULE_NAME_SERVICE)->is_available_to_process_links_in_text_for_free_users())) {

                    // ---> маскируем уже готовые ссылки
                    $value['value'] = preg_replace("/<a href=\"http/",'<a href="http_mask', $value['value']);
                    $value['value'] = preg_replace("/<img src=\"http/",'<img src="http_mask', $value['value']);



                    $value['value'] = preg_replace(
                            "/([^\"]?)\b((http(s?):\/\/)(?:www\.)?)([\w\.\:\-]+)([\/\%\w+\.\:\-#\(\)]+)([\?\w+\.\:\=\-#\(\)]+)([\&\w+\.\:\=\-#\(\)]+)\b([\-]?)([\/]?)/iu", "$1 <a href=\"http$4://$5$6$7$8$9$10\" target=\"_blank\">$5$6$7$8$9$10</a>", $value['value']);
                    //$value['value'] = preg_replace('#(http[s]?:\/\/(?:www\.)?([^ \n\t\r]+))#', ' <a href="$1" target="_blank">$2</a>',$value['value']);

                    // ---> "размаскировываем" уже готовые ссылки
                    $value['value'] = preg_replace("/<a href=\"http_mask/",'<a href="http', $value['value']);
                    $value['value'] = preg_replace("/<img src=\"http_mask/",'<img src="http', $value['value']);
                }
            }
            if (in_array("new_line", $value['processing'])) {
                $value['value'] = str_replace("\n", '<br>', str_replace("\n\r", '<br>', str_replace("\r\n", '<br>', $value['value'])));
            }
        }
    }


































    /*
     * Новая запись в таблицу по установленным значениям в свойстве fields
     *
     * @return integer - идентификатор новой записи
     */
    protected function insert()
    {

        $this->filter_all_fields(MY_FILTER_TYPE_ONLY_REQUIRED);

        try {

            $array_values = array();

            $sql = 'insert into ' . static::get_table_name() . ' (created,modified';

            $r = 1;
            foreach ($this->fields as $key => $value) {

                foreach ($value['rules'] as $value2) {

                    if ($value2 == 'none') {

                        $r = 0;
                    }
                }

                if (!$r) {

                    $r = 1;
                    continue;
                }

                $sql.=',' . $key;
            }
            $sql.=") values ('" . MY_TIME . "', '" . MY_TIME . "'";

            foreach ($this->fields as $key => $value) {

                foreach ($value['rules'] as $value2) {

                    if ($value2 == 'none') {

                        $r = 0;
                    }
                }

                if (!$r) {

                    $r = 1;
                    continue;
                }

                $sql.=",?";
                $this->processing_value($value);
                $array_values[] = isset($value['value']) ? $value['value'] : null;
            }
            $sql.=')';

            $stmt = self::$connect->prepare($sql);

            $stmt = $this->execute($stmt, $array_values);
            $id = self::$connect->lastInsertId();

            if (!$id) {
                self::concrete_error(array(MY_ERROR_MYSQL, '[error insert] (wrong id value) ' . $e->getMessage() . ', request:' . $sql), MY_LOG_MYSQL_TYPE);
            }
        } catch (\PDOException $e) {
            self::concrete_error(array(MY_ERROR_MYSQL, '[error insert] ' . $e->getMessage() . ', request:' . $sql), MY_LOG_MYSQL_TYPE);
        }
        // сбрасываем данные
        $this->fields = $this->fields_primary_data;
        return $id;
    }



    /*
     * Удаление записи из таблицы
     *
     * @param integer $id - идентификатор строки (первичный ключ)
     */
    public function delete($id)
    {
        $id = (int) $id;
        if (!$id) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'id:' . $id));
        }
        try {
            $sql = 'DELETE FROM ' . static::get_table_name() . ' WHERE id = ' . $id;
            self::$connect->exec($sql);
        } catch (\PDOException $e) {
            self::concrete_error(array(MY_ERROR_MYSQL, '[error delete] ' . $e->getMessage()), MY_LOG_MYSQL_TYPE);
        }
    }



    /*
     * Задаем значения полям;
     * мы просто проверяем существующие заданные значения;
     * переменные (возможно нужные) с пустыми значениями запишутся, но не пройдут следующюу проверку при insert/update;
     * смысл в том, что эти значения можно перед insert/update несколько раз изменять, главное, чтобы существенные части передавались правильно
     *
     * @param array $data - значения полей
     *
     * @return boolean
     */
    public function set_values_to_fields(array $data)
    {
        // Вставляем массив значений в данные для таблицы
        foreach ($data as $name => $value) {

            // Фильтруем значения
            $this->filter($name, $value, MY_FILTER_TYPE_WITHOUT_REQUIRED);
            // Если передалось пустое значение, но оно не должно быть пустым
            if (!$value && my_is_not_empty(@$this->fields[$name]['default_value'])) {
                $value = $this->fields[$name]['default_value'];
            }
            $this->fields[$name]['value'] = $value;
        }
        return true;
    }


    /*
     * Получаем массив строк, полученных при select
     *
     * @param resource $stmt - statement
     *
     * @return array
     */
    protected function fetch_many($stmt)
    {
        $array = array();
        while ($row = $stmt->fetch()) {
            $array[] = $row;
        }

        return $array;
    }

    /*
     * Получаем массив данных одной строки, полученной при select
     *
     * @param resource $stmt - statement
     *
     * @return array
     */
    protected function fetch_one($stmt)
    {

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $row;
    }

    /*
     * Возвращает сортировку для select, если не asc, то desc
     *
     * @param string $order - тип сортировки
     *
     * @return string
     */
    protected function return_order($order)
    {

        if ($order === 'asc') {
            return $order;
        }

        return 'desc';
    }

    /*
     * Выполнение подготовленного запроса
     *
     * @param resource $stmt - statement
     * @param array $params - параметры запроса
     *
     * @return statement
     */
    protected function execute($stmt, array $params = null)
    {
        $stmt->execute($params);
        return $stmt;
    }

    /*
     * Подготовка строкового значения limit
     *
     * @param array $limit - параметры $limit
     *
     * @return string
     */
    protected function return_limit(array $limit = array(1))
    {

        if ((int) $limit[1] > 0) {

            $text = (int) $limit[0] . ',' . (int) $limit[1];
        } else if ((int) $limit[0] > 0) {

            $text = (int) $limit[0];
        } else {

            $text = '1';
        }

        return $text;
    }

    /*
     * Получение результата по прямому запросу
     *
     * @param string $condition - условие where
     * @param string $order - условие order by
     * @param string $group - условие group by
     * @param string $select - условие select
     * @param string $limit - условие limit
     * @param boolean $need_result - приемлем ли пустой результат
     *
     * @return array - полученные данные из таблицы
     */
    public function get_by_condition($condition, $order = '', $group = '', $select = '*', $limit = false, $need_result = true)
    {
        if (!$condition) {
            $condition = 1;
        }

        $conn = self::$connect;

        $sql = 'SELECT ' . $select . ' FROM ' . static::get_table_name() . ' WHERE ' . $condition;

        try {
            if ($group) {
                $sql .= ' GROUP BY ' . $group . ' ';
            }
            if ($order) {
                $sql .= ' ORDER BY ' . $order . ' ';
            }
            if ($limit == false) {
                $result = $conn->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
            } else if ($limit === 1) {
                $sql .= ' limit 1';
                $result = $conn->query($sql, \PDO::FETCH_ASSOC)->fetch();
            } else if ($limit) {
                // LIMIT > 0 или LIMIT + OFFSET
                $sql .= ' limit ' . $limit;
                $result = $conn->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
            }
        } catch (\PDOException $e) {
            self::concrete_error(array(MY_ERROR_MYSQL, 'request:' . $sql), MY_LOG_MYSQL_TYPE);
        }

        if (!isset($result) || !is_array($result) || !$result) {
            if ($need_result === true) {
                self::concrete_error(array(MY_ERROR_MYSQL, 'request:' . $sql), MY_LOG_MYSQL_TYPE);
            } else {
                return array();
            }
        }

        return $result;
    }



    /*
     * Получение результата по прямому запросу sql
     *
     * @param string $sql

     * @param boolean $need_result - приемлем ли пустой результат
     *
     * @return array - полученные данные из таблицы
     */
    public function get_by_sql($sql, $need_result = true)
    {
        $conn = self::$connect;

        try {
            $result = $conn->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
        } catch (\PDOException $e) {
            self::concrete_error(array(MY_ERROR_MYSQL, 'request:' . $sql), MY_LOG_MYSQL_TYPE);
        }

        if (!isset($result) || !is_array($result) || !$result) {
            if ($need_result === true) {
                self::concrete_error(array(MY_ERROR_MYSQL, 'request:' . $sql), MY_LOG_MYSQL_TYPE);
            } else {
                return array();
            }
        }

        return $result;
    }






    /*
      public function set_values_to_fields_from_form(\vendor\Form $form) {

      $data = $form->get_all_fields();

      //вставл¤ем массив значений в таблицу

      foreach ($data as $name => $field) {

      // Только если имя формы сответствует имени пол¤ в таблице
      if (array_key_exists($name, $this->fields)) {

      //фильтруем значени¤
      $this->filter($name, $field['value'], MY_FILTER_TYPE_ALL);

      $this->fields[$name]['value'] = $field['value'];
      }
      }
      return true;
      }
     */
}
