/*
 * File src/functions/BaseFunctions.js
 * import BaseFunctions from 'src/functions/BaseFunctions';
 *
 * Base functions
 */

module.exports = {
    uniqueString(length = 10){
        let _uniq = Math.random().toString(36).slice(2);
        // toString(36) can return string with 0 on the end, wich will be removed automatically
        // So we add 10 symbols just in case
        _uniq += '0000000000';

        // Then crop
        return _uniq.slice(0,length);
    },
    getFlagUrl(countryCode){
        return '/img/flags/' + countryCode + '.png';
    },
    getWidth(selector) {
        // For example window.innerWidth != $(window).width();
        // So use universal multibrowser function on jquery
        return window.$(selector).width();
    },
    getHeight(selector) {
        // Use universal multibrowser function on jquery
        return window.$(selector).height();
    },
    getScrollTop(selector) {
        // Use universal multibrowser function on jquery
        return window.$(selector).scrollTop();
    }
}