/*
 * File src/modules/CategoryViewer.js
 * import CategoryViewer from 'src/modules/CategoryViewer';
 *
 * Works with categories
 */
import Consts from 'src/settings/Constants';
import Config from 'src/settings/Config';
import Service from 'src/modules/Service';
import Language from 'src/modules/Language';
import CommonBaseFunctions from 'src/../../server/common/functions/BaseFunctions';


let _config = Config.getServiceConfig();
let _categories = false;
let _isSetToMapApi = false;
let _categoryTitles = Config.getText(Language.getName());

/*
 * Set categories to map API
 */
function setToMapApi(){
    // Only once
    if (_isSetToMapApi === false) {
        _isSetToMapApi = true;
        let _categories = getCategories();
        for (let _index in _categories) {
            let _category = _categories[_index];

            window.ymaps.option.presetStorage.add('custom#' + _category.code, {
                iconLayout: 'default#image',
                iconImageHref: getCategoryImageUrl(_category.id),
                iconImageSize: [_config.dimentions.ballon.width, _config.dimentions.ballon.height],
                iconImageOffset: [_config.dimentions.ballon.top, _config.dimentions.ballon.left]
            });
            window.ymaps.option.presetStorage.add('custom#' + _category.code + '_selected', {
                iconLayout: 'default#image',
                iconImageHref: getCategoryImageUrl(_category.id, true),
                iconImageSize: [_config.dimentions.ballon.width, _config.dimentions.ballon.height],
                iconImageOffset: [_config.dimentions.ballon.top, _config.dimentions.ballon.left]
            });
        }
    }
}

/*
 * Return categories
 *
 * @return {array of objects}
 */
function getCategories(){
    if (_categories === false) {
        _categories = {};
        let _categoryCodes = Config.getServiceConfig().categories.category_codes;
        for (let _index in _categoryCodes) {
            let _categoryCode = _categoryCodes[_index];
            _categories[_categoryCode.id] = {
                code:_categoryCode.code,
                title:_categoryTitles['category/name/'+_categoryCode.id],
                id: _categoryCode.id
            }
        }
    }
    return _categories;
}

/*
 * Return url to category image
 *
 * @param {integer} categoryId
 * @param {boolean} selected
 *
 * @return {string}
 */
function getCategoryImageUrl(categoryId, selected = false) {
    if (typeof (getCategories()[categoryId]) !== 'undefined') {
        return Consts.SERVICE_IMGS_URL + Service.getName() + '/categories/' + getCategories()[categoryId].code + (selected ? '_selected' : '')+'.png';
    } else {
        return Consts.IMG_URL + 'other.png';
    }
}

/*
 * Return category title
 *
 * @param {integer} categoryId
 *
 * @return {string}
 */
function getCategoryTitle(categoryId) {
    return getCategories()[categoryId].title;
}

/*
 * Return baloon preset for map API
 *
 * @param {integer} categoryId
 * @param {boolean} isSelected - whether category must be selected or not
 *
 * @return {object}
 */
function getBaloonImage(categoryId, isSelected = false) {
    setToMapApi();
    if (typeof (categoryId) === 'undefined') {
        return {};
    }

    return {
        preset: 'custom#' + getCategories()[categoryId].code + (isSelected === true ? '_selected' : '')
    };
}

/*
 * Check - whether photo url is category image url or not
 *
 * @param {string} photoUrl
 *
 * @return {boolean}
 */
function isCategoryPhoto(photoUrl) {
    let _categories = getCategories();
    for (let _index in _categories) {
        if (photoUrl === (_categories[_index].code + '.jpg')) {
            return true;
        }
    }
    return false;
}


export default {
    isCategoryPhoto,
    getBaloonImage,
    getCategoryTitle,
    getCategoryImageUrl,
    getCategories,
    setToMapApi
}