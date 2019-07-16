/*
 * File application/express/models/dbase/mysql/MapData.js
 * const MapDataModel = require('application/express/models/dbase/mysql/MapData');
 *
 * Map data MySql db model
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');
//const StrictFunctions = require('application/express/functions/StrictFunctions');
//const ErrorCodes = require('application/express/settings/ErrorCodes');

class MapDataModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableName;

        this.fields = {
            x:{
                rules:['numeric', 'required'],
                //processing:['htmlspecialchars'],
            },
                y:{
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

        // If coordinates are not set
        if ((!data.x && data.x !== 0 && data.x !== '0') || (!data.y && data.y !== 0 && data.y !== '0')) {
            delete data.x;
            delete data.y;
        }

        this.setValuesToFields(data);
        this.update(_id);
    }

    /*
     * Get placemarks data by its ids
     *
     * @param {array} ids - ids list
     *
     * @return {array of objects} - found placemarks data
     */
    getPointsByIds(ids)
    {
        $module = self::get_module(MY_MODULE_NAME_MAP);

        return $module->get_points_by_ids($ids);
    }


    //getPointContentById(id) => Map.getPointContentById


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