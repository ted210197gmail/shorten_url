module.exports = {
  deleteUrl,
};

const dbService = require('./rds');

function returnHttpError(status, message) {
  return {
    statusCode: status,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'message': message}),
  };
}

async function deleteUrl(id) {
  if (id == null) {
    return returnHttpError(400,
        'The shorten url id cannot be found in given url.');
  }
  let dataExist = false;
  try {
    dataExist = await dbService.checkDataExist(id);
  } catch (err) {
    return returnHttpError(500,
        `Internal error when checking whether - ${id} exists.`);
  }
  if (dataExist == false) {
    return returnHttpError(404,
        `The given id - ${id} does not exist in database.`);
  }
  try {
    await dbService.deleteData(id);
  } catch (err) {
    return returnHttpError(500,
        `Internal error when deleting - ${id} in database.`);
  }
  return {
    statusCode: 200,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(`Successfully delete the id - ${id}`),
  };
}
