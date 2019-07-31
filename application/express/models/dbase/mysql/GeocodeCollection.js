/*
 * File application/express/models/dbase/mysql/GeocodeCollection.js
 * const GeocodeCollectionModel = require('application/express/models/dbase/mysql/GeocodeCollection');
 *
 * Geocode collection MySql db model
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');
const MapDataModel = require('application/express/models/dbase/mysql/MapData');
const Language = require('application/express/components/base/Language');
const Map = require('application/express/components/Map');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Service = require('application/express/core/Service');
const Countries = require('application/express/components/Countries');
const CountryStatesNamesModel = require('application/express/models/dbase/mysql/CountryStatesNames');
const CountryStatesModel = require('application/express/models/dbase/mysql/CountryStates');
const States = require('application/express/components/States');

class GeocodeCollectionModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableName;

        this.fields = {
            title:{
                'rules':['required'],
                'processing':['strip_tags'],
            },
        };

        this.fields = {
            map_data_id:{
                // Правила валидации значений поля
                rules:['numeric', 'required'],
            },
            language:{
                rules:['required'],
            },
            country_code:{
                rules:[],
                // If you pass an empty value then field will have the default value
                'default_value': Consts.UNDEFINED_VALUE,
                // If you don't pass any value to this field at all then field will have this initial value
                'value': Consts.UNDEFINED_VALUE,
            },
            state_code:{
                rules:[],
                'default_value': Consts.UNDEFINED_VALUE,
                'value': Consts.UNDEFINED_VALUE,
            },
            json_data:{
                rules:[],
            },
            formatted_address:{
                rules:[],
            },
            street:{
                rules:[],
            },
            country:{
                rules:[],
            },
            administrative_area_level_1:{
                rules:[],
            },
            administrative_area_level_2:{
                rules:[],
            },
            locality:{
                rules:[],
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
            this.tableName = this.getServiceName() + '_geocode_collection';
        }
        return this.tableName;
    }


    /*
     * Add record for placemark on one language
     *
     * @param {integer} id - placemark id
     * @param {string} language - language
     * @param {object} enData - data of current placemark in english
     *
     * @return {object} - added data
     */
    addOnOneLanguage(id, language, enData)
    {
        let _data = MapDataModel.getInstance(this.requestId).getById(id);

        _data = this.prepareAddress(
                {
                    'x':_data['x'],
                    'y':_data['y']
                },
                id,
                language,
                {
                    'country':enData['country'],
                    'administrative_area_level_1':enData['administrative_area_level_1']
                });
        // Delete possibly already existed record
        this.deleteAdresses(id, language);

        // Now record
        this.setValuesToFields(_data);
        this.insert();

        return _data;
    }




    /*
     * Delete all records of placemark for all languages or only specific language
     *
     * @param {integer} id - placemark id
     * @param {string} language - language which data will be deleted
     */
    deleteAdresses(id, language = null)
    {
        if (!id) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'placemark id [' + id + ']');
        }

        let _condition = "map_data_id=" + id;
        if (language) {
            condition += " AND language='" + language + "'";
        }
        let _results = this.getByCondition(_condition, '', '', '*', undefined, undefined, false);

        for (let _index in  _results) {
            let _result = _results[_index];
            this.delete(_result['id']);
        }
    }






    /*
     * Prepare geodata
     *
     * @param {object} data - data to be prepared
     * @param {integer} id - placemark id
     * @param {string} language - language on which geodata will be prepared
     * @param {object} enData - the sample in english
     *
     * @return {object} - added data
     */
    prepareAddress(data, id, language, enData = {})
    {
        if ((language !== Consts.LANGUAGE_EN) && (!enData['country'] || !enData['administrative_area_level_1'])) {
            this.error(ErrorCodes.ERROR_MAP_API_HAS_NOT_ENGLISH, 'for language [' + language + ']');
        }
        if (!BaseFunctions.isSet(data.x) || !BaseFunctions.isSet(data.y)) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'data [' + BaseFunctions.toString(data) + ']');
        }
        if (!id) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'placemark id [' + id + ']');
        }
        if (!language) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'language [' + language + ']');
        }

        Language.getInstance(this.requestId).checkLanguage(language);

        let _adress = Map.getInstance(this.requestId).getAdressByCoords(data, language);

        let _adressJson = JSON.stringify(_adress);

        let _data = {
            'map_data_id':id,
            'language':language,
            'json_data':_adressJson,
            'formatted_address':_adress['formattedAdress']
        };

        for (var index in _adress['address_components']['GeoObject']['metaDataProperty']['GeocoderMetaData']['Address']['Components']) {
            let _component = _adress['address_components']['GeoObject']['metaDataProperty']['GeocoderMetaData']['Address']['Components'][index];

            if (_component['kind'] === 'street') {

                _data['street'] = _component['name'];

            } else if (_component['kind'] === 'country') {

                _data['country'] = _component['name'];

                /*
                 * 1. _component['name'] - only when 'data' argument passed in English, enData['country'] is empty in this case.
                 *
                 * 2. When _component['name'] and enData['country'] are empty - _data['country_code']
                 *    will have string 'undefined' value (specified in prepareToOneWord()).
                 *    Case for english language with no country location (Antarctida, Pacific ocean, etc).
                 */
                _data['country_code'] = BaseFunctions.prepareToOneWord(enData['country'],_component['name']);

            } else if (_component['kind'] === 'province') {

                _data['administrative_area_level_1'] = _component['name'];

                /*
                 * 1. _component['name'] - only when 'data' argument passed in English, enData['administrative_area_level_1'] is empty in this case.
                 *
                 * 2. When _component['name'] and enData['administrative_area_level_1'] are empty - _data['state_code']
                 *    will have string 'undefined' value (specified in prepareToOneWord()).
                 *    Case for english language with no country location (Antarctida, Pacific ocean, etc).
                 */
                _data['state_code'] = BaseFunctions.prepareToOneWord(enData['administrative_area_level_1'],_component['name']);

            } else if (_component['kind'] === 'area') {

                _data['administrative_area_level_2'] = _component['name'];

            } else if (_component['kind'] === 'locality') {

                _data['locality'] = _component['name'];
            }
        }
         if (!_data['state_code']) {
            _data['administrative_area_level_1'] = Consts.UNDEFINED_VALUE;
            _data['state_code'] = Consts.UNDEFINED_VALUE;
        }

        return _data;
    }

    /*
     * Add record for one placemark in all available languages
     *
     * @param {object} coords - placemark coordinates
     * @param {integer} id - placemark id
     *
     * @return {array} - new geodata ids
     */
    add(coords, id)
    {
        let _result = [];
        let _languages = Service.getInstance(this.requestId).getLanguagesCodes();

        // Initially prepare adress in English
        let _dataEn = this.prepareAddress(coords, id, Consts.LANGUAGE_EN);
        this.setValuesTofields(dataEn);

        _result.push(this.insert());

        let _administrativeAreaLevel1En = _dataEn['administrative_area_level_1'] ? _dataEn['administrative_area_level_1'] : Consts.UNDEFINED_VALUE;

        let _countryEn = _dataEn['country'] ? _dataEn['country'] : Consts.UNDEFINED_VALUE;

        let _countryCodeEn = _dataEn['country_code'] ? _dataEn['country_code'] : Consts.UNDEFINED_VALUE;

        let countryId = Countries.getInstance(this.requestId).getCountryDataByCode(_countryCodeEn)['id'];


        if (_dataEn['state_code'] != Consts.UNDEFINED_VALUE) {
            // Try to add new state
            CountryStatesModel.getInstance(this.requestId).addOnce({
                'url_code':_dataEn['state_code'],
                'country_id':countryId
            });

            let _stateId = States.getStateIdByCode(_dataEn['state_code']);

            // Try to add new state name - defined and in English
            CountryStatesNamesModel.getInstance(this.requestId).addOnce({
                'state_id':stateId,
                'name':administrativeAreaLevel1En,
                'language':Consts.LANGUAGE_EN
            });
        }

        //For other languages
        for (let index in _languages) {
            let _language = _languages[index];

            if (_language !== Consts.LANGUAGE_EN) {
                let _data = this.prepareAddress(coords, id, _language, {
                    'country':countryEn,
                    'administrative_area_level_1':_administrativeAreaLevel1En
                });


            this.setValuesToFields(_data);


             _result.push(this.insert());

                if (_dataEn['state_code'] != Consts.UNDEFINED_VALUE) {


                    if (_data['administrative_area_level_1'] == Consts.UNDEFINED_VALUE) {
                        _data['administrative_area_level_1'] = _administrativeAreaLevel1En;
                    }

                    // Try to add new state name - defined and in nonenglish language
                    CountryStatesNamesModel.getInstance(this.requestId).addOnce({
                        'state_id':stateId,
                        'name':_data['administrative_area_level_1'],
                        'language':_language
                    }
                    );
                }
            }
        }

        return _result;
    }

