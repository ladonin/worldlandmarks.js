/*
 * File application/express/components/Catalog.js
 * const Catalog = require('application/express/components/Catalog');
 *
 * Catalog component - compute catalog data
 */

const Component = require('application/express/core/parents/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Countries = require('application/express/components/Countries');
const Accounts = require('application/express/components/Accounts');
const Service = require('application/express/core/Service');
const Users = require('application/express/core/Users');
const Cache = require('application/express/components/base/Cache');
const Categories = require('application/express/components/Categories');
const Map = require('application/express/components/Map');
const GeocodeCollectionModel = require('application/express/models/dbase/mysql/GeocodeCollection');
const MapDataModel = require('application/express/models/dbase/mysql/MapData');
const Config = require('application/express/settings/Config');

class Catalog extends Component {

    constructor() {
        super();
    }




//ATTENTION - обратите внимание
//prepareAddress = > prepareAddressLink
//prepareAddressWithRoute => prepareAddressLinkWithRoute


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

        state = Countries.getInstance(this.requestId).getTranslationOfStateName(_language, countryCcode, state, stateCode);
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
     * Return all available categories data according with controller name
     *
     * @return {array of objects}
     */
    getCategories()
    {

        let _categories = Service.getInstance(this.requestId).getCategories();

        for (let _index in _categories) {
            _categories[_index]['title'] = this.getText('form/map_new_point/category/' + _categories[_index]['id']);
        }

        if (this.getControllerName() === Consts.CONTROLLER_NAME_ARTICLE){

            for (let _index in _categories) {
                _categories[_index]['title'] = Categories.getInstance(this.requestId).prepareNameForArticles(_categories[_index]['code'], _categories[_index]['title']);
            }
        }

        return _categories;
    }

    /*
     * Return category id by code
     *
     * @param {string} code - category code
     *
     * @return {integer}
     */
    getCategoryId(code)
    {
        let _categories = Service.getInstance(this.requestId).getCategories();

        for (let _index in _categories) {
            let _category = _categories[_index];

            if (_category['code'] === code) {
                return _category['id'];
            }
        }
        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'code[' + code + ']', log_type = undefined, writeToLog = false);
    }

    /*
     * Return category data by id
     *
     * @param {integer} id - category id
     *
     * @return {object}
     */
    getCategory(id)
    {
        let _categories = this.getCategories();

        for (let _index in _categories) {
            let _category = _categories[_index];

            if (_category['id'] === id) {
                return _category;
            }
        }
        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'id[' + id + ']', log_type = undefined, writeToLog = false);
    }


//ATTENTION - обратите внимание
//get_category_dimentions => Service.getInstance(this.requestId).getBaloonDimentions()
//     get_category_dimentions()
//    {
//        return self::get_module(MY_MODULE_NAME_SERVICE)->get_baloon_dimentions();
//    }






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
        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'id[' + id + ']', log_type = undefined, writeToLog = false);
    }

    /*
     * Return category title by id
     *
     * @param {integer} id - category id
     *
     * @return {string}
     */
    getCategoryTitle(id)
    {
        return this.getCategory(id)['title'];
    }

    /*
     * Return middle placemark data by id (without plain text, another and relevant placemarks)
     *
     * @param {integer} id - placemark id
     *
     * @return {object} - placemark data
     */
    getPointMiddleDataById(id)
    {
        return Map.getInstance(this.requestId).getPointsBigDataByIds([id], false)[id];
    }

//ATTENTION - обратите внимание
//get_subcategories => BaseFunctions.getArrayFromString
//getAnotherPlacemarksByCategory => getAnotherPlacemarksIdsByCategory
//
//    public function get_subcategories($string)
//    {
//
//        return my_get_array_from_string($string);
//    }



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
        let _placemarks = MapDataModel.getInstance(this.requestId).getAnotherPlacemarksIdsByCategory(categoryId, pointId);

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

        let _placemarks = Map.getInstance(this.requestId).getPointsBigDataByIds(_placemarksIds);

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

