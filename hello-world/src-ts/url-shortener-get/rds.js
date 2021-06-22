module.exports = {
    getLongUrl,
};

const AWS = require("aws-sdk");
AWS.config.update({ region: 'eu-west-1' });
const rdsDataService = new AWS.RDSDataService();

const DATABASE_NAME = 'shortenurldemo';
const TABLE_NAME = "shorten_url"; // NOTE - name of your DynamoDB table where you store URLs
const LONG_URL_COL = "long_url";
const SHORT_URL_ID_COL = "short_url_id";
const EXPIRE_TIME_COL = "expire_time";
const DB_CLUSTER_ARN = 'arn:aws:rds:eu-west-1:145997657428:cluster:shortenurldemo';
const DB_CRED_SECRET_STORE_ARN = 'arn:aws:secretsmanager:eu-west-1:145997657428:secret:rds-db-credentials/cluster-NWAXENSTTPLC7KFYY3X3XPRRHQ/admin-HZfsJA';

async function executeSql(sql_cmd) {
    let sqlParams = {
        secretArn: DB_CRED_SECRET_STORE_ARN,
        resourceArn: DB_CLUSTER_ARN,
        sql: sql_cmd,
        database: DATABASE_NAME,
        includeResultMetadata: true,
    };
    return await rdsDataService.executeStatement(sqlParams).promise();
}

async function getLongUrl(id) {
    let sql = `SELECT ${LONG_URL_COL} FROM ${TABLE_NAME} \
                WHERE ${SHORT_URL_ID_COL} = '${id}' AND \
                ${EXPIRE_TIME_COL} > CURRENT_TIMESTAMP`;
    let result = await executeSql(sql);
    if (result.records.length == 0) {
        //return sql;
        return null;
    }
    else {
        return result.records[0][0].stringValue;
    }
}