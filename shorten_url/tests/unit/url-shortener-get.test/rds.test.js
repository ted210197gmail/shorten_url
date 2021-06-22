const dbService = require('../../../src-ts/url-shortener-get/rds');

describe('Unit test for getLongUrl', function () {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Verifies successful response - exist', async () => {
        const id = 'existId';
        const result = await dbService.getLongUrl(id);
        expect(result).toEqual('https://www.exist.com/');
        jest.clearAllMocks();
    });

    it('Verifies successful response - not exist', async () => {
        const id = 'not exist';
        const result = await dbService.getLongUrl(id);
        expect(result).toEqual(null);
        jest.clearAllMocks();
    });
});