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
const SublistBlock = require('application/express/blocks/placemark/Sublist');
const Config = require('application/express/settings/Config');
const CaregoriesViewerBlock = require('application/express/blocks/category/CaregoriesViewer');
const Categories = require('application/express/components/Categories');
const MapPhotosModel = require('application/express/models/dbase/mysql/MapPhotos');

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
     * @param {boolean} needText - whether placemark description (main text with html) is necessary
     * @param {string} order - fetch order
     * @param {boolean} needRelevant - whether 'relevant' placemarks are necessary
     * @param {boolean} needAnother - whether 'another' placemarks are necessary
     * @param {boolean/number} needPhotos - should we add either photos (needPhotos = true) or one photo (needPhotos = 1) to result or not
     *
     * @return {object} - placemark data
     */
    getPlacemarksDataByIds(ids, needPlainText = true, needText = true, order = null, needRelevant = false, needAnother = false, needPhotos = false)
    {
        if (!ids) {
            return [];
        }

        let _language = this.getLanguage();

        let _result = MapDataModel.getInstance(this.requestId).getPointsDataByIds(ids, _language, order, needPlainText, needText, true);

        return this.prepareResult(_result, needRelevant, needAnother, needPhotos);
    }


//ATTENTION - обратите внимание
//getPlacemarksShortDataByIds => getPlacemarksDataByIds(settings)
//getPlacemarksBigDataByIds => getPlacemarksDataByIds(settings)
    /*
     * Get a short placemarks information by their ids
     *
     * @param {array} ids - placemarks ids
     * @param {boolean} needComment - whether placemark description required
     *
     * @return {array of objects}
     */
