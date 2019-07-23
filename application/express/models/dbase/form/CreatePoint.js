/*
 * File application/express/models/form/CreatePoint.js
 * const CreatePointForm = require('application/express/models/form/CreatePoint');
 *
 * Create or update point form model
 */

const Form = require('application/express/core/Form');
const Service = require('application/express/core/Service');
const BaseFunctions = require('application/express/functions/BaseFunctions');


class CreatePointForm extends Form
{
    constructor() {
        super();

        this.fields = {

            x:{
                rules:['numeric'],
                processing:['to_float'],
            },
            y:{
                rules:['numeric'],
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
            },
            password:{
                rules:[],
            }
        }
    }
}

CreatePointForm.instanceId = BaseFunctions.unique_id();

module.exports = CreatePointForm;