//ATTENTION - обратите внимание
//getPlacemarksCountByCategory => getPlacemarksCountByCategoryId
// getCountriesData => GeocodeCollectionModel.getInstance(this.requestId).getCountriesData();
    /*
     * Return placemarks count by category id
     *
     * @param {integer} id
     *
     * @return {integer}
     */
    getPlacemarksCountByCategory(id)
    {
        return MapDataModel.getInstance(this.requestId).getPlacemarksCountByCategory(id);
    }

    /*
     * Get placemarks of specified country
     *
     * @param {string} countryCode - country code
     * @param {integer} offset - selection offset
     * @param {integer} limit - selection limit
     *
     * @return {array of objects}
     */
    getCountryPlacemarks(countryCode, offset, limit)
    {
        if (!countryCode) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'country code [' + countryCode + ']', log_type = undefined, writeToLog = false);
        }

        return MapDataModel.getInstance(this.requestId).getCountryPlacemarks(countryCode, offset, limit, this.getLanguage(), needResult = false);
    }

    /*
     * Get placemarks of specified category
     *
     * @param {integer} categoryId - category id
     * @param {integer} offset - selection offset
     * @param {integer} limit - selection limit
     *
     * @return {array of objects}
     */
    getCategoryPlacemarks(categoryId, offset, limit)
    {
        if (BaseFunctions.isUndefined(categoryId)) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'category id [' + categoryId + ']', log_type = undefined, writeToLog = false);
        }

        return MapDataModel.getInstance(this.requestId).getCategoryPlacemarks(categoryId, offset, limit, this.getLanguage(), needResult = false);
    }






//ATTENTION - обратите внимание
//process_country_data => processCountryData


    /*
     * Return view data for countries page
     *
     * @return {array of objects}
     */
    processCountryPageData()
    {
        let _countryCode = Countries.getInstance(this.requestId).getCountryCodeFromRequest();

        // If country has states
        if (Countries.getInstance(this.requestId).hasStates(_countryCode)) {
            return this.getStates(_countryCode, this.getLanguage());
        } else {
            return null;
        }
    }



    /*
     * Return placemarks count in current country
     *
     * @param {string} countryCode - country code
     *
     * @return {integer}
     */
    getPlacemarksCountInCountry(countryCode)
    {

        if (!countryCode) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'country code[' + countryCode + ']', log_type = undefined, writeToLog = false);
        }

        return GeocodeCollectionModel.getInstance(this.requestId).getPlacemarksCountInCountry(countryCode);
    }



