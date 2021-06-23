const dbService = require('./rds');

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
 * Delete the given Url and store the data (longUrl, shortId, expireAt) into RDS
 *
 * @param {string} id The given shortened url id that is required to be deleted.
 * @return {JSON Object} The HTTP response with status code as following,
 * 400 - The shorten url id cannot be found in given url
 * 500 - Internal error when accessing database
 * 404 - The id does not exist in database.
 * 200 - successfully delete the correspondent data.
 */
async function deleteUrl(id) {
  if (id == null) {
    return returnHttpError(400,
        'The shorten url id cannot be found in given url.');
  }
  let dataExist = false;
  try {
    dataExist = await dbService.checkDataExist(id);
  } catch (err) {
    return returnHttpError(500,
        `Internal error when checking whether - ${id} exists.`);
  }
  if (dataExist == false) {
    return returnHttpError(404,
        `The given id - ${id} does not exist in database.`);
  }
  try {
    await dbService.deleteData(id);
  } catch (err) {
    return returnHttpError(500,
        `Internal error when deleting - ${id} in database.`);
  }
  return {
    statusCode: 200,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(`Successfully delete the id - ${id}`),
  };
}

module.exports = {
  deleteUrl,
};
