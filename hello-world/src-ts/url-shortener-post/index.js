const operation = require('./operation');

/**
 * Get the HTTP body from given event.
 *
 * @param {JSON} event The even provided to Lambda.
 * @returns {JavaScript object} The object contains body data.
 * url and expireAt data if exist.
 * @throws {Error} The error if event's body does not exist.
 */
function getEventBody(event) {
  if (event.body !== null && event.body !== undefined) {
    return JSON.parse(event.body);
  } else {
    throw Error();
  }
}

exports.handler = async (event) => {
  let body = ''; // TODO: what if the body.url not exist?
  try {
    body = getEventBody(event);
  } catch (err) {
    return operation.returnHttpError(400, 'The given HTTP body is invalid.');
  }
  return await operation.shortenUrl(body.url, body.expireAt);
};

