/*
 * File server/src/components/Placemarks.js
 * const Placemarks = require('server/src/components/Placemarks');
 *
 * Placemark component
 */

const Component = require('server/src/core/parents/Component');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Consts = require('server/src/settings/Constants');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Service = require('server/src/core/Service');
const Geo = require('server/src/components/Geo');
const GeocodeCollectionModel = require('server/src/models/dbase/mysql/GeocodeCollection');
const Countries = require('server/src/components/Countries');
const CountryStatesModel = require('server/src/models/dbase/mysql/CountryStates');
const CountryStatesNamesModel = require('server/src/models/dbase/mysql/CountryStatesNames');
const States = require('server/src/components/States');
const MapDataModel = require('server/src/models/dbase/mysql/MapData');
const CountryStatesCitiesTranslationsModel = require('server/src/models/dbase/mysql/CountryStatesCitiesTranslations');
const Users = require('server/src/core/Users');
const Config = require('server/src/settings/Config');
const Categories = require('server/src/components/Categories');
const MapPhotosModel = require('server/src/models/dbase/mysql/MapPhotos');

class Placemarks extends Component
{

    constructor()
    {
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
     * @param {boolean} needText - whether placemark description (main text with html) is necessary
     * @param {string} order - fetch order
     * @param {boolean} needRelevant - whether 'relevant' placemarks are necessary
     * @param {boolean} needAnother - whether 'another' placemarks are necessary
     * @param {boolean/number} needPhotos - should we add either photos (needPhotos = true) or one photo (needPhotos = 1) to result or not
     * @param {boolean} addressWithRoute - should we add adddress with route to result or not
     * @param {boolean} addressWithoutRoute - should we add adddress without route to result or not
     *
     * @return {object} - placemark data
     */
    getPlacemarksDataByIds(ids, needPlainText = true, needText = true, order = null, needRelevant = false, needAnother = false, needPhotos = false, addressWithRoute = true, addressWithoutRoute = true)
    {
        if (!ids) {
            return [];
        }

        let _language = this.getLanguage();

        let _result = MapDataModel.getInstance(this.requestId).getPointsDataByIds(ids, _language, order, needPlainText, needText, false);

        if (!_result.length) {
            this.error(
                ErrorCodes.ERROR_ID_NOT_FOUND,
                undefined,
                undefined,
                false
            );
        }

        return this.prepareResult(_result, needRelevant, needAnother, needPhotos, addressWithRoute, addressWithoutRoute);
    }


    /*
     * Update result for each found placemark according with their db data
     *
     * @param {array of objects} data - placemarks data to be updated
     * @param {boolean} needRelative - should we add relative placemarks to result or not
     * @param {boolean} needAnother - should we add another placemarks to result related to category or not
     * @param {boolean/number} needPhotos - should we add either photos (needPhotos = true) or one photo (needPhotos = 1) to result or not
     * @param {boolean} addressWithRoute - should we add adddress with route to result or not
     * @param {boolean} addressWithoutRoute - should we add adddress without route to result or not
     *
     *
     * @return {array of objects} - updated placemarks result
     */
    prepareResult(data, needRelative = false, needAnother = false, needPhotos = false, addressWithRoute = true, addressWithoutRoute = true)
    {
        let _result = [];

        // Placemarks ids
        let _ids = [];
        for (let _index in data) {
            _ids.push(data[_index]['id']);
        }

        let _photos = (needPhotos === false) ? [] :
                BaseFunctions.fieldToProperty(
                    MapPhotosModel.getInstance(this.requestId).getPhotosByDataIds(_ids, false),
                    'map_data_id'
                );

        // For each placemark
        for (let _index in data) {

            let _placemark = data[_index];


            if (!BaseFunctions.isSet(_result[_placemark['id']])) {
                _result[_placemark['id']] = {

                    'id':_placemark['id'],
                    'x':_placemark['x'],
                    'y':_placemark['y'],
                    'comment':BaseFunctions.isSet(_placemark['comment']) ? _placemark['comment'] : null,
                    'comment_plain':BaseFunctions.isSet(_placemark['comment_plain']) ? _placemark['comment_plain'] : null,
                    'formatted_address': (addressWithoutRoute && BaseFunctions.isSet(_placemark['country_code'])) ?
                        this.prepareAddressLink(
                                _placemark['state_code'], _placemark['country_code'],
                                _placemark['administrative_area_level_2'],
                                _placemark['administrative_area_level_1'],
                                _placemark['country'],
                                _placemark['locality'])
                        :
                        null,
                    'formatted_address_with_route':(addressWithRoute && BaseFunctions.isSet(_placemark['country_code'])) ?
                        this.prepareAddressLinkWithRoute(
                                _placemark['state_code'],
                                _placemark['country_code'],
                                _placemark['administrative_area_level_2'],
                                _placemark['administrative_area_level_1'],
                                _placemark['country'],
                                _placemark['locality'],
                                _placemark['street'])
                        :
                        null,
                    'flag_url':BaseFunctions.isSet(_placemark['country_code']) ? BaseFunctions.get_flag_url(_placemark['country_code']) : null,
                    'country_code':BaseFunctions.isSet(_placemark['country_code']) ? _placemark['country_code'] : null,
                    'state_code':BaseFunctions.isSet(_placemark['state_code']) ? _placemark['state_code'] : null,
                    'street':BaseFunctions.isSet(_placemark['street']) ? _placemark['street'] : null,
                    'title':_placemark['title'],
                    'category':_placemark['category'],
                    'subcategories':_placemark['subcategories'],
                    'relevant_placemarks':Service.getInstance(this.requestId).whetherToShowRelevantPlacemarks() ? _placemark['relevant_placemarks'] : '',
                    'created':BaseFunctions.isSet(_placemark['created']) ? _placemark['created'] : null,
                    'modified':BaseFunctions.isSet(_placemark['modified']) ? _placemark['modified'] : null
                };

                // --> Prepare catalog_url
                let _catalogUrl;
                if (_result[_placemark['id']]['country_code']) {
                    if (Countries.getInstance(this.requestId).hasStates(_result[_placemark['id']]['country_code'])) {
                        _catalogUrl = _result[_placemark['id']]['country_code'] + '/' + _result[_placemark['id']]['state_code'] + '/' + _result[_placemark['id']]['id'];
                    } else {
                        _catalogUrl = _result[_placemark['id']]['country_code'] + '/' + _result[_placemark['id']]['id'];
                    }
                } else {
                    _catalogUrl = '';
                }
                _result[_placemark['id']]['catalog_url'] = _catalogUrl;
                // <-- Prepare catalog_url
            }

            // Add photos
            if (needPhotos !== false) {
                _result[_placemark['id']]['photos'] = [];
                // If the first photo - is a category photo
                if (Service.getInstance(this.requestId).whetherToAddCategoryPhotoAsFirstInPlacemarkView() === true) {

                    _result[_placemark['id']]['photos'].push({
                        'id':0,
                        'dir':Consts.SERVICE_IMGS_URL_CATEGORIES_PHOTOS,
                        'name':Categories.getInstance(this.requestId).getCategoryCode(_placemark['category']) + '.jpg',
                        'width':Service.getInstance(this.requestId).getCategoriesPhotoInitialWidth(),
                        'height':Service.getInstance(this.requestId).getCategoriesPhotoInitialHeight(),
                        'created':null,
                        'modified':null
                    });
                }

                // If only one photo is needed for placemark
                if (needPhotos === 1) {
                    if (!_result[_placemark['id']]['photos'].length) {
                        _result[_placemark['id']]['photos'].push({
                            'id':_photos[_placemark['id']][0]['id'],
                            'dir': this.getPhotoDir(_placemark['id'],_photos[_placemark['id']][0]['path']),
                            'name':_photos[_placemark['id']][0]['path'],
                            'width':_photos[_placemark['id']][0]['width'],
                            'height':_photos[_placemark['id']][0]['height'],
                            'created':_photos[_placemark['id']][0]['created'],
                            'modified':_photos[_placemark['id']][0]['modified']
                        });
                    }
                } else if (needPhotos === true) {
                    // If all photos is needed for placemark
                    for (let _index in _photos[_placemark['id']]) {
                        _result[_placemark['id']]['photos'].push({
                            'id':_photos[_placemark['id']][_index]['id'],
                            'dir': this.getPhotoDir(_placemark['id'],_photos[_placemark['id']][_index]['path']),
                            'name':_photos[_placemark['id']][_index]['path'],
                            'width':_photos[_placemark['id']][_index]['width'],
                            'height':_photos[_placemark['id']][_index]['height'],
                            'created':_photos[_placemark['id']][_index]['created'],
                            'modified':_photos[_placemark['id']][_index]['modified']
                        });
                    }
                }

                // If there are no photos - get default
                if (!_result[_placemark['id']]['photos'].length) {

                    _result[_placemark['id']]['photos']=[{
                        'id':0,
                        'dir':Consts.SERVICE_IMGS_URL_CATEGORIES_PHOTOS,
                        'name':Categories.getInstance(this.requestId).getCategoryCode(_placemark['category']) + '.jpg',
                        'width':Service.getInstance(this.requestId).getCategoriesPhotoInitialWidth(),
                        'height':Service.getInstance(this.requestId).getCategoriesPhotoInitialHeight(),
                        'created':BaseFunctions.isSet(_placemark['ph_created']) ? _placemark['ph_created'] : null,
                        'modified':BaseFunctions.isSet(_placemark['ph_modified']) ? _placemark['ph_modified'] : null
                    }];
                }
            }

            if (needRelative) {
                // Add relative placemarks
                if (_placemark['relevant_placemarks']) {
                    _result[_placemark['id']]['relevant_placemarks'] = {
                        data: {
                            'ident':'relevant',
                            'image_width':Config['dimentions'][this.getDeviceType()]['sublist_images']['width'],
                            'image_height':Config['dimentions'][this.getDeviceType()]['sublist_images']['height'],
                            'title':this.getText('relevant_placemarks/title/text')
                        },
                        placemarks: this.getPlacemarksSublist(_placemark['relevant_placemarks']),
                        use_titles: Service.getInstance(this.requestId).whetherToUseTitles()
                    }
                }
            }

            if (needAnother) {
                // Add another placemarks related to category
                let _anotherPlacemarksIds = this.getAnotherPlacemarksIdsByCategory(_placemark['category'], _placemark['id']);
                if (_anotherPlacemarksIds.length) {

                    _result[_placemark['id']]['another_placemarks'] = {
                        data: {
                            'ident':'another',
                            'image_width':Config['dimentions'][this.getDeviceType()]['sublist_images']['width'],
                            'image_height':Config['dimentions'][this.getDeviceType()]['sublist_images']['height'],
                            'title':this.getText('another_placemarks/title/text')
                        },
                        placemarks: this.getPlacemarksSublist(_anotherPlacemarksIds),
                        use_titles: Service.getInstance(this.requestId).whetherToUseTitles()
                    }
                } else {
                    _result[_placemark['id']]['another_placemarks'] = null;
                }
            }

            // Add placemark's categories
            _result[_placemark['id']]['categories_html'] = {'category':_placemark['category'],'subcategories':_placemark['subcategories']};

        }

        return BaseFunctions.resetArrayKeys(_result);
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
        return BaseFunctions.preparePhotoPath(id, name, '1_', true, true, this.getServiceName());
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
        if (Service.getInstance(this.requestId).whetherToShowCatalogPages() === true) {
            _addres = `<a onclick="window.dispatchEvent('${Consts.EVENT_GOTO}', {url:'/${Consts.CONTROLLER_NAME_CATALOG}/${countryCcode}'});">${country}</a>`;
        } else {
            _addres = country;
        }
        if (Countries.getInstance(this.requestId).hasStates(countryCcode)) {
            if (!stateCode) {
                this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'state_code [' + stateCode + ']', undefined, false);
            }
            if (stateCode !== Consts.UNDEFINED_VALUE) {
                if (Service.getInstance(this.requestId).whetherToShowCatalogPages() === true) {

                    _addres += ` &bull; <a onclick="window.dispatchEvent('${Consts.EVENT_GOTO}', {url:'/${Consts.CONTROLLER_NAME_CATALOG}/${countryCcode}/${stateCode}'});">${state}</a>`;
                } else {
                    _addres += " &bull; " + state;
                }

                if (Users.getInstance(this.requestId).isAdmin() && state){

                    _addres += " <a style='color:#f00;' target='_blank' href='/admin/translate_state?country_code="+countryCcode+"&state_code="+stateCode+"&name="+encodeURI(state)+"' title='перевод'>&equiv;</a>";
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

                    _addres += " <a style='color:#f00;' target='_blank' href='/admin/translate_locality?country_code="+countryCcode+"&state_code="+stateCode+"&name="+encodeURI(_locality)+"&locality_source="+encodeURI(_localitySource)+"' title='перевод'>&equiv;</a>";
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


    /*
     * Return full placemark data
     *
     * @param {integer} id - placemark id
     * @param {string} pageType - for 'catalog' or 'map' page
     *
     * @return {object}
     */
    getPlacemarkPageData(id, pageType = 'catalog') {
        return this.getPlacemarksDataByIds(
                [id],
                (pageType === 'catalog' ? false : true),
                true,
                undefined,
                Service.getInstance(this.requestId).whetherToShowRelevantPlacemarks(),
                Service.getInstance(this.requestId).whetherToShowAnotherPlacemarks(),
                true,
                true,
                false
            )[0]
    }


    /*
     * Return placemarks sublist data by their ids
     *
     * @param {integer/string/array} ids
     *
     * @return {array of objects}
     */
    getPlacemarksSublist(ids)
    {
        let _placemarksIds = [];
        if (BaseFunctions.isString(ids) && ids) {
            _placemarksIds = BaseFunctions.getArrayFromString(ids);
        } else if (BaseFunctions.isArray(ids) && ids.length) {
            _placemarksIds = ids;
        } else if (BaseFunctions.isInteger(ids) && ids) {
            _placemarksIds = [ids];
        } else {
            return [];
        }

        let _placemarks = this.getPlacemarksDataByIds(_placemarksIds, false, false, undefined, false, false, 1, false, true);

        for (let _index in _placemarks) {
            let _placemark = _placemarks[_index];

            let _state = '';
            if (_placemark['state_code'] && _placemark['state_code'] !== Consts.UNDEFINED_VALUE) {
                _state = '/' + _placemark['state_code'];
            }

            if (this.isMapPage()) {
                _placemarks[_index]['url'] = '/' + this.getControllerName() + '/' + _placemark['id'];
            } else {
                _placemarks[_index]['url'] = '/' + this.getControllerName() + '/' + _placemark['country_code'] + _state + '/' + _placemark['id'];
            }
        }
        return _placemarks ? _placemarks : [];
    }
}


Placemarks.instanceId = BaseFunctions.uniqueId();

module.exports = Placemarks;