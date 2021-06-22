const app = require('../../../src-ts/url-shortener-get/index');
const operation = require('../../../src-ts/url-shortener-get/operation');

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
        const expectedResult = {
            "statusCode": 301,
            "headers": {
                "location": 'https://www.youtube.com/watch?v=CDxFbuEwb001/2',
            },
        };
        jest.spyOn(operation, 'redirect').mockReturnValue(expectedResult);
        const result = await app.handler(event);
        expect(result).toEqual(expectedResult);
    });
});
