/*
 * File application/express/models/dbase/TableNames.js
 * const TableNames = require('application/express/models/dbase/TableNames');
 *
 * Table names store - compute and return table names
 */

const BaseFunctions = require('application/express/functions/BaseFunctions');
const TableNamesConstants = require('application/express/settings/TableNames');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Component = require('application/express/core/parents/Component');

class TableNames extends Component
{
    constructor() {
        super();

        this.tableNames = false;
    }

    // Impossible to set table names in constuctor, because requestId is needed, which is missed at that step
    initTableNames(){
        this.tableNames = {
            [TableNamesConstants['COUNTRY']]: 'country',
            [TableNamesConstants['COUNTRY_NAME']]: 'country_name',
            [TableNamesConstants['COUNTRY_PARAMS']]: 'country_params',
            [TableNamesConstants['COUNTRY_STATES']]: 'country_states',
            [TableNamesConstants['COUNTRY_STATES_CITIES_TRANSLATIONS']]: 'country_states_cities_translations',
            [TableNamesConstants['COUNTRY_STATES_NAMES']]: 'country_states_names',
            [TableNamesConstants['EMAILS_SENDS']]: 'emails_sends',
            [TableNamesConstants['ARTICLES']]: this.getServiceName() + '_articles',
            [TableNamesConstants['GEOCODE_COLLECTION']]: this.getServiceName() + '_geocode_collection',
            [TableNamesConstants['MAP_DATA']]: this.getServiceName() + '_map_data',
            [TableNamesConstants['MAP_PHOTOS']]: this.getServiceName() + '_map_photos',
            [TableNamesConstants['USERS']]: 'users',
            [TableNamesConstants['USERS_REGISTERED']]: 'users_registered'
        };
    }

    /*
     * Get db table name
     *
     * @param {string} name - initial table name
     *
     * @return {string} - prepared table name
     */
    getTableName(name) {

        if (this.tableNames === false) {
            this.initTableNames();
        }

        if (BaseFunctions.isUndefined(this.tableNames[name])) {
            this.error(
                ErrorCodes.ERROR_TABLE_NAME_NOT_FOUND,
                'table name[' + name + ']'
            );
        }
        return this.tableNames[name];
    }

}

TableNames.instanceId = BaseFunctions.unique_id();

module.exports = TableNames;