/*
 * File src/functions/BaseFunctions.js
 * import BaseFunctions from 'src/functions/BaseFunctions';
 *
 * Base functions
 */

module.exports = {
    uniqueString(length = 10){
        return Math.random().toString(36).slice(2).substr(0,length);
    },
    getFlagUrl(countryCode){
        return '/public/img/flags/' + countryCode + '.png';
    }
}