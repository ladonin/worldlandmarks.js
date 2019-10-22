/*
 * File src/modules/Cookies.js
 * import Cookies from 'src/modules/Cookies';
 *
 * Cookies module
 */

import Cookies from 'js-cookie';

export default {

    getCookie(name)
    {
        return Cookies.get(name)
    },


    setCookie(name, value, options = { expires: 365 })
    {
        Cookies.set(name, value, options);
    },


    deleteCookie(name)
    {
        Cookies.remove(name);
    }
}