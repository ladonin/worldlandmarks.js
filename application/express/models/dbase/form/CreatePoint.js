/*
 * File application/express/models/form/CreatePoint.js
 * const CreatePointForm = require('application/express/models/form/CreatePoint');
 *
 * Create or update point form model
 */

const Form = require('application/express/core/abstract/Form');
const Service = require('application/express/core/Service');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');

class CreatePointForm extends Form
{
    constructor() {
        super();

        this.fields = {

            x:{
                rules:['numeric', 'required'],
                processing:['to_float'],
            },
            y:{
                rules:['numeric', 'required'],
                processing:['to_float'],
            },
            photos:{
                rules:[Service.getInstance(this.requestId).whetherNeedPhotosForPlacemarks() ? 'required' : ''],
            },
            comment:{
                rules:[],
            },
            title:{
                rules:[Service.getInstance(this.requestId).whetherUseTitles() ? 'required' : ''],
            },
            category:{
                rules:['required', {'in':Service.getInstance(this.requestId).getCategoriesIds()}],
            },
            email:{
                rules:['email'],
                errors:{email:Consts.ERROR_WRONG_EMAIL}
            },
            password:{
                rules:[],
            }
        }
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

        // Attention - this checking is used also in update point form, so we have to follow this condition
        if (BaseFunctions.isSet(datas['x']) || BaseFunctions.isSet(datas['y'])){
            BaseFunctions.check_coords(datas['x'], datas['y'], undefined, this);
        }

        return super.processData(datas);
    }






}

CreatePointForm.instanceId = BaseFunctions.unique_id();

module.exports = CreatePointForm;