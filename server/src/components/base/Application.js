/*
 * File server/src/components/base/Application.js
 * const Application = require('server/src/components/base/Application');
 *
 * The main component for working with application
 */

const BaseFunctions = require('server/src/functions/BaseFunctions');
const Config = require('server/src/settings/Config.js');
const Component = require('server/src/core/parents/Component');
const RequestsPool = require('server/src/core/RequestsPool');
const SocketsPool = require('server/src/core/SocketsPool');

const ErrorCodes = require('server/src/settings/ErrorCodes');
const Consts = require('server/src/settings/Constants');
const DBase = require('server/src/components/base/DBase');
const Validator = require('server/src/components/base/Validator');
class Application extends Component {
    constructor(){
        super();


        /*
         * Controller name
         *
         * @type string
         */
        this.controller;

        /*
         * Name controller's action
         *
         * @type string
         */
        this.action;

    }


    init(){


    }

    /*
     * Get controller name
     *
     * @return {string}
     */
    get_controller()
    {
        return this.controller;
    }


    /*
     * Get action name
     *
     * @return {string}
     */
    get_action()
    {
        return this.action;
    }




























    /*
     * #???????????????????????????? - то, что возможно не нужно
     * Path to laoyut file
     *
     * @type string
     */
    /*this.layout_file=undefined;*/



    /*
     * #????????????????????????????
     * Path to view file
     *
     * @type string
     */
    /*this.view_file=undefined;*/

    /*
     * #????????????????????????????
     * Layout file's name
     *
     * @type string
     */
    /*this.layout_name=undefined;*/



    /*
     * #????????????????????????????
     * View's file name
     *
     * @type string
     */
    /*this.view_name=undefined;


    }*/

    /*
     * #???????????????????????????? - то, что возможно не нужно
     * Change view file
     *
     * @param {string} controller - controller name
     * @param {string} action - action name
     */


    /*#???????????????????????????? - то, что возможно не нужно
     * Change view data
     *
     * @param {string} controller - controller name
     * @param {string} action - action name
     */
    /*change_view_file(controller, action)
    {
        this.view_file = controller + '/' + action + '.js';
        this.view_name = action;
    }*/






    /*
     * #???????????????????????????? - то, что возможно не нужно
     * Change layout data
     *
     * @param {string} controller - controller name
     * @param {string} action - action name
     */
    /*change_layout_file(controller, action)
    {
        $config = self::get_config();
        $this->layout_file = my_pass_through(@$config['layouts'][$controller][$action]) . '.php';
        $this->layout_name = my_pass_through(@$config['layouts'][$controller][$action]);
    }*/



    /*
     * #???????????????????????????? - то, что возможно не нужно
     * Получить путь до view файла
     *
     * @return {string}

    protected function get_view_file()
    {

        return $this->view_file ? $this->view_file : \strtolower($this->get_controller()) . MY_DS . $this->get_view_name() . '.php';
    }

     * Получить название view файла, без расширения и пути
     *
     * @return {string}

    protected function get_view_name()
    {
        if (is_null($this->view_name)) {
            $this->view_name = $this->get_action();
        }

        return $this->view_name;
    }


     * Получить путь до layout файла
     *
     * @return {string}

    protected function get_layout_file()
    {

        return $this->get_layout_name() . '.php';
    }


     * Получить название layout файла, без расширения и пути
     *
     * @return {string}

    protected function get_layout_name()
    {
        $config = self::get_config();
        if (is_null($this->layout_name)) {
            $this->layout_name = my_pass_through(@$config['layouts'][strtolower($this->get_controller())][$this->get_action()]);
        }

        return $this->layout_name;
    }
         *
         **/













    /*
     * Detect and set controller and action
     */
    set_controller_and_action()
    {
        let _controllerName = this.getControllerName().toLowerCase();

        if (BaseFunctions.is_not_empty(Config.controllers.enabled[_controllerName])){

            let _controllerFileName = Config.controllers.enabled[_controllerName];
            let _controllerPath = 'server/src/controllers/'+_controllerFileName+'.js';

            let _Controller = require(_controllerPath);
            let _controllerObject = _Controller.getInstance(this.requestId);

            let _actionName = this.getActionName().toLowerCase();
            let _actionNamePrepared = 'action_' + _actionName;

            // If action exists
            if (BaseFunctions.isMethod(_controllerObject[_actionNamePrepared])) {
                this.controller = _controllerObject;
                this.action = _actionNamePrepared;

                // All ok, controller and action are valid
                RequestsPool.setControllerAndActionNames(this.requestId, _controllerName, _actionName);

                return true;
            }
        }
        this.error(ErrorCodes.ERROR_WRONG_ADRESS, 'data:[' + this.getRequestData(true) + ']');
    }