//ATTENTION - обратите внимание
//get_placemarks_count => MapDataModel.getInstance(this.requestId).getPlacemarksCount()
//getPhotosData => getPlacemarksPhotos
//getStateData => getStatePlacemarksByUrl
//getStates => GeocodeCollectionModel.getInstance(this.requestId).getStates()
//getPointsList => getPlacemarksList
    /*
     * Return photos data of current country
     *
     * @param {string} countryCode - country code
     *
     * @return {array of objects}
     */
    getCountryPhotosData(countryCode)
    {
        if (!countryCode) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'country code[' + countryCode + ']', log_type = undefined, writeToLog = false);
        }

        let _placemarksData = GeocodeCollectionModel.getInstance(this.requestId).getPlacemarksData(countryCode, null, this.getLanguage(), true);
        return this.getPhotosData(_placemarksData['ids'], _placemarksData['data']);
    }


    /*
     * Return photos data of current state
     *
     * @param {string} countryCode - country code
     * @param {string} stateCode - satte code
     *
     * @return {array of objects}
     */
    getStatePhotosData(countryCode, stateCode)
    {
        if (!countryCode || !stateCode) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'country code[' + countryCode + '], state code[' + stateCode + ']', log_type = undefined, writeToLog = false);
        }

        let _placemarksData = GeocodeCollectionModel.getInstance(this.requestId).getPlacemarksData(countryCode, stateCode, this.getLanguage(), true);

        return this.getPhotosData(_placemarksData['ids'], _placemarksData['data']);
    }





    /*
     * Extract photos data from placemarks data
     *
     * @param {array} placemarksIds - placemarks ids
     * @param {array of objects} placemarksData - placemarks data
     *
     * @return {array of objects} - photos data
     */
    getPlacemarksPhotosData(placemarksIds, placemarksData)
    {
        let _photosData = MapDataModel.getInstance(this.requestId).getPlacemarksPhotos(placemarksIds);

        let _photosResult = [];
        if (_photosResult.length) {

            for (let _index in _photosData) {
                let _photo = _photosData[_index];

                if (my_array_is_empty(placemarksData[_photo['c_id']])) {
                    this.error(ErrorCodes.ERROR_VARIABLE_EMPTY, message = '_placemarksData[\'data\'][_photo[\'c_id\']], _photo[\'c_id\'] =' + _photo['c_id']);
                }

                let _placemarkTitle = _photo['c_title'];
                delete(_photosData[_index]['c_title']);

                _photosResult[_photo['ph_id']]['photo'] = _photo;
                _photosResult[_photo['ph_id']]['photo']['dir'] = Map.getInstance(this.requestId).getPhotoDir(_photo['c_id'], _photo['ph_path']);
                _photosResult[_photo['ph_id']]['placemark'] = placemarksData[_photo['c_id']];
                _photosResult[_photo['ph_id']]['placemark']['title'] = _placemarkTitle;
            }
        }

        return _photosResult;
    }




    /*
     * Return placemarks data of current state
     *
     * @return {array of objects}
     */
    getStatePlacemarksByUrl()
    {
        let _countryCode = Countries.getInstance(this.requestId).getCountryCodeFromRequest();

        let _stateCode = this.getFromRequest(Consts.ACTION_NAME_STATE, required = true);

        if (Countries.getInstance(this.requestId).hasStates(_countryCode)) {
            return this.getPlacemarks(_countryCode, _stateCode, this.getLanguage());
        } else {
            this.error(
                ErrorCodes.ERROR_WRONG_ADRESS,
                message = 'country code[' + _countryCode + '], state code[' + _stateCode + ']',
                log_type = undefined,
                writeToLog = false
            );
        }
    }

    /*
     * Return placemarks data of current coutry and, if set, state in current language
     *
     * @param {string} countryCode
     * @param {string} stateCode
     * @param {string} language
     *
     * @return {array of objects}
     */
    getPlacemarks(countryCode, stateCode, language)
    {
        let _placemarksIds = GeocodeCollectionModel.getInstance(this.requestId).getPlacemarksIds(countryCode, stateCode, language);
        let _ids = [];

        for (let _index in _placemarksIds) {
            _ids.push(_placemarksIds[_index]['placemark_id']);
        }

        let _result = Map.getInstance(this.requestId).getPointsBigDataByIds(_ids, false, 'c_title ASC');

        for (let _index in _result) {

            let _placemark = _result[_index];

            if (!_placemark['title']) {
                _result[_index]['title'] = this.getText('map/default_title_part/value') + ' ' + _placemark['id'];
            }

            _result[_index]['comment'] = BaseFunctions.getCroppedText(_placemark['comment'], Config['restrictions']['max_cropped_text_length'], undefined, this);
        }
        return _result;
    }


    /*
     * Return limited collection of placemarks
     *
     * @param {integer} idStart - placemark id from which collection will be started
     *
     * @return {array of objects}
     */
    getPlacemarksList(idStart = 0)
    {

        let _result;
        let _ids = [];

        let _language = this.getLanguage();
        let _limit = Config['restrictions']['max_rows_per_scroll_load'];
        let _requestFormData = this.getRequestFormData();

        // If search page
        if (_requestFormData['isSearch']) {

            let _category = _requestFormData['category'];
            let _country = _requestFormData['country'];
            let _state = _requestFormData['state'];
            let _keywords = _requestFormData['keywords'];

            let _placemarks = MapDataModel.getInstance(this.requestId).getPlacemarksSeacrhList(
                idStart,
                _category,
                _country = '',
                _state = '',
                _keywords = '',
                _limit,
                _language,
                needResult = false
            );

            for (let _index in _placemarks) {
                _ids.push(_placemarks[_index]['id']);
            }

        } else {
            let _placemarks = MapDataModel.getInstance(this.requestId).getLastPLacemarks (idStart, limit);

            for (let _index in _placemarks) {
                _ids.push(_placemarks[_index]['id']);
            }

        }

        _result = Map.getInstance(this.requestId).getPointsBigDataByIds(_ids, false);

        for (let _index in _result) {
            let _placemark = _result[_index];

            if (!_placemark['title']) {
                _result[_index]['title'] = this.getText('map/default_title_part/value') + ' ' + _placemark['id'];
            }

            _result[_index]['comment'] = BaseFunctions.getCroppedText(_placemark['comment'], Config['restrictions']['max_cropped_text_length'], undefined, this);
        }
        return _result;
    }


    /*
     * Return breadcrumbs data according with page
     *
     * @return {array of objects}
     */
    getBreadcrumbsData()
    {
        let _countryCode = this.getFromRequest(Consts.ACTION_NAME_COUNTRY, false);
        let _stateCode = this.getFromRequest(Consts.ACTION_NAME_STATE, false);
        let _idPlacemark = BaseFunctions.toInt(this.getFromRequest(Consts.ID_VAR_NAME, false));
        let _language = this.getLanguage();

        let _return = [];

        let _controllerName = this.getControllerName();
        let _countriesUrl = '/' + _controllerName;
        let _countriesName = this.getText('breadcrumbs/' + _controllerName + '/text');

        let _countries = {
            'url':_countriesUrl,
            'name': _countriesName,
        };

        let _placemarks;
        let _states;
        let _actionName = this.getActionName();

        // In this case breadcrumbs are not showed
        if ((_controllerName === Consts.CONTROLLER_NAME_CATALOG) &&
                ((_actionName === Consts.ACTION_NAME_SITEMAP_COUNTRIES) || (_actionName === Consts.ACTION_NAME_SITEMAP_CATEGORIES))) {
            return _return;
        }

        if (_idPlacemark) {

            let _result = GeocodeCollectionModel.getInstance(this.requestId).getBreadcrumbsForPlacemarkPage(_idPlacemark, _language);
            _states = {
                'url':'/' + _controllerName + '/' + _result['country_code'],
                'name' : Countries.getInstance(this.requestId).prepareCountryName(_result['country'])
            };

            if (Countries.getInstance(this.requestId).hasStates(_result['country_code'])) {
                _placemarks = {
                    'url' : '/' + _controllerName + '/' + _result['country_code'] + '/' + _result['state_code'],
                    'name' : Countries.getInstance(this.requestId).getTranslationOfStateName(_language, _countryCode, _result['state'], _result['state_code'])
                };
            }

            // In countries page breadcrumbs will be empty

            // Return to countries list page
            _return[0] = _countries;

            // Return to country states list page or placemarks list if there are no states in country
            _return[1] = _states;

            if (_placemarks) {
                // Return to placemarks list page
                // If there are no states in country element 1 in array will lead to placemarks list page
                _return[2] = _placemarks;
            }
            return _return;
        }

        if (_stateCode) {

            let _result = GeocodeCollectionModel.getInstance(this.requestId).getBreadcrumbsForPlacemarkPage(_countryCode, _stateCode, _language);

            if (Countries.getInstance(this.requestId).hasStates(_result['country_code'])) {
                _states = {
                    'url':'/' + _controllerName + '/' + _result['country_code'],
                    'name' : Countries.getInstance(this.requestId).prepareCountryName(_result['country'])
                };

                _placemarks = {
                    'url' : null,
                    'name': Countries.getInstance(this.requestId).getTranslationOfStateName(_language, _countryCode, _result['state'], _result['state_code'])
                };
            } else {
                _states = {
                    'url' : null,
                    'name' : Countries.getInstance(this.requestId).prepareCountryName(_result['country'])
                };
            }

            // Return to countries list page
            _return[0] = _countries;

            // Return to country states list page or just country name without url
            _return[1] = _states;

            if (_placemarks) {
                // State name
                _return[2] = _placemarks;
            }

            return _return;
        }

        if (_countryCode) {

            let _result = GeocodeCollectionModel.getInstance(this.requestId).getBreadcrumbsForCountryPage(_countryCode, _language);

            _states = {
                'url' : null,
                'name' : Countries.getInstance(this.requestId).prepareCountryName(_result['country'])
            };

            // Return to countries list page
            _return[0] = _countries;

            // State name
            _return[1] = _states; // возврат в список штатов (или меток, если штатов нет в стране)
            return _return;
        }

        if (_actionName === Consts.CONTROLLER_NAME_SEARCH) {

            _return[0] = _countries;

            _return[1] = {
                'url' : null,
                'name' : this.getText('site/title/catalog/search/title')
            };
            return _return;
        }

        return _return;
    }


//ATTENTION - обратите внимание
/*
    getPlacemarksTitle()
    {
        let _countryCode = this.getFromRequest(Consts.ACTION_NAME_COUNTRY, false);
        let _stateCode = this.getFromRequest(Consts.ACTION_NAME_STATE, false);

        if (_stateCode) {
            return Countries.getInstance(this.requestId).getStateNameFromRequest();
        }

        if (_countryCode) {
            return Countries.getInstance(this.requestId).getCountryNameFromRequest();
        }
    }
*/


}

Catalog.instanceId = BaseFunctions.unique_id();
module.exports = Catalog;