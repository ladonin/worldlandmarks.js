/*
 * File application/express/models/dbase/mysql/MapData.js
 * const MapDataModel = require('application/express/models/dbase/mysql/MapData');
 *
 * Map data MySql db model
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const GeocodeCollectionModel = require('application/express/models/dbase/mysql/GeocodeCollection');
const MapPhotosModel = require('application/express/models/dbase/mysql/MapPhotos');
const Map = require('application/express/components/Map');
const Config = require('application/express/settings/Config');

class MapDataModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableName;

        this.fields = {
            x:{
                // Preparing value before validating
                preparing:['to_string'],
                rules:['numeric', 'required'],
                //processing:['htmlspecialchars'],
            },
            y:{
                // Preparing value before validating
                preparing:['to_string'],
                rules:['numeric', 'required'],
                //processing:['htmlspecialchars'],
            },
            comment:{
                rules:[],
                processing:['strip_tags', 'new_line', 'urls', 'spec_tags'],
            },
            comment_plain:{
                rules:[],
                processing:['strip_tags'],
            },
            title:{
                rules:[],
                processing:['strip_tags'],
            },
            user_id:{
                rules:['numeric'],
            },
            category:{
                rules:['numeric'],
            },
            subcategories:{
                rules:[],
                processing:['strip_tags'],
            },
            relevant_placemarks:{
                rules:[],
                processing:['strip_tags'],
            },
            seo_keywords:{
                rules:[],
                processing:['strip_tags'],
            },
            seo_description:{
                rules:[],
                processing:['strip_tags'],
                },
            };

            this.snapshotFieldsData();
        }

        getTableName() {
            if (!this.tableName) {
                this.tableName = this.getServiceName() + '_map_data';
            }
            return this.tableName;
        }

//ATTENTION - обратите внимание
//update_point => change

    /*
     * Update placemark
     *
     * @param {object} data - placemark's new data with id
     */
    change(data)
    {
        let _id = data.id;
        delete data.id;

        // If coordinates are not set
        if ((!data.x && data.x !== 0 && data.x !== '0') || (!data.y && data.y !== 0 && data.y !== '0')) {
            delete data.x;
            delete data.y;
        }

        this.setValuesToFields(data);
        this.update(_id);
    }






    /*
     * Get placemarks big data by ids
     *
     * @param {array} ids - placemarks ids
     * @param {string} language - language
     * @param {string} order - fetch order
     * @param {boolean} needPlainText - whether placemark description (plain text) is necessary
     * @param {boolean} needResult - is result required
     *
     * @return {array of objects} - placemarks data
     */
    getPointsBigDataByIds(ids, language, order, needPlainText, needResult = true)
    {
        ids = BaseFunctions.prepareToIntArray(ids);
        let _idsList = ids.join(',');
        let _commentPlain = '';

        if (needPlainText) {
            _commentPlain = 'c.comment_plain as c_comment_plain,';
        }

        let _sql = `SELECT
                c.id as c_id,
                c.x as c_x,
                c.y as c_y,
                c.comment as c_comment,
                ${_commentPlain}
                c.title as c_title,
                c.category as c_category,
                c.subcategories as c_subcategories,
                c.relevant_placemarks as c_relevant_placemarks,
                c.created as c_created,
                c.modified as c_modified,

                geo.formatted_address as g_formatted_address,
                geo.administrative_area_level_1 as g_administrative_area_level_1,
                geo.administrative_area_level_2 as g_administrative_area_level_2,
                geo.country_code as g_country_code,
                geo.country as g_country,
                geo.state_code as g_state_code,
                geo.locality as g_locality,
                geo.street as g_street,

                ph.id as ph_id,
                ph.path as ph_path,
                ph.width as ph_width,
                ph.height as ph_height,
                ph.created as ph_created,
                ph.modified as ph_modified

                FROM ${this.getTableName()} c
                LEFT JOIN (SELECT * FROM ${MapPhotosModel.getInstance(this.requestId).getTableName()} ORDER by id DESC) ph ON ph.map_data_id=c.id
                LEFT JOIN ${GeocodeCollectionModel.getInstance(this.requestId).getTableName()} geo on geo.map_data_id = c.id AND geo.language=?
                WHERE c.id IN (${_idsList}) `;

        let _innerOrder='c_id, ph_id DESC';

        if (order) {
            _sql += `ORDER by ${order},${_innerOrder}`;
        } else {
            _sql += `ORDER by ${_innerOrder}`;
        }

        let _result = this.getBySql(_sql, [language], needResult);

        return _result;
    }












    /*
     * Get placemarks short data by ids
     *
     * @param {array} ids - placemarks ids
     * @param {boolean} needResult - is result required
     *
     * @return {array of objects} - placemarks data
     */
    getPointsShortDataByIds(ids, needResult = true)
    {
        ids = BaseFunctions.prepareToIntArray(ids);
        let _idsList = ids.join(',');

        // Get only first photo
        let _sql = `SELECT
                    c.id as c_id,
                    c.x as c_x,
                    c.y as c_y,
                    c.title as c_title,
                    c.category as c_category,
                    c.subcategories as c_subcategories,
                    c.relevant_placemarks as c_relevant_placemarks,

                    ph.id as ph_id,
                    ph.path as ph_path,
                    ph.width as ph_width,
                    ph.height as ph_height

                    FROM ${this.getTableName()} c
                    LEFT JOIN (
                        SELECT * FROM (SELECT MAX(id) phh2_id FROM landmarks_map_photos GROUP BY map_data_id) phh2
                        JOIN landmarks_map_photos on phh2.phh2_id=landmarks_map_photos.id
                    ) ph ON ph.map_data_id=c.id
                    WHERE c.id IN (${_idsList})
                    GROUP by c_id
                    ORDER by c_title ASC`;

        return this.getBySql(_sql, undefined, needResult);
    }






























    /*
     * Get placemarks short data by ids
     *
     * @param {float} x1 - x1 coordinate
     * @param {float} x2 - x2 coordinate
     * @param {float} y1 - y1 coordinate
     * @param {float} y2 - y2 coordinate
     * @param {string} ignore - placemarks list to be ignored
     *
     * @return {array of objects} - placemarks data
     */
    getPointsByCoordsNaked(x1, x2, y1, y2, ignore)
    {
        let _sql = `SELECT
                t.id as c_id,
                t.x as c_x,
                t.y as c_y,
                t.title as c_title,
                t.category as c_category,
                t.subcategories as c_subcategories,
                t.relevant_placemarks as c_relevant_placemarks,

                ph.id as ph_id,
                ph.path as ph_path,
                ph.width as ph_width,
                ph.height as ph_height

                FROM (SELECT * FROM ${this.getTableName()} WHERE `;

        if ((x1 > 0) && (x2 < 0)) {

            _sql += `((x BETWEEN ${x1} AND 180) OR (x BETWEEN -180 AND ${x2})) `;
        } else {

            _sql += `(x BETWEEN ${x1} AND ${x2}) `;
        }

        _sql += `AND (y BETWEEN ${y2} AND ${y1})) t LEFT JOIN (
                SELECT * FROM
                (SELECT MAX(id) phh2_id FROM landmarks_map_photos GROUP BY map_data_id) phh2
                JOIN landmarks_map_photos on phh2.phh2_id=landmarks_map_photos.id
                ) ph ON ph.map_data_id=t.id`;

        if (ignore) {
            _sql += ` WHERE t.id NOT IN (${ignore})`;
        }

        _sql += " GROUP by c_id";

        return this.getBySql(_sql, undefined, false);
    }

    /*
     * Get limited collection of any placemarks in random order
     *
     * @param {integer} limit - collection limit
     * @param {string} ignore - list of placemarks ids to be ignored in fetching
     *
     * @return {array of objects} - placemarks data
     */
    getPointsByLimitNaked(limit, ignore)
    {
        let _sql = `SELECT
                    t.id as c_id,
                    t.x as c_x,
                    t.y as c_y,
                    t.title as c_title,
                    t.category as c_category,
                    t.subcategories as c_subcategories,
                    t.relevant_placemarks as c_relevant_placemarks,

                    ph.id as ph_id,
                    ph.path as ph_path,
                    ph.width as ph_width,
                    ph.height as ph_height

                    FROM ${this.getTableName()} t
                    LEFT JOIN (
                        SELECT * FROM
                        (SELECT MAX(id) phh2_id FROM landmarks_map_photos GROUP BY map_data_id) phh2
                        JOIN landmarks_map_photos on phh2.phh2_id=landmarks_map_photos.id
                        ) ph ON ph.map_data_id=t.id`;
        if (ignore) {
            _sql += ` WHERE t.id NOT IN (${ignore})`;
        }

        _sql += ` GROUP by c_id ORDER by RAND() LIMIT ${limit}`;

        return this.getBySql(_sql, undefined, false);
    }






    /*
     * Return another placemarks related to category
     *
     * @param {integer} categoryId - category id
     * @param {integer} pointId - placemark id
     * @param {string} select - fields to be selected
     *
     * @return {array of objects}
     */
    getAnotherPlacemarksByCategory(categoryId, pointId, select = '*')
    {
        categoryId = BaseFunctions.toInt(categoryId);
        return this.getByCondition(
                condition = "id!=? AND (category = ? OR subcategories REGEXP '[[:<:]]" + categoryId + "[[:>:]]')",
                order = 'RAND()',
                group = '',
                select,
                where_values = [pointId, categoryId],
                limit = Config['restrictions']['max_items_at_sublist'],
                need_result = false
                );
    }

    /*
     * Return another placemarks ids related to category
     *
     * @param {integer} categoryId - category id
     * @param {integer} pointId - placemark id
     *
     * @return {array of objects}
     */
    getAnotherPlacemarksIdsByCategory(categoryId, pointId) {
        return this.getAnotherPlacemarksByCategory(categoryId, pointId, select = 'id');
    }




    /*
     * Return placemarks count by category id
     *
     * @param {integer} id
     *
     * @return {integer}
     */
    getPlacemarksCountByCategory(id)
    {
        id = BaseFunctions.toInt(id);
        return this.getByCondition(
                condition = "category = ? OR subcategories REGEXP '[[:<:]]" + id + "[[:>:]]'",
                order = '',
                group = '',
                select = 'COUNT(*) as placemarks_count',
                where_values = [id],
                limit = 1,
                need_result = false
                )[0]['placemarks_count'];
    }


    /*
     * Return all placemarks count
     *
     * @return {integer}
     */
    getPlacemarksCount()
    {
        return this.getByCondition(
            condition = 1,
            order = '',
            group = '',
            select = 'COUNT(*) as placemarks_count',
            where_values = [],
            limit = 1,
            need_result = false
        )[0]['placemarks_count'];
    }
















    /*
     * Extract photos data from current placemarks
     *
     * @param {array} placemarksIds - placemarks ids
     *
     * @return {array of objects} - photos data
     */
    getPlacemarksPhotos(placemarksIds)
    {

        let _sql = `SELECT
                    c.id as c_id,
                    c.title as c_title,

                    ph.id as ph_id,
                    ph.path as ph_path,
                    ph.width as ph_width,
                    ph.height as ph_height

                    FROM ${this.getTableName()} c
                    JOIN ${MapPhotosModel.getInstance(this.requestId).getTableName()} ph on ph.map_data_id = c.id
                    WHERE c.id IN (${placemarksIds.join(', ')})
                    ORDER by ph_id DESC`;

        return this.getBySql(_sql, undefined, false);
    }














    /*
     * Get placemarks data of specified country
     *
     * @param {string} countryCode - country code
     * @param {integer} offset - selection offset
     * @param {integer} limit - selection limit
     * @param {string} language - language
     * @param {boolean} needResult - is result required
     *
     * @return {array of objects} - DESCRIPTION
     */
    getCountryPlacemarks(countryCode, offset, limit, language, needResult = true)
    {
        let _sql = `SELECT
                c.id as id,
                c.title as title,
                geo.country_code as country_code,
                geo.state_code as state_code
            FROM ${this.getTableName()} c
            LEFT JOIN ${GeocodeCollectionModel.getInstance(this.requestId).getTableName()} geo on geo.map_data_id = c.id AND geo.language = ?
            WHERE geo.country_code = ?
            ORDER by c.id DESC`;

        if (BaseFunctions.isSet(offset) && BaseFunctions.isSet(limit)) {
            _sql += " LIMIT " + offset + ', ' + limit;
        }
        return this.getBySql(_sql, [language, countryCode], needResult);
    }






    /*
     * Get placemarks of specified category
     *
     * @param {integer} categoryId - category id
     * @param {integer} offset - selection offset
     * @param {integer} limit - selection limit
     * @param {string} language - language
     * @param {boolean} needResult - is result required
     *
     * @return {array of objects}
     */
    getCategoryPlacemarks(categoryId, offset, limit, language, needResult = true) {

        categoryId = BaseFunctions.toInt(categoryId);

        let _sql = `SELECT
                c.id as id,
                c.title as title,
                geo.country_code as country_code,
                geo.country as country,
                geo.state_code as state_code
            FROM ${this.getTableName()} c
            LEFT JOIN ${GeocodeCollectionModel.getInstance(this.requestId).getTableName()} geo on geo.map_data_id = c.id
                    AND geo.language=?
                    WHERE category = ? OR subcategories REGEXP '[[:<:]]${categoryId}[[:>:]]'
            ORDER by c.id DESC`;

            if (BaseFunctions.isSet(offset) && BaseFunctions.isSet(limit)) {
                _sql += " LIMIT " + offset + ', ' + limit;
            }

        return this.getBySql(_sql, [language, categoryId], needResult);
    }















