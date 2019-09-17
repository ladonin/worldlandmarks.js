/*
 * File server/src/models/dbase/mysql/MapData.js
 * const MapDataModel = require('server/src/models/dbase/mysql/MapData');
 *
 * Map data MySql db model
 */

const DBaseMysql = require('server/src/core/dbases/Mysql');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Config = require('server/src/settings/Config');


class MapDataModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableNameInit = this.tableInitNames.MAP_DATA;

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

//ATTENTION - обратите внимание
//update_point => change
//getPointsBigDataByIds => getPointsDataByIds
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
     * Get placemarks data by ids
     *
     * @param {array} ids - placemarks ids
     * @param {string} language - language
     * @param {string} order - fetch order
     * @param {boolean} needPlainText - whether placemark description (plain text) is necessary
     * @param {boolean} needText - whether placemark description (main text with html) is necessary
     * @param {boolean} needResult - whether result is required
     *
     * @return {array of objects} - placemarks data
     */
    getPointsDataByIds(ids, language, order, needPlainText, needText, needResult = true)
    {
        ids = BaseFunctions.prepareToIntArray(ids);
        let _idsList = ids.join(',');
        let _commentPlain = '';

        if (needPlainText) {
            _commentPlain = 'c.comment_plain as c_comment_plain,';
        }

        let _comment = '';

        if (needText) {
            _comment = 'c.comment as c_comment,';
        }

        let _sql = `SELECT
                c.id as c_id,
                c.x as c_x,
                c.y as c_y,
                ${_comment}
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
                geo.street as g_street

                FROM ${this.getTableName()} c
                LEFT JOIN ${this.getTableName(this.tableInitNames.GEOCODE_COLLECTION)} geo on geo.map_data_id = c.id AND geo.language=?
                WHERE c.id IN (${_idsList}) `;

        let _innerOrder='c_id DESC';

        if (order) {
            _sql += `ORDER by ${order},${_innerOrder}`;
        } else {
            _sql += `ORDER by ${_innerOrder}`;
        }

        let _result = this.getBySql(_sql, [language], needResult);

        return _result;
    }








//ATTENTION - обратите внимание
//getPointsShortDataByIds => getPointsDataByIds
    /*
     * Get placemarks short data by ids
     *
     * @param {array} ids - placemarks ids
     * @param {boolean} needComment - whether placemark description required
     * @param {boolean} needResult - whether result required
     *
     * @return {array of objects} - placemarks data
     */
