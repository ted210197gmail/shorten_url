const operation = require('../../../lambda/url-shortener-get/operation');
const dbService = require('../../../lambda/url-shortener-get/rds');

function returnHttpError(status, message) {
    return {
        statusCode: status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'message': message }),
    };
}

describe('Unit test for shortenUrl', function () {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Verifies successful response', async () => {
        const longUrl = 'https://google.com';
        const expectedResult = {
            "statusCode": 301,
            "location": longUrl,
        };
        jest.spyOn(dbService, 'getLongUrl').mockReturnValue(longUrl);
        const result = await operation.redirect(longUrl);
        expect(result).toEqual(expectedResult);
        jest.clearAllMocks();
    });

    it('Failed to get id from given url', async () => {
        const result = await operation.redirect(null);
        expect(result).toEqual(returnHttpError(400, 'Failed to get id from given url.'));
        jest.clearAllMocks();
    });

    it('Failed to get url from database', async () => {
        const longUrl = 'https://google.com';
        dbService.getLongUrl.mockImplementation(() => {
            throw new Error();
        });
        const result = await operation.redirect(longUrl);
        expect(result).toEqual(
            returnHttpError(500, 'Failed to get url from database.'));
        jest.clearAllMocks();
    });

    it('Failed to redirect to the target Url', async () => {
        const longUrl = 'https://google.com';
        const expectedResult = returnHttpError(404,
            'Failed to redirect to the target Url. The root causes can be:' +
            ' 1. The Url does not yet be registered in this service' +
            ' 2. The Url has been expired' +
            ' 3. The Url has been deleted');

        jest.spyOn(dbService, 'getLongUrl').mockReturnValue(null);
        const result = await operation.redirect(longUrl);
        expect(result).toEqual(expectedResult);
        jest.clearAllMocks();
    });
});
