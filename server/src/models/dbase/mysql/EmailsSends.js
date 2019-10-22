/*
 * File server/src/models/dbase/mysql/EmailsSends.js
 * const EmailsSendsModel = require('server/src/models/dbase/mysql/EmailsSends');
 *
 * Emails sends MySql db model - stores sent emails data
 */

const DBaseMysql = require('server/src/core/dbases/Mysql');
const BaseFunctions = require('server/src/functions/BaseFunctions');

class EmailsSendsModel extends DBaseMysql
{
    constructor()
    {
        super();

        this.tableNameInit = this.tableInitNames.EMAILS_SENDS;

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
}

EmailsSendsModel.instanceId = BaseFunctions.uniqueId();
module.exports = EmailsSendsModel;