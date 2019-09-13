/*
 * File server/src/models/dbase/mysql/MapPhotos.js
 * const MapPhotosModel = require('server/src/models/dbase/mysql/MapPhotos');
 *
 * Map photos MySql db model
 */

const DBaseMysql = require('server/src/core/dbases/Mysql');
const BaseFunctions = require('server/src/functions/BaseFunctions');


class MapPhotosModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableNameInit = this.tableInitNames.MAP_PHOTOS;

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
                /*condition*/'map_data_id=' + BaseFunctions.toInt(placemarkId) + ' AND path=?',
                /*order*/'',
                /*group*/'',
                /*select*/'id',
                /*where_values*/[photoName],
                /*limit*/false,
                mustBeDeleted
            );

        return this.delete(_result[0]['id']);
    }


    /*
     * Get all photos of one placemark by placemark id starting with last photo
     *
     * @param {integer} id - placemark id
     * @param {boolean} needResult - is result required
     *
     * @return {array of objects}
     */
    getPhotosByDataId(id, needResult = false)
    {
        // Order by DESC because the last photo will be main now
        return this.getByCondition(
            /*condition*/"map_data_id = ?",
            /*order*/'id DESC',
            /*group*/'',
            /*select*/'*',
            /*where_values*/[id],
            /*limit*/false,
            needResult
        );
    }




    /*
     * Get all photos of placemarks by placemark ids starting with last photo
     *
     * @param {array} ids - placemark ids
     * @param {boolean} needResult - is result required
     *
     * @return {array of objects}
     */
    getPhotosByDataIds(ids, needResult = false)
    {
        return this.getByCondition(
            /*condition*/"map_data_id IN (" + BaseFunctions.rtrim('?,'.repeat(ids.length),',') + ")",
            /*order*/'map_data_id, id DESC',
            /*group*/'',
            /*select*/'*',
            /*where_values*/ids,
            /*limit*/false,
            needResult
        );
    }









}

MapPhotosModel.instanceId = BaseFunctions.unique_id();

module.exports = MapPhotosModel;