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


class MapDataModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableName;

        this.fields = {
            x:{
                // Preparing value before validating
                preparing:['to_float'],
                rules:['numeric', 'required'],
                //processing:['htmlspecialchars'],
            },
            y:{
                // Preparing value before validating
                preparing:['to_float'],
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



    /*
     * Update placemark
     *
     * @param {object} data - placemark's new data with id
     */
    change(data)
    {
        let _id = data.id;
        delete data.id;

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

        return this.getBySql(_sql);
    }






























    /*
     * Get placemarks short data by ids
     *
     * @param {float} _x1 - x1 coordinate
     * @param {float} _x2 - x2 coordinate
     * @param {float} _y1 - y1 coordinate
     * @param {float} _y2 - y2 coordinate
     *
     * @return {array of objects} - placemarks data
     */
    getPointsByCoordsNaked(_x1, _x2, _y1, _y2)
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

        if ((_x1 > 0) && (_x2 < 0)) {

            _sql += `((x BETWEEN ${_x1} AND 180) OR (x BETWEEN -180 AND ${_x2})) `;
        } else {

            _sql += `(x BETWEEN ${_x1} AND ${_x2}) `;
        }

        _sql += `AND (y BETWEEN ${_y2} AND ${_y1})) t LEFT JOIN (
                SELECT * FROM
                (SELECT MAX(id) phh2_id FROM landmarks_map_photos GROUP BY map_data_id) phh2
                JOIN landmarks_map_photos on phh2.phh2_id=landmarks_map_photos.id
                ) ph ON ph.map_data_id=t.id`;

        // What is already sent
        let _loadedIdsFromSession = Map.getInstance(this.requestId).getLoadedIdsStringFromSession();
        if (_loadedIdsFromSession) {
            _sql += ` WHERE t.id NOT IN (${_loadedIdsFromSession})`;
        }

        _sql += " GROUP by c_id";

        return this.getBySql(_sql, false);
    }





















    /*
     * Получаем основные данные меток по диапазону координат
     *
     * @param array $coords - координаты
     *
     * @return array - данные найденных меток
     */
    function get_points_by_coords(array $coords)
    {

        $module = self::get_module(MY_MODULE_NAME_MAP);

        return $module->get_points_by_coords($coords);
    }



















//ATTENTION - обратите внимание
// getPointsByIds => MY_MODULE_NAME_MAP.getPointsByIds
//getPointContentById(id) => Map.getPointContentById




    /*
     * Получаем пачку меток для постепенного наполнения ими карты
     *
     * @return array - данные найденных меток
     */
    function get_points_bunch()
    {
        $module = self::get_module(MY_MODULE_NAME_MAP);
        $limit=self::get_module(MY_MODULE_NAME_SERVICE)->get_map_autofill_limit();
        return $module->get_points_by_limit($limit);
    }

















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