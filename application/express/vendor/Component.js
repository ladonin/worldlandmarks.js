/*
 * File application/express/vendor/Component.js
 * const Component = require('application/express/vendor/Component');
 *
 * Base component
 */
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Instances = require('application/express/vendor/Instances');
const ErrorHandler = require('application/express/components/ErrorHandler');
const ErrorCodes = require('application/express/settings/ErrorCodes');
















class Component {


    constructor(){
        // For instances pool
        this.requestId;
    }


    /*
     * Get object from pool
     * If absent - create and return
     * NOTE: this.instanceId - is a static property of a class inheriting Component
     *
     * @param integer reqId - request id
     *
     * @returns object - instance of requested class
     */
    static getInstance(reqId){
        let instanceId = this.instanceId;
        if (Instances.checkInstance(reqId, instanceId) == false) {
            //Instances.register(reqId, new this(), instanceId);
        }
        return Instances.getObject(reqId, instanceId);
    }

    /*
     * Set request id (see instances pool)
     * Only one time
     *
     * @param integer reqId
     */
    setRequestId(reqId){
        if (BaseFunctions.is_not_empty(this.requestId)){
            ErrorHandler.process(ErrorCodes.ERROR_DOUBLE_REQUEST_ID_ASSIGNMENT,
                'first[' + BaseFunctions.toString(this.requestId) + '], second[' + BaseFunctions.toString(reqId) + ']');
        }
        this.requestId = reqId;
    }



   // validate(rule = false, value = false) {}//, $key = false







//#???????????????????????????? - то, что возможно не нужно
    /*
     * Запись основных GET переменных без query string
     *
     * @param string $url - url (var1, var2, var3, var4)

    protected function set_self_url_without_query_string($url)
    {
        if (is_null(self::$self_url_without_query_string)) {
            self::$self_url_without_query_string = $url;
        }
    }
     * Получение основных GET переменных без query string
     *
     * @return string

    public static function get_self_url_without_query_string()
    {
        return self::$self_url_without_query_string;
    }




     * Редирект по указанному url
     *
     * @param string $url - путь редиректа

    public static function redirect($url)
    {
        $url = trim($url, '/');
        \header('Location: ' . MY_DOMEN . MY_DS . $url, true, 301);
        exit();
    }





*/





}

module.exports = Component;