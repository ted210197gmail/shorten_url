const dbService = require('./rds');
const {URL, parse} = require('url');
const DOMAIN_NAME = 'api.awstiny.com/t';

const stringIsAValidUrl = (s, protocols) => {
  try {
    new URL(s);
    const parsed = parse(s);
    return protocols ? parsed.protocol ?
    protocols.map((x) => `${x.toLowerCase()}:`).includes(parsed.protocol) :
    false :
    true;
  } catch (err) {
    return false;
  }
};

/**
 * Validate the given time stamp
 *
 * @param {string} timeStamp The timestamp for validation.
 * @return {boolean} True if the timestamp is valid. False if not valid.
 */
function validateTimeStamp(timeStamp) {
  return (new Date(timeStamp)).getTime() > 0;
}

/**
 * Convert the shorten url id to url
 *
 * @param {string} id The given shorten url id
 * @return {string} The proper url with proper domain name and id as path.
 */
function convertToUrl(id) {
  return `https://${DOMAIN_NAME}/${id}`;
}

/**
 * Return Http response with status code and proper message in body.
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
 * Shorten the given Url and store the data into RDS
 *
 * @param {string} longURL The given url that is required to be shortened.
 * @param {string} expireAt The expire time of this url.
 * @return {JSON Object} The HTTP response with status code as following,
 * 400 - if missing url or expire time
 * 422 - if the given url is not valid
 * 422 - if the given url has been shortened.
 * 422 - if the given expire time it not valid
 * 500 - failed to insert data into RDS
 * 200 - successfully shorten the url and store data into RDS
 */
async function shortenUrl(longURL, expireAt) {
  if (longURL == null || expireAt == null) {
    return returnHttpError(400, 'Missing Url or expire time.');
  }
  if (stringIsAValidUrl(longURL) == false) {
    return returnHttpError(422, `The given URL - ${longURL} is not valid.`);
  }
  if (longURL.includes(DOMAIN_NAME)) {
    return returnHttpError(422,
        'You cannot shorten the Url created from this service.');
  }
  if (validateTimeStamp(expireAt) == false) {
    return returnHttpError(422, 'The given expire time is not valid.');
  }
  const id = Date.now().toString(36);
  try {
    await dbService.insertData(longURL, id, expireAt);
  } catch (err) {
    return returnHttpError(500,
        `Failed to insert (${longURL}, ` +
        `${id}, ${expireAt}) into database (${err}).`);
  }
  const shortUrl = convertToUrl(id);
  return {
    statusCode: 200,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'id': id, 'shorUrl': shortUrl}),
  };
}

module.exports = {
    shortenUrl,
    returnHttpError,
};
