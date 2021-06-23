const dbService = require('../../../lambda/url-shortener-get/rds');

describe('Unit test for getLongUrl', function() {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Verifies successful response - exist', async () => {
    const id = 'kq94y3qs';
    const result = await dbService.getLongUrl(id);
    expect(result).toEqual('https://www.netflix.com');
    jest.clearAllMocks();
  });

  it('Verifies fail response - exist but expired', async () => {
    const id = 'kq950e1k';
    const result = await dbService.getLongUrl(id);
    expect(result).toEqual(null);
    jest.clearAllMocks();
  });

  it('Verifies fail response - not exist', async () => {
    const id = 'not exist';
    const result = await dbService.getLongUrl(id);
    expect(result).toEqual(null);
    jest.clearAllMocks();
  });
});
