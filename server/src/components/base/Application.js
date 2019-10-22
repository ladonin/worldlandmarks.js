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

class Application extends Component
{
    constructor()
    {
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


    /*
     * Get controller name
     *
     * @return {string}
     */
    getController()
    {
        return this.controller;
    }


    /*
     * Get action name
     *
     * @return {string}
     */
    getAction()
    {
        return this.action;
    }


    /*
     * Detect and set controller and action
     */
    setControllerAndAction()
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
    runController()
    {
        let _controllerObject = this.getController();
        let _actionName = this.getAction();

        return _controllerObject[_actionName]();
    }


    /*
     * Run operations before or after controller running
     *
     * @param {string} ('before'/'after') param - determine which operations will be performed
     */
    appOperations(param)
    {
        if (BaseFunctions.is_not_empty(Config.operations[param])) {
            let _operations = Config.operations[param];
            for (let _index in _operations) {
                let _operation = _operations[_index];
                let _operationComponent = require(_operation.class);
                // If traditional class
                if (BaseFunctions.isClass(_operationComponent)) {
                    _operationComponent.getInstance(this.requestId)[_operation.method]();
                } else {
                    // Otherwise it is a simple common object with methods
                    _operationComponent[_operation.method]();
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
    validateGetVars()
    {
        let _getVariables = this.getRequestData();

        for (let _configGetName in Config.get_vars) {

            let _configGetRules = Config.get_vars[_configGetName].rules;
            let _getValue = _getVariables[_configGetName];

            for (let _index in _configGetRules) {
                let _rule = _configGetRules[_index];
                if (!Validator.validate(_rule, _getValue)) {
                    this.error(ErrorCodes.ERROR_GET_VAR_IS_INVALID,
                    'name[' + _configGetName + '], value[' + _getValue + '], rule[' + BaseFunctions.toString(_rule) + '], data[' + this.getRequestData(true) + ']',
                            undefined, false);
                }
            }
        }
    }


    /*
     * Run primary methods
     */
    execute()
    {
        this.validateGetVars();
        this.appOperations('before');
        this.setControllerAndAction();
        let _result = this.runController();
        this.appOperations('after');
        return _result;
    }


    /*
     * Run application
     */
    static run(data, token)
    {
        let _applicationObject;

        return new Promise((resolve, reject) => {
            _applicationObject = Application.getInstance(
                RequestsPool.init(data, token)
            );
            resolve(true);
        })
        .then(res => {
            DBase.getInstance(_applicationObject.requestId).begin_transaction();
            _applicationObject.execute();
            DBase.getInstance(_applicationObject.requestId).commit();
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
                _errorMessage = 'system';
            } else {
                _errorMessage = e.syntCode;
                console.log('error: ' + e.syntMessage);
            }

            SocketsPool.sendPrivate(token, {message: _errorMessage}, 'error-catch');
            console.log('<<<<<<<<<<<<<<<<---------------              CATCHED\n\n\n');
        })
        .then(res => {
            // Close possible mysql connection (required to be closed, unlike another dbases)
            DBase.getInstance(_applicationObject.requestId).closeConnection('mysql')

            // Only if object managed to preserve in requests pool
            if (_applicationObject) {
                RequestsPool.remove(_applicationObject.requestId);
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