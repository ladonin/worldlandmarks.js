/*
 * File server/src/components/Catalog.js
 * const Catalog = require('server/src/components/Catalog');
 *
 * Catalog component - compute catalog data
 */

const Component = require('server/src/core/parents/Component');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Consts = require('server/src/settings/Constants');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Countries = require('server/src/components/Countries');
const Accounts = require('server/src/components/Accounts');
const Service = require('server/src/core/Service');
const Users = require('server/src/core/Users');
const Cache = require('server/src/components/base/Cache');
const Categories = require('server/src/components/Categories');
const GeocodeCollectionModel = require('server/src/models/dbase/mysql/GeocodeCollection');
const MapDataModel = require('server/src/models/dbase/mysql/MapData');
const Config = require('server/src/settings/Config');
const CountryStatesCitiesTranslationsModel = require('server/src/models/dbase/mysql/CountryStatesCitiesTranslations');
const Placemarks = require('server/src/components/Placemarks');
const RequestsPool = require('server/src/core/RequestsPool');

class Catalog extends Component {

    constructor() {
        super();
    }




//ATTENTION - обратите внимание
//prepareAddress = > Placemarks.getInstance(this.requestId).prepareAddressLink
//prepareAddressWithRoute => Placemarks.getInstance(this.requestId).prepareAddressLinkWithRoute














//ATTENTION - обратите внимание
//getCategoryCode => Categories.getInstance(this.requestId).getCategoryCode
//get_category_dimentions => Service.getInstance(this.requestId).getBaloonDimentions()
//     get_category_dimentions()
//    {
//        return self::get_module(MY_MODULE_NAME_SERVICE)->get_baloon_dimentions();
//    }




//ATTENTION - обратите внимание
// get_subcategories => BaseFunctions.getArrayFromString
// getAnotherPlacemarksByCategory => MapDataModel.getInstance(this.requestId).getAnotherPlacemarksByCategory
// getAnotherPlacemarksIdsByCategory => Placemarks.getInstance(this.requestId).getAnotherPlacemarksIdsByCategory
//
//    public function get_subcategories($string)
//    {
//
//        return my_get_array_from_string($string);
//    }








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
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'country code [' + countryCode + ']', undefined, false);
        }

        return MapDataModel.getInstance(this.requestId).getCountryPlacemarks(countryCode, offset, limit, this.getLanguage(), false);
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
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'category id [' + categoryId + ']', undefined, false);
        }

        return MapDataModel.getInstance(this.requestId).getCategoryPlacemarks(categoryId, offset, limit, this.getLanguage(), false);
    }






//ATTENTION - обратите внимание
//process_country_data => processCountryPageData
 //getCategoryTitle => Categories.getInstance(this.requestId).getCategoryTitle
 //getCategory => Categories.getInstance(this.requestId).getCategory
 //getCategories => Categories.getInstance(this.requestId).getCategories
 //getCategoryId => Categories.getInstance(this.requestId).getCategoryId

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
            let _states = GeocodeCollectionModel.getInstance(this.requestId).getStates(_countryCode, this.getLanguage());

            // Translate state names
            for (let _index in _states) {
                let _state = _states[_index];
                _states[_index]['state'] = CountryStatesCitiesTranslationsModel.getInstance(this.requestId).getTranslationOfStateName(
                    this.getLanguage(),
                    _countryCode,
                    _state['state'], _state['state_code']);
            }
            return _states;
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
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'country code[' + countryCode + ']', undefined, false);
        }

        return GeocodeCollectionModel.getInstance(this.requestId).getPlacemarksCountInCountry(countryCode);
    }


