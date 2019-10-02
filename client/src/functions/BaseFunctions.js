/*
 * File src/functions/BaseFunctions.js
 * import BaseFunctions from 'src/functions/BaseFunctions';
 *
 * Base functions
 */

module.exports = {
    uniqueString(length = 10) {
        let _uniq = Math.random().toString(36).slice(2);
        // toString(36) can return string with 0 on the end, wich will be removed automatically
        // So we add 10 symbols just in case
        _uniq += '0000000000';

        // Then crop
        return _uniq.slice(0, length);
    },
    kickNicescroll(selector) {
        // "Run" this sheet by stuff
        if (document.querySelector(selector)) {
            document.querySelector(selector).scrollTop = 0;
            window.$(selector +" br").remove();
            window.$(selector).append('<br>');
        }
    },
    getFlagUrl(countryCode) {
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
    },
    scrollTo(where, to) {
        // Use universal multibrowser function on jquery
        window.$(where).scrollTo(to);
    },
    setScrollTop(selector, value) {
        // Use universal multibrowser function on jquery
        return window.$(selector).scrollTop(value);
    },
    getCss(selector, param) {
        // Use universal multibrowser function on jquery
        return window.$(selector).css(param);
    },
    setHeight(selector, value) {
        // Use universal multibrowser function on jquery
        window.$(selector).height(value);
    },
    setWidth(selector, value) {
        // Use universal multibrowser function on jquery
        window.$(selector).width(value);
    },
    setCss(selector, param, value) {
        // Use universal multibrowser function on jquery
        window.$(selector).css(param, value);
    },
    show(selector) {
        // Use universal multibrowser function on jquery
        window.$(selector).show();
    },
    hide(selector) {
        // Use universal multibrowser function on jquery
        window.$(selector).hide();
    },
    is(selector, what) {
        // Use universal multibrowser function on jquery
        window.$(selector).is(what);
    },
    niceScroll(selector) {
        // Use universal multibrowser function on jquery
        window.$(selector).niceScroll({cursorcolor: "#444"});
    },
    setVal(selector, value) {
        // Use universal multibrowser function on jquery
        window.$(selector).val(value);
    },
    highlight(target) {
        let _r = document.createRange();
        _r.selectNode(target);
        document.getSelection().addRange(_r);
    },
    trigger(selector, name, value) {
        window.$(selector).trigger(name, value);
    }
}