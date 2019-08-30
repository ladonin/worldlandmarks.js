/*
 * File src/modules/Events.js
 * import Events from 'src/modules/Events';
 *
 * Events module - for add/remove events
 */

import Consts from 'src/settings/Constants';

let _events = {};

export default {
    /*
     * Add event listener
     *
     * @param {string} name - event name
     * @param {function} callback - event listener callback
     */
    add(name, callback) {
        if (typeof _events[name] === 'undefined') {
            _events[name] = [];
        }
        if (!_events[name].includes(callback)) {
            _events[name].push(callback);
            document.addEventListener(name, callback);
        }
    },

    /*
     * Remove listener or all listeners of current event
     *
     * @param {string} name - event name
     * @param {function} callback - event listener callback, if not passed,
     *  then removed all listeners of current event
     */
    remove(name, callback = false) {
        if (callback === false) {
            for (let _index in _events[name]) {
                document.removeEventListener(name, _events[name][_index]);
            }
        } else {
            document.removeEventListener(name, callback);
        }
    },

    /*
     * Log event listeners
     *
     * @param {string} name - event name, if not passed,
     *  then log list for all event names
     */
    getListeners(name){
        console.log('');
        console.log('');
        console.log('Event listeners list:');

        if (!name) {
            for (let _name in _events) {
                console.log('Event name: ' + _name);
                for (let _index in _events[_name]) {
                    console.log(_events[_name][_index]);
                }
                console.log('');
            }
        } else {
            console.log('Event name: ' + name);
            for (let _index in _events[name]) {
                console.log(_events[name][_index]);
            }
        }
        console.log('');
        console.log('');
    },

    /*
     * Dispatch event
     *
     * @param {string} name - event name
     * @param {object} data - listener data
     */
    dispatch(name, data){
        document.dispatchEvent(new CustomEvent(name, {detail:data}));
    }
}