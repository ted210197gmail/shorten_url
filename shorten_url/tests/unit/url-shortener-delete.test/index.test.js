const index = require('../../../lambda/url-shortener-delete/index');
const operation = require('../../../lambda/url-shortener-delete/operation');

describe('Unit test for exports handler', function() {
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
      'statusCode': 200,
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify('Successfully delete the id'),
    };
    jest.spyOn(operation, 'deleteUrl').mockReturnValue(expectedResult);
    const result = await index.handler(event);
    expect(result).toEqual(expectedResult);
  });
});
