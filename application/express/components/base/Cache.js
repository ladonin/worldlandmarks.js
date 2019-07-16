/*
 * Module application/express/components/base/Cache.js
 * const Cache = require('application/express/components/base/Cache');
 *
 * Cache component - stores information separately for each service and language
 */

const BaseFunctions = require('application/express/functions/BaseFunctions');

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
    get(name, service, language) {

        if (BaseFunctions.isUndefined(_cache[service])) {
            _cache[service] = {};
        }

        if (BaseFunctions.isUndefined(_cache[service][language])) {
            _cache[name][language] = {};
        }

        if (BaseFunctions.isUndefined(_cache[service][language][name])) {
            _cache[service][language][name] = {};
        }

        if (!BaseFunctions.isEmpty(_cache[service][language][name])) {
            console.log('> GOT FROM CACHE: ' + service + ' ' + language + ' ' + name);
        }
        return _cache[service][language][name];
    }
}


/*
 * Stored objects:
 *
countriesNameByCode[code]= name
countriesDataByCode[code]= data
stateIdByCode[code]= id
countriesTranslateStates[language][countryCode][stateCode][stateName] = translation
countriesTranslateCities[language][countryCode][stateCode][cityName] = translation

 */