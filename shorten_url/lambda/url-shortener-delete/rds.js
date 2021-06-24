const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
const rdsDataService = new AWS.RDSDataService();

const DATABASE_NAME = 'shortenurldemo';
const TABLE_NAME = 'shorten_url';
const SHORT_URL_ID_COL = 'short_url_id';

const DB_CLUSTER_ARN = process.env.DB_CLUSTER_ARN;
const DB_CRED_SECRET_STORE_ARN = process.env.DB_CRED_SECRET_STORE_ARN;

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
 * Check if the correspondent data of given shorten url id exists in database.
 *
 * @param {string} id The given shorten url id.
 * @return {string} True if data exists. False if not.
 * @throws {Error} The error thrown by executeStatement. Please refer https://amzn.to/3gJWRmr.
 */
async function checkDataExist(id) {
  const sql = `SELECT COUNT(1) FROM ${TABLE_NAME} ` +
    `WHERE ${SHORT_URL_ID_COL} = '${id}'`;
  const result = await executeSql(sql);
  return result.records[0][0].longValue == 1;
}

/**
 * Delete the correspondent data of given shorten url id.
 *
 * @param {string} id The given shorten url id.
 * @return {object} The object returned by RDS executeStatement.
 * For more detail, please refer https://amzn.to/3gJWRmr.
 * @throws {Error} The error thrown by executeStatement. Please refer https://amzn.to/3gJWRmr.
 */
async function deleteData(id) {
  const sql = `DELETE FROM ${TABLE_NAME} ` +
   `WHERE ${SHORT_URL_ID_COL} = '${id}'`;
  return await executeSql(sql);
}

module.exports = {
  checkDataExist,
  deleteData,
};
