/*
 * File src/app/redux/reducers/Reducers.js
 * import * as reducers from 'src/app/redux/reducers/Reducers';
 */

import { combineReducers } from 'redux';
import Constants from 'src/settings/Constants';
import CommonBaseFunctions from 'src/../../server/common/functions/BaseFunctions';

function staticData(state = {}, action)
{
    switch (action.type) {
        case Constants.UPDATE_PAGE:
            return Object.assign({}, state, action.data[Constants.STATIC_DATA]);

        default:
            return state;
    }
}


function backgroundData(state = {}, action)
{
    switch (action.type) {
        case Constants.UPDATE_PAGE:
            return Object.assign({}, state, action.data[Constants.BACKGROUND_DATA]);

        case Constants.REMOVE_BACKGROUND_DATA:
            let newState = Object.assign({}, state);
            delete newState[action.prop]
            return newState;

        case Constants.CLEAR_BACKGROUND_DATA:
            return {};

        default:
            return state;
    }
}


function actionData(state = {}, action)
{
    switch (action.type) {
        case Constants.UPDATE_PAGE:
            return Object.assign({}, state, action.data[Constants.ACTION_DATA]);

        case Constants.CLEAR_ACTION_DATA:
            return {};

        default:
            return state;
    }
}


function styleData(state = {}, action)
{
    switch (action.type) {
        case Constants.UPDATE_STYLE_DATA:

            /*
             * Here we change the main tag attributes - class and innerHTML
             *
             * htmlSelector:{
             *     ending: integer/string
             *     class: string,
             *     style: {
             *         marginTop: 10px,
             *         padding: 10px
             *     },
             *     html: {
             *         content: string,
             *         action: string
             *     },
             *     arbitrary:object
             * }
             *
             * or
             *
             * htmlSelector:{
             *     class: string,
             *     html: string
             * }
             *
             * Description:
             *
             * 'htmlSelector' - '#foo', '.bar', 'div' etc
             *
             * 'class':
             *      values:
             *         +className - add new class
             *         -className - remove existed class
             *         =className - new class attribute value
             *         =className1,className2,className3 - new class attribute value will be className1 className2 className3
             *  'style':
             *      {option:value}:
             *          'option' - css style name
             *          'value' - css style value
             *
             *  'html':
             *      {content, action}:
             *          'content' - html text to be added or inserted into html tag
             *          'action' - {=/+} optional parameter
             *              values:
             *                  = - replace/insert a new value
             *                  + - add to end a new value
             *              by default '='
             *      Note: {content:'<b>foo</b>', action:'='} equals to {content:'<b>foo</b>'}
             *
             *      or
             *
             *      string value - replace/insert a new value
             *
             * 'ending':
             *      When you want to specify dynamical selector, for example: ['#id' + value]
             *
             *      use 'ending' option:
             *          htmlSelectorStaticPart:{
             *              ending: integer/string,
             *              ...
             *          }
             *
             *      For example:
             *          '#myid_':{
             *              ending: 3,
             *              ...
             *          }
             *      means selector #myid_3
             *
             *  'arbitrary':
             *      Arbitary data - you put here all what you want
             *
             *      For example:
             *      '#categories_list':{
             *          arbitrary:{number:4}
             *      }
             *      means that fourth element must be processed anyway in block list with id="categories_list"
             *
             *
             *  Examples:
             *  {
             *      '#myid_1':{
             *          class:'+className2 -className1 +className3 -className4',
             *          html: {
             *              content:'<b>html text</b> simple text',
             *              action: '='
             *          }
             *      },
             *      '#myid_2':{
             *          class:'=className1,className2,className3',
             *          html: {
             *              content:'<b>html text2</b> simple text2'
             *          }
             *      },
             *      '#myid_3':{
             *          html: '<b>html text3</b> simple text3',
             *          style: {marginTop:10px'}
             *      },
             *      '.turned_':{
             *          ending: 'on'
             *          html: '<b>html text4</b> simple text4'
             *      },
             *      '#categories_list':{
             *          arbitrary:{number:4}
             *      }
             *  }
             *
             */
            let _newState = CommonBaseFunctions.clone(state);

            // For each tag selectors
            for (let _selectorName in action.data) {
                let _selectorData = action.data[_selectorName];
                let _stateSelectorData = state[_selectorName] ? state[_selectorName] : false;
                // If state does not have this selector yet
                if (_stateSelectorData === false) {
                    _newState[_selectorName] = {};
                }

                // For each tag attributes of current selector
                for (let _attributeName in _selectorData) {
                    let _attributeData = _selectorData[_attributeName];
                    let _stateAttributeData = _stateSelectorData
                        ? (_stateSelectorData[_attributeName] ? _stateSelectorData[_attributeName] : false)
                        : false;

                    // If selector in state does not have this attribute yet
                    if (_stateAttributeData === false) {

                        if (_attributeName === "style") {
                            _newState[_selectorName][_attributeName] = {};
                        } else {
                            _newState[_selectorName][_attributeName] = '';
                        }
                    }

                    if (_attributeName === 'ending') {
                        _newState[_selectorName][_attributeName] = _attributeData;
                    } else if (_attributeName === 'class') {

                        let _classesData = _attributeData.split(' ');
                        for (let _index in _classesData) {

                            let _classData = _classesData[_index];
                            let _action = _classData.substr(0,1);
                            let _value = _classData.slice(1);

                            let _classValueExistsInState = _stateAttributeData
                                ? (CommonBaseFunctions.findWord(_value, _stateAttributeData))
                                : false;

                            if (_action === '+') {
                                // Add a new class value if not exists
                                // For example: <div class = "class1 class2 newclass"/>
                                if (!_classValueExistsInState) {
                                    _newState[_selectorName][_attributeName] += ' ' + _value;
                                }
                            } else if (_action === '-') {
                                // Remove class value if exists
                                if (_classValueExistsInState) {
                                    _newState[_selectorName][_attributeName] = CommonBaseFunctions.removeWord(_value, _newState[_selectorName][_attributeName]);
                                }

                            } else if (_action === '=') {
                                // Replace current class values with a new value
                                _newState[_selectorName][_attributeName] = _value.replace(/,/g,' ');
                            }
                        }
                    }
                    else if (_attributeName === 'html') {

                        if (_attributeData.content) {
                            let _html = _attributeData.content;
                            let _action = _attributeData.action ? _attributeData.action : '=';

                            // Replace content
                            if (_action === '=') {
                                _newState[_selectorName][_attributeName] = _html;
                            } else if (_action === '+') {
                                _newState[_selectorName][_attributeName] += _html;
                            }
                        } else {
                            // Only replace content
                            _newState[_selectorName][_attributeName] = _attributeData;
                        }
                    } else if (_attributeName === "arbitrary") {
                        _newState[_selectorName][_attributeName] = _attributeData;
                    } else if (_attributeName === "style") {
                        for (let _name in _attributeData) {
                            _newState[_selectorName][_attributeName][_name] = _attributeData[_name];
                        }
                    }
                }
            }
            return _newState;

        case Constants.CLEAR_STYLE_DATA:
            return {};
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    staticData,
    actionData,
    styleData,
    backgroundData
})

export default rootReducer