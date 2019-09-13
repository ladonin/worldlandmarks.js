/*
 * File server/src/models/form/UpdatePoint.js
 * const UpdatePointForm = require('server/src/models/form/UpdatePoint');
 *
 * Create or update point form model
 */

const BaseFunctions = require('server/src/functions/BaseFunctions');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const CreatePointForm = require('server/src/models/form/CreatePoint');

class UpdatePointForm extends CreatePointForm
{

    constructor() {
        super();

        this.fields['x'].rules = ['numeric'];
        this.fields['y'].rules = ['numeric'];
        this.fields['photos'].rules = [];
        this.fields['password'].rules = ['required'];

        // 'delete_photos[photo_N]' checkboxes
        this.fields['delete_photos'] = {
            rules:[]
        };
        this.fields['id'] = {
            rules:['required', 'numeric'],
            preparing:['to_integer']
        };
    }

    /*
     * Processing data according with fields settings.
     * Updated parent method.
     *
     * @param {object} datas
     *
     * @return {object} - processed data {fieldName : fieldValue}
     */
    processData(datas) {
        if (!datas['password']) {
            this.error(ErrorCodes.ERROR_PASSWORD_NOT_PASSED, undefined, undefined, false);
        }

        return super.processData(datas);
    }
}

UpdatePointForm.instanceId = BaseFunctions.unique_id();

module.exports = UpdatePointForm;