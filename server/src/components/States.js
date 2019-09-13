/*
 * File server/src/components/States.js
 * const States = require('server/src/components/States');
 *
 * States component - compute states data
 */

const Component = require('server/src/core/parents/Component');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Consts = require('server/src/settings/Constants');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const CountryStatesModel = require('server/src/models/dbase/mysql/CountryStates');


class States extends Component {

    constructor() {
        super();
    }

    /*
     * Get state id by state code
     *
     * @param {string} code - state code
     *
     * @return {integer}
     */
    getStateIdByCode(code, needResult = true)
    {
        if (code == Consts.UNDEFINED_VALUE) {
            return null;
        }

        if (!code) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'state code [' + code + ']');
        }

        let _result;
        let _language = this.getLanguage();
        let _serviceName = this.getServiceName();

        if (_result = this.cache.get('stateIdByCode', _serviceName, _language)[code]) {
            return _result;
        }

        _result = CountryStatesModel.getInstance(this.requestId).getStateIdByCode(code, false);

        if (!_result && needResult) {
            this.error(ErrorCodes.ERROR_COUNTRY_STATE_ID_WAS_NOT_FOUND, 'state code [' + code + ']');
        }

        this.cache.get('stateIdByCode', _serviceName, _language)[code] = _result;

        return _result;
    }

}



States.instanceId = BaseFunctions.unique_id();

module.exports = States;