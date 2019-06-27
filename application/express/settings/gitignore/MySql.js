 /*
 * File application/express/settings/gitignore/MySql.js
 *
 * Connection settings to MySQL
 */

module.exports = {
    type:'mysql',
    connect:{
        database:'wlandmarks',
        user:'root',
        password:'111',
        host:'localhost'
    }
};
