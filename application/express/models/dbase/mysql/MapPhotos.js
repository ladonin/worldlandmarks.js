/*
 * File application/express/models/dbase/mysql/MapPhotos.js
 * const MapPhotosModel = require('application/express/models/dbase/mysql/MapPhotos');
 *
 * Map photos MySql db model
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');


class MapPhotosModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableName;

        this.fields = {
            map_data_id:{
                'rules':['numeric', 'required'],
            },
            path:{
                'rules':['required'],
            },
            width:{
                'rules':['numeric', 'required'],
            },
            height:{
                'rules':['numeric', 'required'],
            }
        };

        this.snapshotFieldsData();
    }

    /*
     * Get db table name
     *
     * @return {string} - table name
     */
    getTableName() {
        if (!this.tableName) {
            this.tableName = this.getServiceName() + '_map_photos';
        }
        return this.tableName;
    }

// //ATTENTION - обратите внимание
//get_by_data_id => MY_MODULE_NAME_MAP.get_photos_by_data_id()
}

MapPhotosModel.instanceId = BaseFunctions.unique_id();

module.exports = MapPhotosModel;