//ATTENTION - обратите внимание
//get_placemarks_count => MapDataModel.getInstance(this.requestId).getPlacemarksCount()
//getPhotosData => getPlacemarksPhotosData
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
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'country code[' + countryCode + ']', undefined, false);
        }

        let _placemarksData = this.getPlacemarksData(countryCode, null, this.getLanguage(), true);
        return this.getPlacemarksPhotosData(_placemarksData['ids'], _placemarksData['data']);
    }


    /*
     * Get geodata and placemarks ids by country and state codes
     *
     * @param {string} countryCode
     * @param {string} stateCode
     * @param {string} language
     * @param {boolean} needResult - whether result is required
     *
     * @return {object} - geodata of each found placemark
     * {
     *      ids : [values:integer],
     *      data : [values:{}]
     *  }
     */
    getPlacemarksData(countryCode, stateCode, language, needResult) {

        let _placemarksData = GeocodeCollectionModel.getInstance(this.requestId).getPlacemarksData(countryCode, stateCode, language, needResult);

        let _result = {
            ids:[],
            data:{}
        };

        if (_placemarksData.length) {
            for (let _index in _placemarksData) {
                let _placemark = _placemarksData[_index];

                if ((_placemark['state']) && (_placemark['state_code']) && (_placemark['state'] !== Consts.UNDEFINED_VALUE) && (_placemark['state_code'] !== Consts.UNDEFINED_VALUE) && (_placemark['country_code'])) {
                    _placemark['state'] = CountryStatesCitiesTranslationsModel.getInstance(this.requestId).getTranslationOfStateName(language, _placemark['country_code'], _placemark['state'], _placemark['state_code']);
                }
                _placemark['country'] = Countries.getInstance(this.requestId).prepareCountryName(_placemark['country']);
                _placemark['has_states'] = _placemark['state_code'] !== Consts.UNDEFINED_VALUE ? 1 : 0;

                _result['ids'].push(_placemark['placemarks_id']);
                _result['data'][_placemark['placemarks_id']] = _placemark;
            }
        }

        return _result;
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
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'country code[' + countryCode + '], state code[' + stateCode + ']', undefined, false);
        }

        let _placemarksData = this.getPlacemarksData(countryCode, stateCode, this.getLanguage(), true);

        return this.getPlacemarksPhotosData(_placemarksData['ids'], _placemarksData['data']);
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
        if (_photosData.length) {

            for (let _index in _photosData) {
                let _photo = _photosData[_index];

                if (!placemarksData[_photo['id']]) {
                    this.error(ErrorCodes.ERROR_VARIABLE_EMPTY, message = '_placemarksData[\'data\'][_photo[\'id\']], _photo[\'id\'] =' + _photo['id']);
                }

                let _placemarkTitle = _photo['c_title'];
                delete(_photosData[_index]['c_title']);
                _photosResult.push({
                    photo: {
                        ..._photo,
                        ...{dir:Placemarks.getInstance(this.requestId).getPhotoDir(_photo['id'], _photo['ph_path'])}
                    },
                    placemark: {
                        ...placemarksData[_photo['id']],
                        ...{title:_placemarkTitle}
                    }
                });
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

        let _stateCode = this.getFromRequest(Consts.ACTION_NAME_STATE);

        if (Countries.getInstance(this.requestId).hasStates(_countryCode)) {
            return this.getPlacemarks(_countryCode, _stateCode, this.getLanguage());
        } else {
            this.error(
                ErrorCodes.ERROR_WRONG_ADRESS,
                'country code[' + _countryCode + '], state code[' + _stateCode + ']',
                undefined,
                false
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

        let _result = Placemarks.getInstance(this.requestId).getPlacemarksDataByIds(_ids, true, false, 'c_title ASC', false, false, 1);

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

            let _placemarks = MapDataModel.getInstance(this.requestId).getPlacemarksSeachcList(
                idStart,
                _category,
                _country,
                _state,
                _keywords,
                _limit,
                _language,
                false
            );

            for (let _index in _placemarks) {
                _ids.push(_placemarks[_index]['id']);
            }

        } else {
            let _placemarks = MapDataModel.getInstance(this.requestId).getLastPLacemarks (idStart, _limit);

            for (let _index in _placemarks) {
                _ids.push(_placemarks[_index]['id']);
            }

        }

        _result = _ids.length
            ? Placemarks.getInstance(this.requestId).getPlacemarksDataByIds(_ids, true, false, undefined, false, false, 1, false)
            : [];

        for (let _index in _result) {
            let _placemark = _result[_index];

            if (!_placemark['title']) {
                _result[_index]['title'] = this.getText('map/default_title_part/value') + ' ' + _placemark['id'];
            }

            _result[_index]['comment'] = BaseFunctions.getCroppedText(_placemark['comment_plain'], Config['restrictions']['max_cropped_text_length'], undefined, this);
            _result[_index]['comment_plain'] = null;
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
        let _countryCode = this.getFromRequest(Consts.COUNTRY_VAR_NAME, false);
        let _stateCode = this.getFromRequest(Consts.STATE_VAR_NAME, false);

        let _idPlacemark = parseInt(this.getFromRequest(Consts.ID_VAR_NAME, false));
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
                    'name' : CountryStatesCitiesTranslationsModel.getInstance(this.requestId).getTranslationOfStateName(_language, _countryCode, _result['state'], _result['state_code'])
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

            let _result = GeocodeCollectionModel.getInstance(this.requestId).getBreadcrumbsForStatePage(_countryCode, _stateCode, _language);

            if (Countries.getInstance(this.requestId).hasStates(_result['country_code'])) {
                _states = {
                    'url':'/' + _controllerName + '/' + _result['country_code'],
                    'name' : Countries.getInstance(this.requestId).prepareCountryName(_result['country'])
                };

                _placemarks = {
                    'url' : null,
                    'name': CountryStatesCitiesTranslationsModel.getInstance(this.requestId).getTranslationOfStateName(_language, _countryCode, _result['state'], _result['state_code'])
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

        if (_actionName === Consts.ACTION_NAME_SEARCH) {

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

Catalog.instanceId = BaseFunctions.uniqueId();
module.exports = Catalog;