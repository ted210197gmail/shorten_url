const app = require('../../../src-ts/url-shortener-post/index');
const operation = require('../../../src-ts/url-shortener-post/operation');

describe('Unit test for exports handler', function () {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('verifies successful response', async () => {
        const body = {
            'url': 'https://www.youtube.com/watch?v=CDxFbuEwb001/2',
            'expireAt': '2021-02-08 09:20:41',
        };
        const event = {
            'body': JSON.stringify(body),
        };
        const expectedBody = {
            'url': 'expected url',
            'expireAt': '2021-02-08 09:20:41',
        };
        const expectedResult = {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json' },
            'body': JSON.stringify(expectedBody),
        };
        jest.spyOn(operation, 'shortenUrl').mockReturnValue(expectedResult);
        const result = await app.handler(event);
        expect(result).toEqual(expectedResult);
    });

    it('verifies the case that failed to get HTTP body', async () => {
        const event = {
            'httpMethod': 'POST',
        };
        const expectedResult = {
            'statusCode': 400,
            'headers': { 'Content-Type': 'application/json' },
            'body': JSON.stringify({ 'message': 'The given HTTP body is invalid.' }),
        };
        jest.spyOn(operation, 'shortenUrl').mockReturnValue(expectedResult);
        const result = await app.handler(event);
        expect(result).toEqual(expectedResult);
    });
});
