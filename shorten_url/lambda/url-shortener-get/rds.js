const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
const rdsDataService = new AWS.RDSDataService();

const DATABASE_NAME = 'shortenurldemo';
const TABLE_NAME = 'shorten_url';
const LONG_URL_COL = 'long_url';
const SHORT_URL_ID_COL = 'short_url_id';
const EXPIRE_TIME_COL = 'expire_time';
const DB_CLUSTER_ARN = 'arn:aws:rds:eu-west-1:145997657428' +
    ':cluster:shortenurldemo';
const DB_CRED_SECRET_STORE_ARN = 'arn:aws:secretsmanager:eu-west-1:' +
    '145997657428:secret:rds-db-credentials/' +
    'cluster-NWAXENSTTPLC7KFYY3X3XPRRHQ/admin-HZfsJA';

/**
 * Execute RDS with given SQL command.
 *
 * @param {string} sqlCmd The given sql command for RDS execution.
 * @return {object} The object returned by RDS executeStatement.
 * For more detail, please refer https://amzn.to/3gJWRmr.
 * @throws {Error} The error thrown by executeStatement. Please refer https://amzn.to/3gJWRmr.
 */
async function executeSql(sqlCmd) {
  const sqlParams = {
    secretArn: DB_CRED_SECRET_STORE_ARN,
    resourceArn: DB_CLUSTER_ARN,
    sql: sqlCmd,
    database: DATABASE_NAME,
    includeResultMetadata: true,
  };
  return await rdsDataService.executeStatement(sqlParams).promise();
}

/**
 * Get the correspondent long url by given shortened url id.
 *
 * @param {string} id The given shorten url id.
 * @return {string} The long url if exists. Null if not exists.
 * @throws {Error} The error thrown by executeStatement. Please refer https://amzn.to/3gJWRmr.
 */
async function getLongUrl(id) {
  const sql = `SELECT ${LONG_URL_COL} FROM ${TABLE_NAME} \
            WHERE ${SHORT_URL_ID_COL} = '${id}' AND \
            ${EXPIRE_TIME_COL} > CURRENT_TIMESTAMP`;
  const result = await executeSql(sql);
  if (result.records.length == 0) {
    return null;
  } else {
    return result.records[0][0].stringValue;
  }
}

module.exports = {
  getLongUrl,
};