//    getPlacemarksShortDataByIds(ids, needComment = false)
//    {
//        if (!ids.length) {
//            return [];
//        }
//
//        let _result = MapDataModel.getInstance(this.requestId).getPointsShortDataByIds(ids, needComment);
//
//        return this.prepareResult(_result);
//    }













    /*
     * Update result for each found placemark according with their db data
     *
     * @param {array of objects} data - placemarks data to be updated
     * @param {boolean} needRelative - should we add relative placemarks to result or not
     * @param {boolean} needAnother - should we add another placemarks to result related to category or not
     * @param {boolean/number} needPhotos - should we add either photos (needPhotos = true) or one photo (needPhotos = 1) to result or not
     *
     * @return {array of objects} - updated placemarks result
     */
    prepareResult(data, needRelative = false, needAnother = false, needPhotos = false)
    {
        let _result = [];

        // Placemarks ids
        let _ids = [];
        for (let _index in data) {
            _ids.push(data[_index]['c_id']);
        }

        let _photos = (needPhotos === false) ? [] :
                BaseFunctions.fieldToProperty(
                    MapPhotosModel.getInstance(this.requestId).getPhotosByDataIds(_ids, false),
                    'map_data_id'
                );


        // For each placemark
        for (let _index in data) {

            let _placemark = data[_index];


            if (!BaseFunctions.isSet(_result[_placemark['c_id']])) {
                _result[_placemark['c_id']] = {

                    'id':_placemark['c_id'],
                    'x':_placemark['c_x'],
                    'y':_placemark['c_y'],
                    'comment':BaseFunctions.isSet(_placemark['c_comment']) ? _placemark['c_comment'] : null,
                    'comment_plain':BaseFunctions.isSet(_placemark['c_comment_plain']) ? _placemark['c_comment_plain'] : null,
                    'formatted_address':BaseFunctions.isSet(_placemark['g_country_code']) ?
                        this.prepareAddressLink(
                                _placemark['g_state_code'], _placemark['g_country_code'],
                                _placemark['g_administrative_area_level_2'],
                                _placemark['g_administrative_area_level_1'],
                                _placemark['g_country'],
                                _placemark['g_locality'])
                        :
                        null,
                    'formatted_address_with_route':BaseFunctions.isSet(_placemark['g_country_code']) ?
                        this.prepareAddressLinkWithRoute(
                                _placemark['g_state_code'],
                                _placemark['g_country_code'],
                                _placemark['g_administrative_area_level_2'],
                                _placemark['g_administrative_area_level_1'],
                                _placemark['g_country'],
                                _placemark['g_locality'],
                                _placemark['g_street'])
                        :
                        null,
                    'flag_url':BaseFunctions.isSet(_placemark['g_country_code']) ? BaseFunctions.get_flag_url(_placemark['g_country_code']) : null,
                    'country_code':BaseFunctions.isSet(_placemark['g_country_code']) ? _placemark['g_country_code'] : null,
                    'state_code':BaseFunctions.isSet(_placemark['g_state_code']) ? _placemark['g_state_code'] : null,
                    'street':BaseFunctions.isSet(_placemark['g_street']) ? _placemark['g_street'] : null,
                    'title':_placemark['c_title'],
                    'category':_placemark['c_category'],
                    'subcategories':_placemark['c_subcategories'],
                    'relevant_placemarks':Service.getInstance(this.requestId).whetherShowRelevantPlacemarks() ? _placemark['c_relevant_placemarks'] : '',
                    'created':BaseFunctions.isSet(_placemark['c_created']) ? _placemark['c_created'] : null,
                    'modified':BaseFunctions.isSet(_placemark['c_modified']) ? _placemark['c_modified'] : null
                };

                // --> Prepare catalog_url
                let _catalogUrl;
                if (_result[_placemark['c_id']]['country_code']) {
                    if (Countries.getInstance(this.requestId).hasStates(_result[_placemark['c_id']]['country_code'])) {
                        _catalogUrl = _result[_placemark['c_id']]['country_code'] + '/' + _result[_placemark['c_id']]['state_code'] + '/' + _result[_placemark['c_id']]['id'];
                    } else {
                        _catalogUrl = _result[_placemark['c_id']]['country_code'] + '/' + _result[_placemark['c_id']]['id'];
                    }
                } else {
                    _catalogUrl = '';
                }
                _result[_placemark['c_id']]['catalog_url'] = _catalogUrl;
                // <-- Prepare catalog_url
            }

            // Add photos
            if (needPhotos !== false) {
                _result[_placemark['c_id']]['photos'] = [];
                // If the first photo - is a category photo
                if (Service.getInstance(this.requestId).whetherAddCategoryPhotoAsFirstInPlacemarkView() === true) {

                    _result[_placemark['c_id']]['photos'].push({
                        'id':0,
                        'dir':Consts.SERVICE_IMGS_URL_CATEGORIES_PHOTOS,
                        'name':Categories.getInstance(this.requestId).getCategoryCode(_placemark['c_category']) + '.jpg',
                        'width':Service.getInstance(this.requestId).getCategoriesPhotoInitialWidth(),
                        'height':Service.getInstance(this.requestId).getCategoriesPhotoInitialHeight(),
                        'created':null,
                        'modified':null
                    });
                }

                // If only one photo is needed for placemark
                if (needPhotos === 1) {
                    if (!_result[_placemark['c_id']]['photos'].length) {
                        _result[_placemark['c_id']]['photos'].push({
                            'id':_photos[_placemark['c_id']][0]['id'],
                            'dir': this.getPhotoDir(_placemark['c_id'],_photos[_placemark['c_id']][0]['path']),
                            'name':_photos[_placemark['c_id']][0]['path'],
                            'width':_photos[_placemark['c_id']][0]['width'],
                            'height':_photos[_placemark['c_id']][0]['height'],
                            'created':_photos[_placemark['c_id']][0]['created'],
                            'modified':_photos[_placemark['c_id']][0]['modified']
                        });
                    }
                } else if (needPhotos === true) {
                    // If all photos is needed for placemark
                    for (let _index in _photos[_placemark['c_id']]) {
                        _result[_placemark['c_id']]['photos'].push({
                            'id':_photos[_placemark['c_id']][_index]['id'],
                            'dir': this.getPhotoDir(_placemark['c_id'],_photos[_placemark['c_id']][_index]['path']),
                            'name':_photos[_placemark['c_id']][_index]['path'],
                            'width':_photos[_placemark['c_id']][_index]['width'],
                            'height':_photos[_placemark['c_id']][_index]['height'],
                            'created':_photos[_placemark['c_id']][_index]['created'],
                            'modified':_photos[_placemark['c_id']][_index]['modified']
                        });
                    }
                }

                // If there are no photos - get default
                if (!_result[_placemark['c_id']]['photos'].length) {

                    _result[_placemark['c_id']]['photos']=[{
                        'id':0,
                        'dir':Consts.SERVICE_IMGS_URL_CATEGORIES_PHOTOS,
                        'name':Categories.getInstance(this.requestId).getCategoryCode(_placemark['c_category']) + '.jpg',
                        'width':Service.getInstance(this.requestId).getCategoriesPhotoInitialWidth(),
                        'height':Service.getInstance(this.requestId).getCategoriesPhotoInitialHeight(),
                        'created':BaseFunctions.isSet(_placemark['ph_created']) ? _placemark['ph_created'] : null,
                        'modified':BaseFunctions.isSet(_placemark['ph_modified']) ? _placemark['ph_modified'] : null
                    }];
                }
            }

            if (needRelative) {
                // Add relative placemarks
                if (_placemark['c_relevant_placemarks']) {
                    _result[_placemark['c_id']]['relevant_placemarks'] = SublistBlock.getInstance(this.requestId).render({
                        'ident':'relevant',
                        'ids':_placemark['c_relevant_placemarks'],
                        'image_width':Config['dimentions'][this.getDeviceType()]['sublist_images']['width'],
                        'image_height':Config['dimentions'][this.getDeviceType()]['sublist_images']['height'],
                        'title':this.getText('relevant_placemarks/title/text')
                    });
                }
            }

            if (needAnother) {
                // Add another placemarks related to category
                let _anotherPlacemarksIds = this.getAnotherPlacemarksIdsByCategory(_placemark['c_category'], _placemark['c_id']);
                if (_anotherPlacemarksIds.length) {

                    _result[_placemark['c_id']]['another_placemarks'] = SublistBlock.getInstance(this.requestId).render({
                        'ident':'another',
                        'ids':_anotherPlacemarksIds,
                        'image_width':Config['dimentions'][this.getDeviceType()]['sublist_images']['width'],
                        'image_height':Config['dimentions'][this.getDeviceType()]['sublist_images']['height'],
                        'title':this.getText('another_placemarks/title/text')
                    });

                } else {
                    _result[_placemark['c_id']]['another_placemarks'] = null;
                }
            }

            // Add placemark's categories
            _result[_placemark['c_id']]['categories_html'] = CaregoriesViewerBlock.getInstance(this.requestId).render({'category':_placemark['c_category'],'subcategories':_placemark['c_subcategories']});

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
        if (Service.getInstance(this.requestId).whetherShowCatalogPages() === true) {
            _addres = `<a onclick="window.dispatchEvent('${Consts.EVENT_GOTO}', {url:'/${Consts.CONTROLLER_NAME_CATALOG}/${countryCcode}'});">${country}</a>`;
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
                    _addres += ` &bull; <a onclick="window.dispatchEvent('${Consts.EVENT_GOTO}', {url:'/${Consts.CONTROLLER_NAME_CATALOG}/${countryCcode}/${stateCode}'});">${state}</a>`;
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