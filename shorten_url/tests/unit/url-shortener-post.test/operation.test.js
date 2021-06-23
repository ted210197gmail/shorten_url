const operation = require('../../../lambda/url-shortener-post/operation');
const dbService = require('../../../lambda/url-shortener-post/rds');

describe('Unit test for shortenUrl', function() {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Verifies successful response', async () => {
    const longUrl = 'https://www.youtube.com/watch?v=CDxFbuEwb001/2';
    const expireAt = '2021-02-08 09:20:41';
    const MockDate = require('mockdate');
    // mock the Date module to make sure the ID is expected
    MockDate.set(1434319925275);
    const expectedBody = {
      'id': 'iax11tej',
      'shorUrl': 'https://api.awstiny.com/t/iax11tej',
    };
    const expectedResult = {
      'statusCode': 200,
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify(expectedBody),
    };
    jest.spyOn(dbService, 'insertData').mockReturnValue('');
    const result = await operation.shortenUrl(longUrl, expireAt);
    expect(result).toEqual(expectedResult);
    MockDate.reset();
    jest.clearAllMocks();
  });

  it('Missing Url or expire time', async () => {
    const longUrl = 'https://www.youtube.com/watch?v=CDxFbuEwb001/2';
    const expireAt = '2021-02-08 09:20:41';
    // case 1: missing the longUrl
    const result = await operation.shortenUrl(null, expireAt);
    expect(result).toEqual(
        operation.returnHttpError(400, 'Missing Url or expire time.'));
    // case 2: missing the expired time
    const resultNoExpire = await operation.shortenUrl(longUrl, null);
    expect(resultNoExpire).toEqual(
        operation.returnHttpError(400, 'Missing Url or expire time.'));
  });

  it('Given url is not valid', async () => {
    const longUrl = '123';
    const expireAt = '2021-02-08 09:20:41';
    const result = await operation.shortenUrl(longUrl, expireAt);
    expect(result).toEqual(operation.returnHttpError(422,
        `The given URL - ${longUrl} is not valid.`));
  });

  it('Given the shortened Url', async () => {
    const longUrl = 'https://api.awstiny.com/t/iax11tej';
    const expireAt = '2021-02-08 09:20:41';
    const result = await operation.shortenUrl(longUrl, expireAt);
    expect(result).toEqual(operation.returnHttpError(422,
        'You cannot shorten the Url created from this service.'));
  });

  it('Invalid timestamp', async () => {
    const longUrl = 'https://www.youtube.com/watch?v=CDxFbuEwb001/2';
    const expireAt = 'hahaha';
    const result = await operation.shortenUrl(longUrl, expireAt);
    expect(result).toEqual(operation.returnHttpError(422,
        'The given expire time is not valid.'));
  });

  it('Failed to insert data', async () => {
    const longUrl = 'https://www.youtube.com/watch?v=CDxFbuEwb001/2';
    const expireAt = '2021-02-08 09:20:41';
    dbService.insertData.mockImplementation(() => {
      throw new Error();
    });
    const MockDate = require('mockdate');
    // mock the Date module to make sure the ID is expected
    MockDate.set(1434319925275);
    const id = 'iax11tej';
    const err = '(Error)';
    const result = await operation.shortenUrl(longUrl, expireAt);
    const expectedResult = operation.returnHttpError(500,
        `Failed to insert (${longUrl}, ${id}, ` +
        `${ expireAt }) into database ${ err }.`);
    expect(result).toEqual(expectedResult);
    MockDate.reset();
    jest.clearAllMocks();
  });
});