// //ATTENTION - обратите внимание get_countries => CountriesModel.getCountries

    /*
     * Update placemark's geodata
     *
     * @param {object} coords - new coordinates
     * @param {integer} dataId - placemark id
     *
     * @return {boolean(false)} or {array of objects} - new geodata on all available languages
     */
    updateRecord(coords, dataId)
    {
        if (coords['x'] && coords['y']) {

            // Delete all old records for this placemark
            this.deleteAdresses(dataId);

            //Add new
            return this.add(coords, dataId);
        }
        return false;
    }


    /*
     * Return data of all countries
     *
     * @return {array of objects}
     */
    getCountriesData()
    {
        let _language = this.getLanguage();

        return this.getByCondition(
            condition = "language=? AND country_code != ''",
            order = 'country ASC',
            group = 'country_code',
            select = 'country, country_code, state_code, COUNT(country_code) as placemarks_count',
            where_values = [_language],
            limit = false,
            need_result = false
        );
    }






    /*
     * Check placemark by set address
     *
     * @param {integer} id - placemark id
     * @param {string} countryCode - country code
     * @param {string} stateCode - state code
     *
     * @return {boolean}
     */
    checkPlacemark(id, countryCode, stateCode)
    {
        id = BaseFunctions.toInt(id);

        let _condition = "map_data_id = ? AND country_code = ? ";
        let _whereValues = [id, countryCode];

        if (stateCode) {
            _condition += "AND state_code = ?";
            _whereValues.push(stateCode);
        }

        let _result = this.getByCondition(
            _condition,
            order = '',
            group = '',
            select = 'id',
            _whereValues,
            limit = 1,
            need_result = false
        );

        return _result[0]['id'] ? true : false;
    }










    /*
     * Get geodata and placemarks ids by country and state codes
     *
     * @param {string} countryCode
     * @param {string} stateCode
     * @param {boolean} needResult - is result required
     *
     * @return {object} - geodata of each found placemark
     * {
     *      ids : [values:integer],
     *      data : [values:{}]
     *  }
     */
    getPlacemarksData(countryCode, stateCode, needResult)
    {
        let _language = this.getLanguage();

        let _condition = "gc.language=?";
        let _whereArray = [_language];

        if (countryCode) {
            _condition += " AND gc.country_code=?";
            _whereArray.push(countryCode);
        }
        if (stateCode) {
            _condition += " AND gc.state_code=?";
            _whereArray.push(stateCode);
        }

        let _sql = `SELECT DISTINCT
                gc.map_data_id as placemarks_id,
                gc.state_code, gc.country_code, gc.formatted_address,
                gc.country, gc.administrative_area_level_1 as state,
                gc.locality, cs.is_administrative_center
            FROM ${this.getTableName()} gc
            LEFT JOIN country_states cs on cs.url_code = gc.state_code
            WHERE ${_condition} ORDER by gc.id DESC`;

        let _placemarksData = this.getBySql(_sql,_whereArray, needResult);

        let _result = {
            ids:[],
            data:[]
        };

        if (_placemarksData.length) {
            for (let _index in _placemarksData) {
                let _placemark = _placemarksData[_index];

                if ((_placemark['state']) && (_placemark['state_code']) && (_placemark['country_code'])) {
                    _placemarksData[_index]['state'] = Countries.getInstance(this.requestId).getTranslationOfStateName(_language, _placemark['country_code'], _placemark['state'], _placemark['state_code']);
                }

                _result['ids'].push(_placemark['placemarks_id']);
                _result['data'][_placemark['placemarks_id']] = _placemark;
            }
        }

        return _result;
    }

}

GeocodeCollectionModel.instanceId = BaseFunctions.unique_id();

module.exports = GeocodeCollectionModel;