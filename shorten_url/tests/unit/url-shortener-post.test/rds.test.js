const dbService = require('../../../lambda/url-shortener-post/rds');

describe('Unit test for shortenUrl', function() {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Verifies successful response', async () => {
    const longUrl = 'https://www.youtube.com/watch?v=CDxFbuEwb001/2';
    const shortUrlId = 'https://api.awstiny.com/t/iax11tej';
    const expireAt = '2021-02-08 09:20:41';
    const expectedResult =
      {'generatedFields': [], 'numberOfRecordsUpdated': 1};
    const result = await dbService.insertData(longUrl, shortUrlId, expireAt);
    expect(result).toEqual(expectedResult);
    jest.clearAllMocks();
  });
});