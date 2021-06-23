const dbService = require('./rds.js');
const DOMAIN_NAME = 'api.awstiny.com/r';

function returnHttpError(status, message) {
    return {
        statusCode: status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'message': message }),
    };
}

async function redirect(id) {
    if (id == null) {
        return returnHttpError(400, 'Failed to get id from given url.');
    }
    try {
        var longUrl = await dbService.getLongUrl(id);
    } catch (err) {
        return returnHttpError(500, 'Failed to get url from database.');
    }
    if (longUrl == null) {
        return returnHttpError(404,
            'Failed to redirect to the target Url. The root causes can be:' +
            ' 1. The Url does not yet be registered in this service' +
            ' 2. The Url has been expired' +
            ' 3. The Url has been deleted');
    }
    else {
        return {
            "statusCode": 301,
            "location": longUrl,
        };
    }
}

module.exports = {
    redirect,
};