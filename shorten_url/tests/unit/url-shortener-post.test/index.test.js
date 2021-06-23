const index = require('../../../lambda/url-shortener-post/index');
const operation = require('../../../lambda/url-shortener-post/operation');

describe('Unit test for exports handler', function () {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('verifies successful response', async () => {
        const body = {
            'url': 'url_test',
            'expireAt': 'expire_test',
        };
        const event = {
            'body': JSON.stringify(body),
        };
        const expectedBody = {
            'url': 'expected_url',
            'expireAt': 'expected_time',
        };
        const expectedResult = {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json' },
            'body': JSON.stringify(expectedBody),
        };
        jest.spyOn(operation, 'shortenUrl').mockReturnValue(expectedResult);
        const result = await index.handler(event);
        expect(result).toEqual(expectedResult);
    });

    it('verifies the case HTTP request has no body', async () => {
        const event = {
            'httpMethod': 'POST',
        };
        const expectedResult = {
            'statusCode': 400,
            'headers': { 'Content-Type': 'application/json' },
            'body': JSON.stringify({ 'message': 'The given HTTP body is invalid.' }),
        };
        jest.spyOn(operation, 'shortenUrl').mockReturnValue('');
        const result = await index.handler(event);
        expect(result).toEqual(expectedResult);
    });
});