//    getPointsShortDataByIds(ids, needComment = false, needResult = true)
//    {
//        ids = BaseFunctions.prepareToIntArray(ids);
//        let _idsList = ids.join(',');
//
//        let _comment = needComment ? 'c.comment as c_comment,' : '';
//
//        // Get only first photo
//        let _sql = `SELECT
//                    c.id as c_id,
//                    ${_comment}
//                    c.x as c_x,
//                    c.y as c_y,
//                    c.title as c_title,
//                    c.category as c_category,
//                    c.subcategories as c_subcategories,
//                    c.relevant_placemarks as c_relevant_placemarks,
//
//                    ph.id as ph_id,
//                    ph.path as ph_path,
//                    ph.width as ph_width,
//                    ph.height as ph_height
//
//                    FROM ${this.getTableName()} c
//                    LEFT JOIN (
//                        SELECT * FROM (SELECT MAX(id) phh2_id FROM ${this.getTableName(this.tableInitNames.MAP_PHOTOS)} GROUP BY map_data_id) phh2
//                        JOIN ${this.getTableName(this.tableInitNames.MAP_PHOTOS)} phh3 on phh2.phh2_id=phh3.id
//                    ) ph ON ph.map_data_id=c.id
//                    WHERE c.id IN (${_idsList})
//                    GROUP by c_id
//                    ORDER by c_title ASC`;
//
//        return this.getBySql(_sql, undefined, needResult);
//    }


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
                t.relevant_placemarks as c_relevant_placemarks

                FROM (SELECT * FROM ${this.getTableName()} WHERE `;

        if ((x1 > 0) && (x2 < 0)) {

            _sql += `((x BETWEEN ${x1} AND 180) OR (x BETWEEN -180 AND ${x2})) `;
        } else {

            _sql += `(x BETWEEN ${x1} AND ${x2}) `;
        }

        _sql += `AND (y BETWEEN ${y2} AND ${y1})) t`;

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
        return this.getByCondition(
            /*condition*/`t.id NOT IN (${ignore})`,
            /*order*/'RAND()',
            /*group*/'',
            /*select*/'id, x, y, title, category, subcategories, relevant_placemarks',
            /*where_values*/[],
            /*limit*/limit,
            /*need_result*/false
        );
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
                /*condition*/"id!=? AND (category = ? OR subcategories REGEXP '[[:<:]]" + categoryId + "[[:>:]]')",
                /*order*/'RAND()',
                /*group*/'',
                select,
                /*where_values*/[pointId, categoryId],
                /*limit*/Config['restrictions']['max_items_at_sublist'],
                /*need_result*/false
                );
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
                /*condition*/"category = ? OR subcategories REGEXP '[[:<:]]" + id + "[[:>:]]'",
                /*order*/'',
                /*group*/'',
                /*select*/'COUNT(*) as placemarks_count',
                /*where_values*/[id],
                /*limit*/1,
                /*need_result*/false
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
            /*order*/'',
            /*group*/'',
            /*select*/'COUNT(*) as placemarks_count',
            /*where_values*/[],
            /*limit*/1,
            /*need_result*/false
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
                    JOIN ${this.getTableName(this.tableInitNames.MAP_PHOTOS)} ph on ph.map_data_id = c.id
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
     * @param {boolean} needResult - whether result is required
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
            LEFT JOIN ${this.getTableName(this.tableInitNames.GEOCODE_COLLECTION)} geo on geo.map_data_id = c.id AND geo.language = ?
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
     * @param {boolean} needResult - whether result is required
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
            LEFT JOIN ${this.getTableName(this.tableInitNames.GEOCODE_COLLECTION)} geo on geo.map_data_id = c.id
                    AND geo.language=?
                    WHERE category = ? OR subcategories REGEXP '[[:<:]]${categoryId}[[:>:]]'
            ORDER by c.id DESC`;

            if (BaseFunctions.isSet(offset) && BaseFunctions.isSet(limit)) {
                _sql += " LIMIT " + offset + ', ' + limit;
            }

        return this.getBySql(_sql, [language, categoryId], needResult);
    }



    /*
     * Return limited collection of placemarks by search conditions
     *
     * @param {integer} idStart - placemark id from which collection will be started
     * @param {integer} category - category
     * @param {string} country - country
     * @param {string} state - state
     * @param {string} keywords - placemark keywords (separate field)
     * @param {integer} limit - selection limit
     * @param {string} language - language
     * @param {boolean} needResult - whether result is required
     *
     * @return  {array of objects}
     */
    getPlacemarksSeacrhList(idStart = 0, category = false, country = '', state = '', keywords = '', limit, language, needResult)
    {
        category = category === '' ? false : category;
        category = category !== false ? BaseFunctions.toInt(category) : category;
        country = BaseFunctions.quote(country);
        state = BaseFunctions.quote(state);
        keywords = BaseFunctions.quote(keywords.toLowerCase());

        let _condition = 1;
        let _order = 'c.id DESC';
        if (idStart) {
            _condition += ' AND c.id < ' + idStart;
        }

        if (category !== false){
            _condition += " AND (c.category = '" + category + "' OR c.subcategories REGEXP '[[:<:]]" + category + "[[:>:]]')";
        }
        if (country) {
            _condition += ' AND LOWER(geo.country_code) = LOWER("' + country + '")';
        }
        if (state) {
            _condition += ' AND LOWER(geo.state_code) = LOWER("' + state + '")';
        }
        if (keywords) {
            _condition += " AND LOWER(c.title) LIKE '%" + keywords + "%'";
        }

        let _sql = `SELECT
                c.id as id
                FROM ${this.getTableName()} c
                LEFT JOIN ${this.getTableName(this.tableInitNames.GEOCODE_COLLECTION)} geo on geo.map_data_id = c.id AND geo.language=?
                WHERE ${_condition}
                ORDER by ${_order}
                LIMIT ${limit}`;

        return this.getBySql(_sql, [language], needResult);
    }


    /*
     * Return limited collection of placemarks started from last
     *
     * @param {integer} idStart - placemark id from which collection will be started
     * @param {integer} limit - selection limit
     *
     * @return  {array of objects}
     */
    getLastPLacemarks (idStart, limit){
            let _condition = '1';

            if (idStart) {
                _condition += ' AND id < ?';
            }

            return this.getByCondition(
                _condition,
                /*order*/'id DESC',
                /*group*/'',
                /*select*/'id',
                /*where_values*/[idStart],
                limit,
                /*need_result*/false
            );
    }



//ATTENTION - обратите внимание
//get_points_by_coords => MY_MODULE_NAME_MAP.getPointsShortDataByCoords




//ATTENTION - обратите внимание
// getPointsByIds => MY_MODULE_NAME_MAP.getPointsByIds
//getPointContentById(id) => Map.getPointBigDataById

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
     * @param {boolean} needResult - whether result is required
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