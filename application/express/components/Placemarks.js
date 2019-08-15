/*
 * File application/express/components/Placemarks.js
 * const Placemarks = require('application/express/components/Placemarks');
 *
 * Placemark component
 */

const Component = require('application/express/core/parents/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Service = require('application/express/core/Service');
const Geo = require('application/express/components/Geo');
const GeocodeCollectionModel = require('application/express/models/dbase/mysql/GeocodeCollection');
const Countries = require('application/express/components/Countries');
const CountryStatesModel = require('application/express/models/dbase/mysql/CountryStates');
const CountryStatesNamesModel = require('application/express/models/dbase/mysql/CountryStatesNames');
const States = require('application/express/components/States');
const MapDataModel = require('application/express/models/dbase/mysql/MapData');
const CountryStatesCitiesTranslationsModel = require('application/express/models/dbase/mysql/CountryStatesCitiesTranslations');
const Users = require('application/express/core/Users');


class Placemarks extends Component {

    constructor(){
        super();

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
        let _dataEn = Geo.getInstance(this.requestId).prepareAddress(coords, id, Consts.LANGUAGE_EN);

        _result.push(GeocodeCollectionModel.getInstance(this.requestId).add(_dataEn));

        let _administrativeAreaLevel1En = _dataEn['administrative_area_level_1'] ? _dataEn['administrative_area_level_1'] : Consts.UNDEFINED_VALUE;

        let _countryEn = _dataEn['country'] ? _dataEn['country'] : Consts.UNDEFINED_VALUE;

        let _countryCodeEn = _dataEn['country_code'] ? _dataEn['country_code'] : Consts.UNDEFINED_VALUE;

        let countryId = Countries.getInstance(this.requestId).getCountryDataByCode(_countryCodeEn)['id'];

        let _stateId;

        if (_dataEn['state_code'] !== Consts.UNDEFINED_VALUE) {
            // Try to add new state
            CountryStatesModel.getInstance(this.requestId).addOnce({
                'url_code':_dataEn['state_code'],
                'country_id':countryId
            });

            _stateId = States.getStateIdByCode(_dataEn['state_code']);

            // Try to add new state name - defined and in English
            CountryStatesNamesModel.getInstance(this.requestId).addOnce({
                'state_id':_stateId,
                'name':_administrativeAreaLevel1En,
                'language':Consts.LANGUAGE_EN
            });
        }

        //For other languages
        for (let index in _languages) {
            let _language = _languages[index];
            let _data;

            if (_language !== Consts.LANGUAGE_EN) {
                _data = Geo.getInstance(this.requestId).prepareAddress(coords, id, _language, {
                    'country':_countryEn,
                    'administrative_area_level_1':_administrativeAreaLevel1En
                });

                this.setValuesToFields(_data);

                _result.push(this.insert());

                if (_dataEn['state_code'] !== Consts.UNDEFINED_VALUE) {


                    if (_data['administrative_area_level_1'] === Consts.UNDEFINED_VALUE) {
                        _data['administrative_area_level_1'] = _administrativeAreaLevel1En;
                    }

                    // Try to add new state name - defined and in nonenglish language
                    CountryStatesNamesModel.getInstance(this.requestId).addOnce({
                        'state_id':_stateId,
                        'name':_data['administrative_area_level_1'],
                        'language':_language
                    }
                    );
                }
            }
        }

        return _result;
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
    addInOneLanguage(id, language, enData)
    {
        let _data = MapDataModel.getInstance(this.requestId).getById(id);

        _data = Geo.getInstance(this.requestId).prepareAddress(
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
        GeocodeCollectionModel.getInstance(this.requestId).deleteAdresses(id, language);

        // Now record
        GeocodeCollectionModel.getInstance(this.requestId).add(_data);

        return _data;
    }


    /*
     * Get placemarks big data by ids
     *
     * @param {array} ids - placemarks ids
     * @param {boolean} needPlainText - whether placemark description (plain text) is necessary
     * @param {string} order - fetch order
     * @param {boolean} needRelevant - whether 'relevant' placemarks are necessary
     * @param {boolean} needAnother - whether 'another' placemarks are necessary
     *
     * @return {object} - placemark data
     */
    getPlacemarksBigDataByIds(ids, needPlainText = true, order = null, needRelevant = false, needAnother = false)
    {
        if (!ids) {
            return [];
        }

        let _language = this.getLanguage();

        let _result = MapDataModel.getInstance(this.requestId).getPointsBigDataByIds(ids, _language, order, needPlainText, true);

        return this.prepareResult(_result, needRelevant, needAnother);
    }


    /*
     * Return photo directory
     *
     * @param {integer} id - placemark id
     * @param {string} name - photo name without size prefix
     *
     * @return {string}
     */
    getPhotoDir(id, name)
    {
        return BaseFunctions.preparePhotoPath(id, name, '1_', true, true);
    }


    /*
     * Return category code by id
     *
     * @param {integer} id - category id
     *
     * @return {string}
     */
    getCategoryCode(id)
    {
        let _categories = Service.getInstance(this.requestId).getCategories();

        for (let _index in _categories) {
            let _category = _categories[_index];

            if (_category['id'] === id) {
                return _category['code'];
            }
        }
        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'id[' + id + ']', undefined, false);
    }


    /*
     * Return full address as link in html with route (more detail address)
     *
     * @param {string} stateCode - state code
     * @param {string} countryCcode - country code
     * @param {string} administrativeAreaLevel2 - alternative city name (google maps termin)
     * @param {string} state - state name
     * @param {string} country - country name
     * @param {string} city - city name
     * @param {string} route - address details: street (if exist) etc.
     *
     * @return {string} - html link
     */
    prepareAddressLinkWithRoute(stateCode, countryCcode, administrativeAreaLevel2, state, country, city, route)
    {
        let _address = this.prepareAddressLink(stateCode, countryCcode, administrativeAreaLevel2, state, country, city);

        if ((route !== Consts.ADDRESS_UNNAMED_ROAD_VALUE) && (route)) {
            _address += " &bull; " + route;
        }

        return _address;
    }


    /*
     * Return full address as link in html
     *
     * @param {string} stateCode - state code
     * @param {string} countryCcode - country code
     * @param {string} administrativeAreaLevel2 - alternative city name (google maps termin)
     * @param {string} state - state name
     * @param {string} country - country name
     * @param {string} city - city name
     *
     * @return {string} - html link
     */
    prepareAddressLink(stateCode, countryCcode, administrativeAreaLevel2, state, country, city)
    {
        if (!countryCcode) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'country code [' + countryCcode + ']', undefined, false);
          } else if (!state) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'state [' + state + ']', undefined, false);
        }

        let _language = this.getLanguage();

        state = CountryStatesCitiesTranslationsModel.getInstance(this.requestId).getTranslationOfStateName(_language, countryCcode, state, stateCode);
        country = Countries.getInstance(this.requestId).prepareCountryName(country);

        country = '<img class="adress_country_flag" src="' + Consts.IMG_URL + 'flags/' + countryCcode + '.png">' + country;

        let _addres = '';
        if (Service.getInstance(this.requestId).whetherShowCatalogPages() === true) {
            _addres = "<a href='/" + Consts.CONTROLLER_NAME_CATALOG + "/" + countryCcode + "'>" + country + '</a>';
        } else {
            _addres = country;
        }
        if (Countries.getInstance(this.requestId).hasStates(countryCcode)) {
            if (!stateCode) {
                this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'state_code [' + stateCode + ']', undefined, false);
            }
            if (stateCode !== Consts.UNDEFINED_VALUE) {
                if (Service.getInstance(this.requestId).whetherShowCatalogPages() === true) {
//ATTENTION - обратите внимание - прямая ссылка
                    _addres += " &bull; <a href='/" + Consts.CONTROLLER_NAME_CATALOG + "/" + countryCcode + "/" + stateCode + "'>" + state + '</a>';
                } else {
                    _addres += " &bull; " + state;
                }

                if (Users.getInstance(this.requestId).isAdmin() && state){

                    _addres += " <a style='color:#f00;' target='_blank' href='/admin/translate_state.php?country_code="+countryCcode+"&state_code="+stateCode+"&name="+encodeURI(state)+"' title='перевод'>&equiv;</a>";
                }
            }
        }
        let _locality = '';
        let _localitySource = '';
        if (Countries.getInstance(this.requestId).isAdministrativeCenter(countryCcode, stateCode) === false) {
            _addres += '<span class="locality">';
            if (city) {
                _locality = Countries.getInstance(this.requestId).getTranslationOfCityName(countryCcode, city, stateCode, _language);
                _addres += ' &bull; ' + _locality;
                _localitySource = city;
            } else if (administrativeAreaLevel2) {
                _locality = Countries.getInstance(this.requestId).getTranslationOfCityName(countryCcode, administrativeAreaLevel2, stateCode, _language);
                _addres += ' &bull; ' + _locality;
                _localitySource = administrativeAreaLevel2;
            }
                if (Users.getInstance(this.requestId).isAdmin() && _localitySource){
//ATTENTION - обратите внимание - прямая ссылка
                    _addres += " <a style='color:#f00;' target='_blank' href='/admin/translate_locality.php?country_code="+countryCcode+"&state_code="+stateCode+"&name="+encodeURI(_locality)+"&locality_source="+encodeURI(_localitySource)+"' title='перевод'>&equiv;</a>";
                }
                _addres +='</span>';
        }

        return _addres;
    }

    /*
     * Return another placemarks ids related to category
     *
     * @param {integer} categoryId - category id
     * @param {integer} pointId - placemark id
     *
     * @return {array} - another placemarks ids
     */
    getAnotherPlacemarksIdsByCategory(categoryId, pointId)
    {
        let _placemarks = MapDataModel.getInstance(this.requestId).getAnotherPlacemarksByCategory(categoryId, pointId, 'id');

        let _result = [];
        if (_placemarks.length) {
            for (let _index in _placemarks) {
                let _placemark = _placemarks[_index];
                _result.push(_placemark['id']);
            }
        }
        return _result;
    }
}


Placemarks.instanceId = BaseFunctions.unique_id();

module.exports = Placemarks;