    /*
     * Controller runner
     *
     * @return {object} - controller execution result
     */
    run_controller()
    {
        let _controllerObject = this.get_controller();
        let _actionName = this.get_action();

        return _controllerObject[_actionName]();
    }






    /*
     * Run operations before or after controller running
     *
     * @param {string} ('before'/'after') param - determine which operations will be performed
     */
    app_operations(param)
    {
        if (BaseFunctions.is_not_empty(Config.operations[param])) {
            let _operations = Config.operations[param];
            for (let _index in _operations) {
                let _operation = _operations[_index];
                let _operation_component = require(_operation.class);
                // If traditional class
                if (BaseFunctions.isClass(_operation_component)) {
                    _operation_component.getInstance(this.requestId)[_operation.method]();
                } else {
                    // Otherwise it is a simple common object with methods
                    _operation_component[_operation.method]();
                }
            }
        } else {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'param [' + param + ']');
        }
    }


    /*
     * Validate all GET variables
     * Url variables don't specified in config is not used in project
     */
    validate_get_vars()
    {
        let _get_variables = this.getRequestData();

        for (let _config_get_name in Config.get_vars) {

            let _config_get_rules = Config.get_vars[_config_get_name].rules;
            let get_value = _get_variables[_config_get_name];

            for (let _index in _config_get_rules) {
                let _rule = _config_get_rules[_index];
                if (!Validator.validate(_rule, get_value)) {
                    this.error(ErrorCodes.ERROR_GET_VAR_IS_INVALID,
                    'name[' + _config_get_name + '], value[' + get_value + '], rule[' + BaseFunctions.toString(_rule) + '], data[' + this.getRequestData(true) + ']',
                            undefined, false);
                }
            }
        }
    }












    /*
     * Run primary methods
     */
    execute()
    {console.log('\n\n\n------------->>>>>>>>>>>>>>>>>>>execute :request id = '+this.requestId+'');
        this.init();

        this.validate_get_vars();

        this.app_operations('before');

        this.set_controller_and_action();

        let _result = this.run_controller();

        this.app_operations('after');

        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<----------execute :request id = '+this.requestId+'\n\n\n');
        return _result;
    }






    /*
     * Run application
     */
    static run(data, token)
    {
        let _applicationObject;

        return new Promise((resolve, reject) => {
            console.log('# Promise started');
            _applicationObject = Application.getInstance(
                RequestsPool.init(data, token)
            );
            resolve(true);
        })
        .then(res => {
            console.log('# then 1');
            DBase.getInstance(_applicationObject.requestId).begin_transaction();
            _applicationObject.execute();
            DBase.getInstance(_applicationObject.requestId).commit();
            console.log('> applicationObject executed');
        })
        .catch(e => {
            console.log('# catch 1');
            console.log('\n\n              --------------->>>>>>>>> CATCHED');

            if (_applicationObject) {
                DBase.getInstance(_applicationObject.requestId).rollback();
            }

            let _errorMessage = '';

            if (!e.syntCode) {
                console.log('system error!');
                console.log(e);
            }
            if (Config.debug === 1) {
                _errorMessage = e.syntMessage;
                console.log('error: ' + _errorMessage);
            } else {
                _errorMessage = e.syntCode;
            }
            SocketsPool.sendPrivate(token, {message: _errorMessage}, 'error-catch');
            console.log('<<<<<<<<<<<<<<<<---------------              CATCHED\n\n\n');
        })
        .then(res => {
            console.log('# then 2');

            // Close possible mysql connection (required to be closed, unlike another dbases)
            DBase.getInstance(_applicationObject.requestId).closeConnection('mysql')
            console.log('> DB mysql connection closed');

            // Only if object managed to preserve in requests pool
            if (_applicationObject) {
                RequestsPool.remove(_applicationObject.requestId);
                console.log('> RequestsPool removed');
            }
        })
        .catch(e => {
            console.log('# catch 2');
            console.log(e.syntMessage ? e.syntMessage : e);
        });
    }
};

Application.instanceId = BaseFunctions.uniqueId();

module.exports = Application;