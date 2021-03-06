/*
 * File server/src/components/base/Cache.js
 * const Cache = require('server/src/components/base/Cache');
 *
 * Cache component - stores information separately for each service and language
 */

const BaseFunctions = require('server/src/functions/BaseFunctions');

let _cache = {}

module.exports = {

    /*
     * Returns referense for stored object
     *
     * @param {string} name - stored object name
     * @param {string} service - service name
     * @param {string} language - language name
     *
     * @returns {object}
     */
    get(name, service, language)
    {
        if (BaseFunctions.isUndefined(_cache[service])) {
            _cache[service] = {};
        }

        if (BaseFunctions.isUndefined(_cache[service][language])) {
            _cache[service][language] = {};
        }

        if (BaseFunctions.isUndefined(_cache[service][language][name])) {
            _cache[service][language][name] = {};
        }

        if (!BaseFunctions.isEmpty(_cache[service][language][name])) {
            //console.log('> GOT FROM CACHE: ' + service + ' ' + language + ' ' + name);
        }
        return _cache[service][language][name];
    }
}


/*
 * Stored objects:
 *
countriesNameByCode[code] = {string}
countriesDataByCode[code] = {object}
stateIdByCode[code] = {integer}
translationsOfStateNames[language][countryCode][stateCode][stateName] = {string}
countriesTranslateCities[language][countryCode][stateCode][cityName] = {string}
administrativeCenters[countryCode][stateCode] = {boolean}
countriesHaveStates[countryCode] = {boolean}
countriesCodes[countryCode] = {string}
countriesParams[countryCode] = {object}
stateNameByCode[stateCode] = {string}
translationsOfStateNames[language][countryCode][stateCode][stateName] = {string}
countriesDataById[id] = {object}
 */