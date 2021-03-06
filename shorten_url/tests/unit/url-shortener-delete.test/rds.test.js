const dbService = require('../../../lambda/url-shortener-delete/rds');

describe('Unit test for checkDataExist', function() {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Verifies successful response - exist', async () => {
    const id = 'kq94y3qs';
    const result = await dbService.checkDataExist(id);
    expect(result).toEqual(true);
    jest.clearAllMocks();
  });

  it('Verifies successful response - not exist', async () => {
    const id = 'not exist';
    const result = await dbService.checkDataExist(id);
    expect(result).toEqual(false);
    jest.clearAllMocks();
  });
});

describe('Unit test for deleteData', function() {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Verifies successful response on not existing data', async () => {
    const id = 'not exist';
    const result = await dbService.deleteData(id);
    const expectedResult = {'generatedFields': [], 'numberOfRecordsUpdated': 0};
    expect(result).toEqual(expectedResult);
    jest.clearAllMocks();
  });
});