//ATTENTION - обратите внимание
//get_points_by_coords => MY_MODULE_NAME_MAP.getPointsShortDataByCoords




//ATTENTION - обратите внимание
// getPointsByIds => MY_MODULE_NAME_MAP.getPointsByIds
//getPointContentById(id) => Map.getPointContentById

// get_points_bunch => MY_MODULE_NAME_MAP.get_points_bunch




















//    addArticle(data)
//    {
//        this.setValuesToFields(data);
//        return this.insert();
//    }
//
//    updateArticle(data)
//    {
//        let _id = data.id;
//        delete data.id;
//        this.setValuesToFields(data);
//        return this.update(_id);
//    }


    /*
     * Get country name by country code
     *
     * @param {string} code - country code
     * @param {string} language - in what language country name will be get
     * @param {boolean} needResult - is result required
     *
     * @return {string} - country name
     */
//    getCountryNameByCode(code, language, needResult = true){
//
//        let _sql = "SELECT cn.name as name FROM country c \n\
//                    LEFT JOIN country_name cn on c.id = cn.country_id  \n\
//                    WHERE c.local_code = '" + code + "' AND cn.language='" + language + "'";
//
//        let _data = this.getBySql(_sql, undefined, needResult);
//
//        if (!_data.length || !_data[0].name) {
//            this.error(ErrorCodes.ERROR_COUNTRY_NAME_WAS_NOT_FOUND, 'country code [' + code + ']', undefined, false);
//        }
//
//        return _data[0].name;
//    }


}

MapDataModel.instanceId = BaseFunctions.unique_id();

module.exports = MapDataModel;