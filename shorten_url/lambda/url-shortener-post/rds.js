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
 * Insert the data into RDS database
 *
 * @param {string} longURL The url that is required to be shortened.
 * @param {string} shortURLId The correspondent shorten url id.
 * @param {string} expireAt The expire time of this url.
 * @return {object} The object returned by RDS executeStatement.
 * For more detail, please refer https://amzn.to/3gJWRmr.
 * @throws {Error} The error thrown by executeStatement. Please refer https://amzn.to/3gJWRmr.
 */
async function insertData(longURL, shortURLId, expireAt) {
  const sql = `INSERT INTO ${TABLE_NAME} (${LONG_URL_COL}, ` +
              `${SHORT_URL_ID_COL}, ${EXPIRE_TIME_COL}) ` +
              `VALUES ('${longURL}', '${shortURLId}', '${expireAt}') ` +
              `ON DUPLICATE KEY UPDATE ` +
              `${SHORT_URL_ID_COL}='${shortURLId}', ` +
              `${EXPIRE_TIME_COL}='${expireAt}'`;
  return await executeSql(sql);
}

module.exports = {
    insertData,
    executeSql,
};