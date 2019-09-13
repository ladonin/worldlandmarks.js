/*
 * File server/src/components/base/Cookies.js
 *
 * Common cookies component
 */


const CookiesModule = require('cookies');

const Responce = require('server/src/components/base/Responce');


// Optionally define keys to sign cookie values to prevent client tampering
let keys = require('server/src/settings/gitignore/Client').cookies_key;

let cookies = new CookiesModule(Request.getRequest(), Responce.getResponce(), {keys: keys})

module.exports = {
    get: (name) => {
        return cookies.get(name, {signed: true});
    },
    set: (name, value) => {
        cookies.set(name, value, { signed: true });
    }
}