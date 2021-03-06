/*
 * File server/src/models/form/CreatePoint.js
 * const CreatePointForm = require('server/src/models/form/CreatePoint');
 *
 * Create or update point form model
 */

const Form = require('server/src/core/parents/Form');
const Service = require('server/src/core/Service');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Consts = require('server/src/settings/Constants');

class CreatePointForm extends Form
{
    constructor()
    {
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
                rules:[Service.getInstance(this.requestId).arePhotosNeedForPlacemarks() ? 'required' : ''],
            },
            comment:{
                rules:[],
            },
            title:{
                rules:[Service.getInstance(this.requestId).whetherToUseTitles() ? 'required' : ''],
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
    processData(datas)
    {
        // Attention - this checking is used also in update point form, so we have to follow this condition
        if (BaseFunctions.isSet(datas['x']) || BaseFunctions.isSet(datas['y'])){
            BaseFunctions.check_coords(datas['x'], datas['y'], undefined, this);
        }

        return super.processData(datas);
    }
}

CreatePointForm.instanceId = BaseFunctions.uniqueId();
module.exports = CreatePointForm;