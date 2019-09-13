/*
 * File server/src/components/Geo.js
 * const Geo = require('server/src/components/Geo');
 *
 * Common geo component - compute geo data
 */

const Component = require('server/src/core/parents/Component');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Consts = require('server/src/settings/Constants');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Language = require('server/src/core/Language');
const AccessConfig = require('server/src/settings/gitignore/Access');
const Fetch = require('node-fetch');
const Deasync = require('deasync');

class Geo extends Component {

    constructor(){
        super();
        /*
         * Example: https://geocode-maps.yandex.ru/1.x/?format=json&apikey=APIKEY&geocode=19.611347,0.760241&lang=en
         */
        this.GEOCODE_SERVICE_URL = 'https://geocode-maps.yandex.ru/1.x/?';
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

        let _adress = this.getAdressByCoords(data, language);

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
     * Get adress by coordinates from API
     *
     * @param {object} coords - coordinates {x,y}
     * @param {string} language - desired adress language
     *
     * @return {object} - adress
     */
    getAdressByCoords(coords, language = '')
    {
        if (!language) {
            language = this.getLanguage();
        }

        if (!language) {
            this.error(ErrorCodes.ERROR_LANGUAGE_NOT_FOUND, 'language [' + language + ']');
        }

        let _query = this.GEOCODE_SERVICE_URL + 'format=json&apikey=' + AccessConfig.yandexMapApiKey + '&geocode='+ coords.x + ',' + coords.y + '&lang=' + language;
        let _apiData;
        let _finished = false;

        Fetch(_query)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                _apiData = data;
                _finished = true;
            });

        // Wait for process to be finished
        Deasync.loopWhile(function () {
            return !_finished;
        });

        if (_apiData.error) {
            this.error(ErrorCodes.ERROR_MAP_API, _apiData.error.message);
        }

        if (!_apiData.response || !_apiData.response.GeoObjectCollection || !BaseFunctions.isSet(_apiData.response.GeoObjectCollection.featureMember)) {
            this.error(ErrorCodes.ERROR_MAP_API_CHANGED_DATA);
        }
        let _featureMember = _apiData.response.GeoObjectCollection.featureMember;
        let _adress = {};

        _adress['addressComponents'] = _featureMember[0];
        _adress['formattedAddress'] = _featureMember[0]['GeoObject']['metaDataProperty']['GeocoderMetaData']['text'];

        return _adress;
    }






}


Geo.instanceId = BaseFunctions.unique_id();

module.exports = Geo;