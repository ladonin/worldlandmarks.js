/*
 * File application/express/models/dbase/mysql/EmailsSends.js
 * const EmailsSendsModel = require('application/express/models/dbase/mysql/EmailsSends');
 *
 * Emails sends MySql db model - stores sent emails data
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');

class EmailsSendsModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableName;

        this.fields = {
            map_table:{
                'rules':['db_table_name', 'required'],
            },
            data_id:{
                'rules':['numeric', 'required'],
            },
            from_email:{
                'rules':['email', 'required'],
            },
            from_name:{
                'rules':['name'],
            },
            recipient_email:{
                'rules':['email', 'required'],
            },
            recipient_name:{
                'rules':['name'],
            },
            is_html:{
                'rules':['numeric', 'required'],
            },
            subject:{
                'rules':['required'],
            },
            body:{
                'rules':['required'],
            },
            plain_text:{
                'rules':['required'],
            }
        };

        this.snapshotFieldsData();
    }

    /*
     * Get db table name
     *
     * @return {string} - table name
     */
    getTableName() {
        if (!this.tableName) {
            this.tableName = 'emails_sends';
        }
        return this.tableName;
    }
}

EmailsSendsModel.instanceId = BaseFunctions.unique_id();
module.exports = EmailsSendsModel;