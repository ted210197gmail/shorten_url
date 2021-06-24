const dbService = require('./rds.js');

/**
 * Return Http response with status code and proper message.
 *
 * @param {string} status The status code of Http response.
 * @param {string} message The error message.
 * @return {JSON Object} The HTTP response with status code and proper message.
 */
function returnHttpError(status, message) {
  return {
    statusCode: status,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'message': message}),
  };
}

/**
 * Redirect to the page according to the given shortened id.
 *
 * @param {string} id The given shortened url id
 * that is required for redirection.
 * @return {JSON Object} The HTTP response with status code as following,
 * 400 - Failed to get id from given url.
 * 500 - Failed to get url from database.
 * 404 - Failed to redirect to the target url.
 * 200 - successfully redirect to the target page.
 */
async function redirect(id) {
  if (id == null) {
    return returnHttpError(400, 'Failed to get id from given url.');
  }
  let longUrl = null;
  try {
    longUrl = await dbService.getLongUrl(id);
  } catch (err) {
    return returnHttpError(500, 'Failed to get url from database.');
  }
  if (longUrl == null) {
    return returnHttpError(404,
        'Failed to redirect to the target Url. The root causes can be:' +
        ' 1. The Url does not yet be registered in this service' +
        ' 2. The Url has been expired' +
        ' 3. The Url has been deleted');
  } else {
    return {
      'statusCode': 301,
      'location': longUrl,
    };
  }
}

module.exports = {
  redirect,
};
