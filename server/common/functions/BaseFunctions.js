/*
 * File server/common/functions/BaseFunctions.js
 * const CommonBaseFunctions = require('server/common/functions/BaseFunctions');
 * import CommonBaseFunctions from 'src/../../server/common/functions/BaseFunctions';
 *
 * Common base functions collection
 */

const LodashLang = require('lodash/lang');

/*
 * Prepare array of objects
 *  For example:
 *  [
 *      {id:'id1', title:'title1'},
 *      {id:'id2', title:'title2'},
 *      {id:'id2', title:'title3'}
 *  ]
 *  either will become (with oneObjectOnProperty === false)
 *  {
 *      'id1':[
 *          {id:'id1', title:'title1'}
 *      ],
 *      'id2':[
 *          {id:'id2', title:'title2'},
 *          {id:'id2', title:'title3'},
 *      ]
 *  }
 *  or (with oneObjectOnProperty === true) - !only for unique 'fieldName' values
 *  {
 *      'id1': {id:'id1', title:'title1'},
 *      'id2': {id:'id2', title:'title3'},
 *  }
 * @param {array of objects} data
 * @param {boolean} oneObjectOnProperty - either a new property will contain array of objects or one object
 *
 * @return {object}
 */
function fieldToProperty(data, fieldName, oneObjectOnProperty = false)
{
    let _result = {};
    for (let _index in data) {
        if ((!_result[data[_index][fieldName]]) && oneObjectOnProperty === false) {
            _result[data[_index][fieldName]] = [];
        }
        if (oneObjectOnProperty === false) {
           _result[data[_index][fieldName]].push(data[_index]);
        } else {
            _result[data[_index][fieldName]] = data[_index];
        }
    }
    return _result;
}

/*
 * Check whether word exists in string list
 *  For example:
 *  findWord('val1', 'val1 val2 val3') => true
 *  findWord('val', 'val1 val2 val3') => false
 *
 * @param {string} word
 * @param {string} str
 *
 * @return {boolean}
 */
function findWord(word, str)
{
  return str.split(' ').some(function(w){return w === word})
}



/*
 * Remove word in string globally
 *  For example:
 *  removeWord('val1', 'val1 val2 val1 val3') => 'val2 val3'
 *
 * @param {string} word
 * @param {string} str
 * @param {string} separator (' ', ',', ';' etc)
 *
 * @return {string} - prepared string
 */
function removeWord(word, str, separator = ' ')
{
    let _preparedArray = str.split(separator).map(function(name) {
        return name === word ? '' : name;
    });
    let _resultArray = [];
    for (let _index in _preparedArray) {
        if (_preparedArray[_index]) {
            _resultArray.push(_preparedArray[_index]);
        }
    }

    return _resultArray.join(separator);
}

/*
 * Deep comparing objects on properties equality
 *
 * @param {object} obj1
 * @param {object} obj2
 *
 * @return {boolean}
 */
function areObjectsEqual (obj1, obj2){
   return JSON.stringify(obj1)===JSON.stringify(obj2);
}



/*
 * Crop image using css
 *
 * @param {string} path - image path
 * @param {integer} widthOriginal - image original width
 * @param {integer} heightOriginal - image original height
 * @param {integer} widthNew - new cropped width
 * @param {integer} heightNew - new cropped height
 * @param {boolean} html - whether to return object or html
 *
 * @return {string/object}
 */
function viewCroppedPhoto(path, widthOriginal, heightOriginal, widthNew, heightNew, html = true) {

    let _left = 0, _top = 0, _width = 0, _height = 0;

    let _diffOriginal = widthOriginal / heightOriginal;
    let _diffNew = widthNew / heightNew;

    if (_diffOriginal > _diffNew) {//если картинка шире чем блок
        //значит кропаем по горизонтали
        _height = heightNew;
        _width = _height * _diffOriginal;
        _left = (widthNew - _width) / 2;

    } else if (_diffOriginal < _diffNew) {//если картинка уже чем блок
        //значит кропаем по вертикали
        _width = widthNew;
        _height = _width / _diffOriginal;
        _top = (heightNew - _height) / 2;

    } else {
        _width = widthNew;
        _height = heightNew;
    }
    let _result;
    if (html === true) {
        _result = "<div class='cropped_image_div' style='width:" + widthNew + "px; height:" + heightNew + "px; overflow:hidden'>";
        _result += "<img src='"+ path + "' style='width:" + _width + "px; height:" + _height + "px; position:relative; top:" + _top + "px; left:" + _left + "px;'/>";
        _result += '</div>';
    } else {
        _result = {
            width:_width,
            height:_height,
            top:_top,
            left:_left
        };
    }
    return _result;
}

function clone(obj) {
    return LodashLang.cloneDeep(obj);
}


module.exports = {
    clone,
    viewCroppedPhoto,
    areObjectsEqual,
    fieldToProperty,
    findWord,
    removeWord
};