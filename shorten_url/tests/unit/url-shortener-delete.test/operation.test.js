const operation = require('../../../lambda/url-shortener-delete/operation');
const dbService = require('../../../lambda/url-shortener-delete/rds');

function returnHttpError(status, message) {
    return {
        statusCode: status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'message': message }),
    };
}

describe('Unit test for shortenUrl', function() {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Verifies successful response', async () => {
    const id = 'CDxFbuEwb001';
    const expectedResult = {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(`Successfully delete the id - ${id}`),
    };
    jest.spyOn(dbService, 'checkDataExist').mockReturnValue(true);
    jest.spyOn(dbService, 'deleteData').mockReturnValue('');
    const result = await operation.deleteUrl(id);
    expect(result).toEqual(expectedResult);
    jest.clearAllMocks();
  });

  it('The shorten url id cannot be found', async () => {
    const result = await operation.deleteUrl(null);
    expect(result).toEqual(
        returnHttpError(400, 'The shorten url id cannot be found in given url.'));
  });

  it('Internal error when checking db', async () => {
    const id = 'CDxFbuEwb001';
    dbService.checkDataExist.mockImplementation(() => {
        throw new Error();
    });
    const result = await operation.deleteUrl(id);
    expect(result).toEqual(
        returnHttpError(500, `Internal error when checking whether - ${id} exists.`));
  });

  it('Verifies successful response', async () => {
      const id = 'CDxFbuEwb001';
      const expectedResult = {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(`Successfully delete the id - ${id}`),
      };
      jest.spyOn(dbService, 'checkDataExist').mockReturnValue(false);
      const result = await operation.deleteUrl(id);
      expect(result).toEqual(
          returnHttpError(404, `The given id - ${id} does not exist in database.`));
      jest.clearAllMocks();
  });

    it('Internal error when deleting id in db', async () => {
      const id = 'CDxFbuEwb001';
      const expectedResult = {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(`Successfully delete the id - ${id}`),
      };
      jest.spyOn(dbService, 'checkDataExist').mockReturnValue(true);
      dbService.deleteData.mockImplementation(() => {
        throw new Error();
      });
      const result = await operation.deleteUrl(id);
      expect(result).toEqual(
        returnHttpError(500, `Internal error when deleting - ${id} in database.`));
      jest.clearAllMocks();
  });
});
