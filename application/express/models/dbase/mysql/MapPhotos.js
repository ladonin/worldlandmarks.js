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
//get_by_data_id => MY_MODULE_NAME_MAP.getPhotosByDataId()





    /*
     * Delete placemark's photo
     *
     * @param {integer} placemarkId - placemark id
     * @param {string} photoName - photo name without prefix and with extension
     * @param {boolean} mustBeDeleted - is delete required
     *
     * @return {integer} - number of deleted rows
     */
    delete(placemarkId, photoName, mustBeDeleted = true) {

        let _result = this.getByCondition(
                condition = 'map_data_id=' + BaseFunctions.toInt(placemarkId) + ' AND path=?',
                order = '',
                group = '',
                select = 'id',
                where_values = [photoName],
                limit = false,
                mustBeDeleted
            );

        return this.delete(_result[0]['id']);
    }


    /*
     * Get all photos by placemark id starting with last photo
     *
     * @param {integer} id - placemark id
     * @param {boolean} needResult - is result required
     *
     * @return {array of objects}
     */
    getPhotosByDataId(id, needResult)
    {
        // Order by DESC because the last photo will be main now
        return this.getByCondition(
            condition = "map_data_id = ?",
            order = 'id DESC',
            group = '',
            select = '*',
            where_values = [id],
            limit = false,
            needResult
        );
    }














}

MapPhotosModel.instanceId = BaseFunctions.unique_id();

module.exports = MapPhotosModel;